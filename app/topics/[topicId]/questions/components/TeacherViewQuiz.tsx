"use client"
import { Answer, Question } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreateQuestion } from "./CreateQuestion";
import { QuizNavigation } from "./QuizNavigation";
import { QuestionEditor } from "./QuestionEditor";

type ClientQuestionProps = {
    questions: Question[];
    topicId: string;
};

export default function TeacherViewQuiz({ questions: initialQuestions, topicId }: ClientQuestionProps) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isCreatingQuestion, setIsCreatingQuestion] = useState<boolean>(false)

    const handleUpdateQuestion = async (originalQuestion: Question, updatedText: string, updatedAnswers: Answer[], deletedAnswerIds: number[]): Promise<void> => {
        const supabase = createClient();
        try {
            if (updatedText !== originalQuestion.question_text) {
                const { error: questionError } = await supabase
                    .from("questions")
                    .update({ question_text: updatedText, allow_multiple: updatedAnswers.filter((answer) => answer.is_correct).length > 1 })
                    .eq("id", originalQuestion.id);

                if (questionError) {
                    throw new Error(`Error updating question: ${questionError.message}`);
                }
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
            const existingAnswers = updatedAnswers.filter((answer) => answer.id !== undefined);
            const newAnswers = updatedAnswers
                .filter((answer) => answer.id === undefined)
                .map((answer) => ({
                    ...answer,
                    question_id: originalQuestion.id
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
                const { error: insertAnswerError } = await supabase
                    .from('answers')
                    .insert(newAnswers);

                if (insertAnswerError) {
                    throw new Error(`Error inserting answers: ${insertAnswerError.message}`);
                }

            }

            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === originalQuestion.id
                        ? { ...q, question_text: updatedText, answers: updatedAnswers }
                        : q
                )
            );

            alert("Question and answers updated successfully!");
        } catch (error: any) {
            alert(error.message || "An error occurred while updating the question.");
        }

    }

    const handleRemoveQuestion = async (questionId: number): Promise<void> => {
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

    const refreshQuestions = async (): Promise<void> => {
        const supabase = createClient();
        const { data: updatedQuestions, error } = await supabase
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

    return isCreatingQuestion ? (
        <CreateQuestion topicId={topicId} onQuestionCreated={refreshQuestions} />
    ) : (
        <div>
            <QuestionEditor
                question={questions[currentQuestionIndex]}
                onUpdateQuestion={handleUpdateQuestion}
                onRemoveQuestion={handleRemoveQuestion}
            />

            <div>
                <button onClick={() => setIsCreatingQuestion(true)}>
                    Add question
                </button>
            </div>

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