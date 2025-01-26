import { createClient } from "./supabase/client";
import { BaseAnswer } from "./types";

export async function createQuestion(
    topic_id: string, question_text: string, allow_multiple: boolean, answers: BaseAnswer[]
): Promise<void> {
    const supabase = createClient();

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