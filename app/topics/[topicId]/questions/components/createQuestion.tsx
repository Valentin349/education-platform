'use client'

import RoleBasedView from "@/components/RoleBasedView";
import { useState } from "react"
import { createQuestion } from "@/lib/questions.client";
import { BaseAnswer } from "@/lib/types";

type CreateQuestionProps = {
    topicId: string;
    onQuestionCreated?: () => Promise<void>;
}

export function CreateQuestion({ topicId, onQuestionCreated }: CreateQuestionProps) {
    const [questionText, setQuestionText] = useState<string>('');
    const [answers, setAnswers] = useState<BaseAnswer[]>([
        { answer_text: '', is_correct: false },
        { answer_text: '', is_correct: false },
    ]);

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!questionText) {
            alert('Please write a quesiton');
            return;
        }

        const hasCorrectAnswer = answers.some(answers => answers.is_correct);
        if (!hasCorrectAnswer) {
            alert('You need at least one correct answer');
            return;
        }

        const allowMultiple = answers.filter(answer => answer.is_correct).length > 1;

        try {
            setLoading(true);

            await createQuestion(topicId, questionText, allowMultiple, answers);

            if (onQuestionCreated) {
                onQuestionCreated();
            }
            alert('successfully created quetsion');
            setQuestionText('');
            setAnswers([
                { answer_text: '', is_correct: false },
                { answer_text: '', is_correct: false },
            ])
        } catch (err: any) {
            alert(err.message || 'An error occured while creating a quesiton');
        } finally {
            setLoading(false);
        }
    }

    const updateAnswer = (index: number, value: string) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index].answer_text = value;
        setAnswers(updatedAnswers);
    }

    const toggleCorrectAnswer = (index: number) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index].is_correct = !updatedAnswers[index].is_correct;
        setAnswers(updatedAnswers);
    }

    const removeAnswer = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (answers.length > 2) {
            const updatedAnswers = [...answers];
            updatedAnswers.splice(index, 1)
            setAnswers(updatedAnswers)
        }
    }

    const handleAddAnswer = () => {
        if (answers.length < 4) {
            setAnswers([...answers, { answer_text: '', is_correct: false }])
        }
    }

    return (
        <RoleBasedView allowedRoles={['teacher']}>
            <div>
                <form>
                    <input type="text" name="question" placeholder="Question" value={questionText} onChange={(e) => setQuestionText(e.target.value.trim())} />
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <input type="text" placeholder={`Answer ${index + 1}`} value={answer.answer_text} onChange={(e) => updateAnswer(index, e.target.value)} />
                            <label>
                                Correct
                                <input type="checkbox" checked={answer.is_correct} onChange={() => toggleCorrectAnswer(index)} />
                            </label>
                            <button onClick={(event) => removeAnswer(index, event)} disabled={answers.length <= 2}>remove</button>
                        </div>
                    ))}

                    {/* Add answer button */}
                    <button type="button" onClick={handleAddAnswer} disabled={answers.length >= 4}>
                        Add Answer
                    </button>

                    <button type="button" onClick={handleSubmit}>
                        {isLoading ? 'Loading...' : 'Create'}
                    </button>
                </form>
            </div>
        </RoleBasedView>
    );
}