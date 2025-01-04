import { createClient } from "./server";

export async function getQuestionsByTopic(topicId: String) {
    const supabase = await createClient();

    const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select(`
            id,
            question_text,
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