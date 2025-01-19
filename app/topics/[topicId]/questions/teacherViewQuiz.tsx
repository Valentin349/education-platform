"use client"
import { BaseAnswer, Question, StoredAnswer } from "@/lib/types";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

type editableAnswer = BaseAnswer | StoredAnswer;

export default function TeacherViewQuiz({ questions, topicId }: ClientQuestionProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questionText, setQuestionText] = useState<string>('');
    const [answers, setAnswers] = useState<editableAnswer[]>([]);

    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex];
        setQuestionText(currentQuestion.question_text);
        setAnswers(currentQuestion.answers);
    }, [currentQuestionIndex, questions])

    const updateQuestion = async (questionId: number): Promise<void> => {
        // TODO abstract function
        const supabase = createClient();
        try {
            const { error: questionError } = await supabase
                .from("questions")
                .update({ question_text: questionText })
                .eq("id", questionId);

            if (questionError) {
                throw new Error(`Error updating question: ${questionError.message}`);
            }

            // TODO set id to undefined if new answer

            const { error: answersError } = await supabase
                .from("answers")
                .upsert(answers, { onConflict: "id" });

            if (answersError) {
                throw new Error(`Error updating answers: ${answersError.message}`);
            }

            alert("Question and answers updated successfully!");
        } catch (error: any) {
            alert(error.message || "An error occurred while updating the question.");
        }

    }

    const removeQuestion = async (questionId: number): Promise<void> => {
        // TODO implement supabase REMOVE of whole question 
    }

    const handlePrevious = (): void => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const handleNext = (): void => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    const answerChange = (index: number, field: keyof BaseAnswer, value: string | boolean): void => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
        setAnswers(updatedAnswers);
    }

    const removeAnswer = (index: number, event: MouseEvent<HTMLButtonElement>): void => {
        // TODO update remove answer so that database also gets updated
        event.preventDefault();
        if (answers.length > 2) {
            const updatedAnswers = [...answers];
            updatedAnswers.splice(index, 1)
            setAnswers(updatedAnswers)
        }
    }

    const addAnswer = (): void => {
        // TODO addAnswer needs to update on the databse 
        if (answers.length < 4) {
            setAnswers([...answers, { answer_text: '', is_correct: false }])
        }
    }

    return (
        <div>
            <fieldset>
                <legend>
                    <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                </legend>

                {answers.map((answer, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            value={answer.answer_text}
                            placeholder={`Answer ${index + 1}`}
                            onChange={(e) =>
                                answerChange(index, "answer_text", e.target.value)
                            }
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={answer.is_correct}
                                onChange={(e) =>
                                    answerChange(index, "is_correct", e.target.checked)
                                }
                            />
                            Correct
                        </label>
                        <button onClick={(event) => removeAnswer(index, event)} disabled={answers.length <= 2}>remove</button>
                    </div>

                ))}

                <button type="button" onClick={addAnswer} disabled={answers.length >= 4}>
                    Add Answer
                </button>
            </fieldset>

            <div>
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    previous
                </button>

                <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                </button>

                <button onClick={() => updateQuestion(questions[currentQuestionIndex].id)}>
                    Update Question
                </button>

                <button onClick={() => removeQuestion(questions[currentQuestionIndex].id)}>
                    remove question
                </button>
            </div>

            <Link href={`/topics/${topicId}`}>
                Leave Quiz
            </Link>
        </div>

    );
}