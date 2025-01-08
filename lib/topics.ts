import { createClient } from "./server";

export async function createTopic(title: string, description: string, videoUrl: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('topics')
        .insert([{ title, description, video_url: videoUrl }]);

    if (error) throw new Error(error.message);

    return data;
}

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