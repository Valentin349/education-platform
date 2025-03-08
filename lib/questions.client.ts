import { createClient } from "./supabase/client";
import { Answer } from "./types";

const supabase = createClient();

export async function createQuestion(
    topic_id: string, question_text: string, allow_multiple: boolean, answers: Answer[]
): Promise<void> {
    const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert([{ topic_id, question_text, allow_multiple }])
        .select('id')
        .single();

    if (questionError) throw new Error(`Error inserting question: ${questionError.message}`);

    const answersWithQuestionId = answers.map((answer) => ({
        ...answer,
        question_id: question.id
    }))

    const { error: answersError } = await supabase
        .from('answers')
        .insert(answersWithQuestionId);

    if (answersError) throw new Error(`Error inserting answers: ${answersError.message}`);
}

export async function updateSingleQuestion(qeustionText: string, allowMultiple: boolean, questionId: number): Promise<void> {
    const { error: questionError } = await supabase
        .from("questions")
        .update({ question_text: qeustionText, allow_multiple: allowMultiple })
        .eq("id", questionId);

    if (questionError) {
        throw new Error(`Error updating question: ${questionError.message}`);
    }
}