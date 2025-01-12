"use client"
import { getCurrentUser } from "@/lib/mockUsers";
import { Question } from "@/lib/types";
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
    const [editableQuestion, setEditableQuestion] = useState<string>(currentQuestion.question_text);

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
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
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
                    <label key={index} style={{ display: 'block', margin: '5px 0', cursor: 'pointer', }}>
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