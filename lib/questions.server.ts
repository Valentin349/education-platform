import { createClient } from "./supabase/server";

export async function getQuestionsByTopic(topicId: String) {
    const supabase = await createClient();

    const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select(`
            id,
            topic_id,
            question_text,
            allow_multiple,
            answers (
                id,
                answer_text,
                is_correct
            )
        `)
        .eq('topic_id', topicId);

    if (questionError) throw new Error(questionError.message);

    return questions;
}