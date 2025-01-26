"use client"
import { BaseAnswer, Question, StoredAnswer } from "@/lib/types";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CreateQuestion from "./createQuestion";
import { getQuestionsByTopic } from "@/lib/questions.server";

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

type editableAnswer = BaseAnswer | StoredAnswer;
// TODO refactor
export default function TeacherViewQuiz({ questions: initialQuestions, topicId }: ClientQuestionProps) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questionText, setQuestionText] = useState<string>('');
    const [answers, setAnswers] = useState<editableAnswer[]>([]);
    const [deletedAnswerIds, setDeletedAnswerIds] = useState<number[]>([])
    const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false)

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

            // Delete answers before updating answers
            if (deletedAnswerIds.length > 0) {
                const { error: deleteError } = await supabase
                    .from("answers")
                    .delete()
                    .in("id", deletedAnswerIds);

                if (deleteError) {
                    throw new Error(`Error updating question: ${deleteError.message}`);
                }
            }

            // Upsert ALL answers for a given question.
            const existingAnswers = answers.filter((answer) => 'id' in answer);
            const newAnswers = answers
                .filter((answer) => !('id' in answer))
                .map((answer) => ({
                    ...answer,
                    question_id: questionId
                }));
            
            if (existingAnswers.length > 0) {
                const { error: upsertAnswerError } = await supabase
                    .from("answers")
                    .upsert(existingAnswers, { onConflict: "id" });

                if (upsertAnswerError) {
                    throw new Error(`Error upserting answers: ${upsertAnswerError.message}`);
                }
            }

            if (newAnswers.length > 0) {
                console.log(newAnswers);
                const { error: insertAnswerError } = await supabase
                    .from('answers')
                    .insert(newAnswers);

                if (insertAnswerError) {
                    throw new Error(`Error inserting answers: ${insertAnswerError.message}`);
                }
            }

            setDeletedAnswerIds([]);
            alert("Question and answers updated successfully!");
        } catch (error: any) {
            alert(error.message || "An error occurred while updating the question.");
        }

    }

    const removeQuestion = async (questionId: number): Promise<void> => {
        const supabase = createClient();
        try {
            const { error } = await supabase
                .from("questions")
                .delete()
                .eq("id", questionId);
            
            if (error) {
                throw new Error(`Error removing question`);
            }

            await refreshQuestions();
            alert("Question successfully removed");
        } catch (error: any) {
            alert(error.message || "An error occured while deleting a question.");
        }
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
        event.preventDefault();
        if (answers.length < 2) return;

        const removedAnswer = answers[index];
        if ('id' in removedAnswer) {
            setDeletedAnswerIds((prevRemoved) => [...prevRemoved, removedAnswer.id]);
        }

        setAnswers((prev) => prev.filter((_, i) => i !== index));
    }

    const addAnswer = (): void => {
        if (answers.length < 4) {
            setAnswers([...answers, { answer_text: '', is_correct: false }])
        }
    }

    const refreshQuestions = async (): Promise<void> => {
        const supabase = createClient();
        const { data: updatedQuestions, error} = await supabase
            .from("questions")
            .select(`
                id,
                question_text,
                topic_id,
                allow_multiple,
                answers(*)   
            `)
            .eq("topic_id", topicId);

        if (error) {
            alert(`Error fetching questions: ${error.message}`);
            return;
        }

        if (updatedQuestions) {
            setQuestions(updatedQuestions);
            setCurrentQuestionIndex(updatedQuestions.length - 1);
            setIsCreatingQuestion(false);
        }
    }

    return isCreatingQuestion
    ? <CreateQuestion topicId={topicId} onQuestionCreated={refreshQuestions}/>
    : (
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
                    Remove question
                </button>

                <button onClick={() => setIsCreatingQuestion(true)}>
                    Add question
                </button>
            </div>

            <Link href={`/topics/${topicId}`}>
                Leave Quiz
            </Link>
        </div>

    );
}