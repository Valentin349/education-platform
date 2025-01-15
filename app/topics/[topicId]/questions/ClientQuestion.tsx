"use client"
import { getCurrentUser } from "@/lib/mockUsers";
import { BaseAnswer, Question, StoredAnswer } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SelectedAnswers = {
    [questionId: number]: number[];
};

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

type editableAnswer = BaseAnswer | StoredAnswer;

export default function ClientQuestion({ questions, topicId }: ClientQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [editableQuestion, setEditableQuestion] = useState<string>('');
    const [editableAnswers, setEditableAnswers] = useState<editableAnswer[]>([]);

    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex];
        setEditableQuestion(currentQuestion.question_text);
        setEditableAnswers(currentQuestion.answers);
    }, [currentQuestionIndex, questions])

    const user = getCurrentUser();

    const handleAnswerSelect = (questionId: number, answerIndex: number, allowMultiple: boolean) => {
        setSelectedAnswers((prev: SelectedAnswers) => {
            const currentAnswers = prev[questionId] || [];
            const updatedAnswers = allowMultiple
                ? currentAnswers.includes(answerIndex)
                    ? currentAnswers.filter((i) => i !== answerIndex)
                    : [...currentAnswers, answerIndex]
                : [answerIndex];

            return {
                ...prev,
                [questionId]: updatedAnswers,
            };
        });
    };

    const handleUpdateQuestion = async (questionId: number) => {
        // TODO abstract function
        const supabase = createClient();
        try {
            const { error: questionError } = await supabase
                .from("questions")
                .update({ question_text: editableQuestion })
                .eq("id", questionId);

            if (questionError) {
                throw new Error(`Error updating question: ${questionError.message}`);
            }

            // TODO add upsert existing answers that have an ID answers
            // separate new answers (no id) and existing answers (id)
            const newAnswers = editableAnswers.filter((answer): answer is BaseAnswer => !("id" in answer));
            const existingAnswers = editableAnswers.filter((answer): answer is StoredAnswer => "id" in answer);

            if (existingAnswers.length > 0) {
                const { error: existingAnswersError } = await supabase
                    .from('answers')
                    .update(
                        existingAnswers.map((answer) => ({
                            answer_text: answer.answer_text,
                            is_correct: answer.is_correct,
                        }))
                    )
                    .eq("id", existingAnswers.map((answer) => answer.id));

                if (existingAnswersError) {
                    throw new Error(`Error updating existing Answer: ${existingAnswersError.message}`);
                }
            }


            // TODO Insert answers that dont have ID
            if (newAnswers.length > 0) {
                const { error: newAnswerError } = await supabase
                    .from("answers")
                    .insert(
                        newAnswers.map((answer) => ({
                            question_id: questionId,
                            answer_text: answer.answer_text,
                            is_correct: answer.is_correct
                        }))
                    );

                if (newAnswerError) {
                    throw new Error(`Error inserting new answers: ${newAnswerError.message}`);
                }
            }


            alert("Question and answers updated successfully!");
        } catch (error: any) {
            alert(error.message || "An error occurred while updating the question.");
        }

    }

    const handleRemoveQuestion = async (questionId: number) => {
        // TODO implement supabase REMOVE 
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const handleAnswerChange = (index: number, field: keyof BaseAnswer, value: string | boolean) => {
        setEditableAnswers((prevAnswers) =>
            prevAnswers.map((answer, i) =>
                i === index ? { ...answer, [field]: value, answer } : answer
            )
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div>
            <fieldset>
                <legend>
                    {user.role === 'teacher' ? (
                        <input type="text" value={editableQuestion} onChange={(e) => setEditableQuestion(e.target.value)} />
                    ) : (
                        currentQuestion.question_text
                    )}
                </legend>

                {currentQuestion.answers.map((answer, index) => (
                    <div key={index}>
                        {user.role === 'teacher' ? (
                            <div>
                                <input
                                    type="text"
                                    value={editableAnswers[index]?.answer_text || ""}
                                    onChange={(e) =>
                                        handleAnswerChange(index, "answer_text", e.target.value)
                                    }
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editableAnswers[index]?.is_correct || false}
                                        onChange={(e) =>
                                            handleAnswerChange(index, "is_correct", e.target.checked)
                                        }
                                    />
                                    Correct
                                </label>
                            </div>
                        ) : (
                            <label style={{ display: 'block', margin: '5px 0', cursor: 'pointer', }}>
                                <input
                                    type={currentQuestion.allow_multiple ? 'checkbox' : 'radio'}
                                    name={`question-${currentQuestion.id}`}
                                    value={index}
                                    checked={
                                        currentQuestion.allow_multiple
                                            ? selectedAnswers[currentQuestion.id]?.includes(index)
                                            : selectedAnswers[currentQuestion.id]?.[0] === index}
                                    onChange={() =>
                                        handleAnswerSelect(
                                            currentQuestion.id,
                                            index,
                                            currentQuestion.allow_multiple,
                                        )
                                    }
                                />
                                {answer.answer_text}
                            </label>
                        )}
                    </div>

                ))}
            </fieldset>

            <div>
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    previous
                </button>
                <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                </button>

                {user.role === 'teacher' && (
                    <div>
                        <button onClick={() => handleUpdateQuestion(currentQuestion.id)}>
                            Update Question
                        </button>

                        <button onClick={() => handleRemoveQuestion(currentQuestion.id)}>
                            remove question
                        </button>
                    </div>
                )}
            </div>

            <Link href={`/topics/${topicId}`}>
                Leave Quiz
            </Link>
        </div>

    );
}