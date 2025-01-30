"use client"
import { Question } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { QuizNavigation } from "./components/quizNavigation";

type SelectedAnswers = {
    [questionId: number]: number[];
};

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

export default function StudentViewQuiz({ questions, topicId }: ClientQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

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

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div>
            <fieldset>
                <legend>{currentQuestion.question_text}</legend>
                {currentQuestion.answers.map((answer, index) => (
                    <label key={index}>
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
            <QuizNavigation
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                onPrevious={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                onNext={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
            />

            <Link href={`/topics/${topicId}`}>
                Leave Quiz
            </Link>
        </div>

    );
}