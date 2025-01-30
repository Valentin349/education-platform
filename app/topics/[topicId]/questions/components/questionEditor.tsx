import { Answer, Question } from "@/lib/types"
import { useEffect, useState } from "react";


type QuestionEditorProps = {
    question: Question;
    onUpdateQuestion: (questionId: number, updatedText: string, updateAnswers: Answer[], deletedAnswerIds: number[]) => Promise<void>;
    onRemoveQuestion: (questionId: number) => Promise<void>
}

export function QuestionEditor({ question, onUpdateQuestion, onRemoveQuestion }: QuestionEditorProps) {
    const [questionText, setQuestionText] = useState<string>(question.question_text);
    const [answers, setAnswers] = useState<Answer[]>(question.answers);
    const [deletedAnswerIds, setDeletedAnswerIds] = useState<number[]>([]);

    useEffect(() => {
        setQuestionText(question.question_text);
        setAnswers(question.answers);
    }, [question]);

    const handleAnswerChange = (index: number, field: keyof Answer, value: string | boolean): void => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
        setAnswers(updatedAnswers);
    }

    const handleRemoveAnswer = (index: number): void => {
        if (answers.length < 2) return;

        const removedAnswer = answers[index];
        if (removedAnswer.id !== undefined) {
            setDeletedAnswerIds((prev) => [...prev, removedAnswer.id as number]);
        }

        setAnswers((prev) => prev.filter((_, i) => i !== index));
    }

    const handleAddAnswer = (): void => {
        if (answers.length < 4) {
            setAnswers([...answers, { answer_text: '', is_correct: false }]);
        }
    }

    const handleUpdate = (): void => {
        onUpdateQuestion(question.id, questionText, answers, deletedAnswerIds);
    }

    return (
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
                            handleAnswerChange(index, "answer_text", e.target.value)
                        }
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={answer.is_correct}
                            onChange={(e) =>
                                handleAnswerChange(index, "is_correct", e.target.checked)
                            }
                        />
                        Correct
                    </label>
                    <button onClick={() => handleRemoveAnswer(index)} disabled={answers.length <= 2}>remove</button>
                </div>

            ))}

            <button type="button" onClick={handleAddAnswer} disabled={answers.length >= 4}>
                Add Answer
            </button>

            <button onClick={handleUpdate}>
                Update Question
            </button>

            <button onClick={() => onRemoveQuestion(question.id)}>
                Remove question
            </button>
        </fieldset>
    );
}