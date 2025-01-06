"use client"
import { useState } from "react";

type SelectedAnswers = {
    [questionId: number]: number[];
};

type Question = {
    id: number;
    topic_id: number;
    question_text: string;
    allow_multiple: boolean;
    answers: Answer[];
};

type Answer = {
    id: number;
    answer_text: string;
    is_correct?: boolean;
}

type ClientQuestionProps = {
    questions: Question[];
};

export default function ClientQuestion({ questions }: ClientQuestionProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

    const topicId = questions[0]?.topic_id || "Unknown Topic";

    const handleSingleSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers((prev: SelectedAnswers) => ({
            ...prev,
            [questionId]: [answerIndex],
        }));
    };

    const handleMultipleSelect = (questionId: number, answerIndex: number) => {
        setSelectedAnswers((prev: SelectedAnswers) => {
            const currentAnswers = prev[questionId] || [];
            const updatedAnswers = currentAnswers.includes(answerIndex)
                ? currentAnswers.filter((i) => i !== answerIndex)
                : [...currentAnswers, answerIndex];

            return {
                ...prev,
                [questionId]: updatedAnswers,
            };
        });
    };

    return (
        <div>
            {questions.length > 0 ? (
                questions.map((question) => (
                    <div key={question.id}>
                        <fieldset>
                            <legend>{question.question_text}</legend>
                            {question.answers.map((answer, index) => (
                                <label key={index} style={{ display: 'block', margin: '5px 0', cursor: 'pointer', }}>
                                    <input
                                        type={question.allow_multiple ? 'checkbox' : 'radio'}
                                        name={`question.${question.id}`}
                                        value={index}
                                        checked={
                                            question.allow_multiple
                                                ? selectedAnswers[question.id]?.includes(index)
                                                : selectedAnswers[question.id]?.[0] === index}
                                        onChange={() => 
                                            question.allow_multiple
                                                ? handleMultipleSelect(question.id, index)
                                                : handleSingleSelect(question.id, index)}
                                    />
                                    {answer.answer_text}
                                </label>
                            ))}
                        </fieldset>
                    </div>
                ))
            ) : (
                <p>No questions available.</p>
            )}
        </div>
    );
}