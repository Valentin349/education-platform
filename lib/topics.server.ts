import { createClient } from "./supabase/server";

const supabase = await createClient();

export async function getAllTopics() {
    const { data, error } = await supabase
        .from('topics')
        .select('*');

    if (error) throw new Error(error.message);

    return data;
}

export async function getTopicById(topicId: string) {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

    if (error) throw new Error(error.message);

    return data;
}