"use client"
import { getCurrentUser } from "@/lib/mockUsers";
import { BaseAnswer, Question, StoredAnswer } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

type SelectedAnswers = {
    [questionId: number]: number[];
};

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

export default function ClientQuestion({ questions, topicId }: ClientQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const currentQuestion = questions[currentQuestionIndex];
    console.log(currentQuestion);
    const [editableQuestion, setEditableQuestion] = useState<string>(currentQuestion.question_text);
    const [editableAnswers, setEditableAnswers] = useState<BaseAnswer[]>(currentQuestion.answers);

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
        // implement supabase UPDATE 
    }

    const handleRemoveQuestion = async (questionId: number) => {
        // implement supabase REMOVE 
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            //setEditableQuestion(currentQuestion.question_text);
            //setEditableAnswers(currentQuestion.answers);
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            //setEditableQuestion(currentQuestion.question_text);
            //setEditableAnswers(currentQuestion.answers);
        }
    }

    const handleAnswerChange = (index: number, field: keyof BaseAnswer, value: string | boolean) => {
        setEditableAnswers((prevAnswers) =>
            prevAnswers.map((answer, i) =>
                i === index ? { ...answer, [field]: value, answer } : answer
            )
        );
    }

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