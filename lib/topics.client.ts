import { createClient } from "./supabase/client" ;

export async function createTopic(title: string, description: string, videoUrl: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('topics')
        .insert([{ title, description, video_url: videoUrl }]);

    if (error) throw new Error(error.message);

    return data;
}