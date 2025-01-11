import { createClient } from "./supabase/client" ;

export async function createTopic(title: string, description: string, videoUrl: string): Promise<void> {
    const supabase = createClient();

    const { error: topicsError } = await supabase
        .from('topics')
        .insert([{ title, description, video_url: videoUrl }]);

    if (topicsError) throw new Error(`Error inserting answers: ${topicsError.message}`);
}