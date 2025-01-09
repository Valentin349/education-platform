import { createClient } from "./supabase/server" ;

export async function getAllTopics() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('topics')
        .select('*');

    if (error) throw new Error(error.message);

    return data;
}

export async function getTopicById(topicId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
		.from('topics')
		.select('*')
		.eq('id', topicId)
		.single();

    if (error) throw new Error(error.message);

    return data;
} 