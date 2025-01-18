"use client"
import { BaseAnswer, Question, StoredAnswer } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

type editableAnswer = BaseAnswer | StoredAnswer;

export default function TeacherViewQuiz({ questions, topicId }: ClientQuestionProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [editableQuestion, setEditableQuestion] = useState<string>('');
    const [editableAnswers, setEditableAnswers] = useState<editableAnswer[]>([]);

    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex];
        setEditableQuestion(currentQuestion.question_text);
        setEditableAnswers(currentQuestion.answers);
    }, [currentQuestionIndex, questions])

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


            const { error: answersError } = await supabase
                .from("answers")
                .upsert(editableAnswers, { onConflict: "id" });

            if (answersError) {
                throw new Error(`Error updating answers: ${answersError.message}`);
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
                i === index ? { ...answer, [field]: value } : answer
            )
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div>
            <fieldset>
                <legend>
                    <input type="text" value={editableQuestion} onChange={(e) => setEditableQuestion(e.target.value)} />
                </legend>

                {currentQuestion.answers.map((_, index) => (
                    <div key={index}>
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

                ))}
            </fieldset>

            <div>
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    previous
                </button>

                <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                </button>

                <button onClick={() => handleUpdateQuestion(currentQuestion.id)}>
                    Update Question
                </button>

                <button onClick={() => handleRemoveQuestion(currentQuestion.id)}>
                    remove question
                </button>
            </div>

            <Link href={`/topics/${topicId}`}>
                Leave Quiz
            </Link>
        </div>

    );
}