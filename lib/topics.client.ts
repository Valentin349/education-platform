import { createClient } from "./supabase/client";

const supabase = createClient();

export async function createTopic(title: string, description: string, videoUrl: string): Promise<void> {
    const { error: topicsError } = await supabase
        .from('topics')
        .insert([{ title, description, video_url: videoUrl }]);

    if (topicsError) throw new Error(`Error inserting answers: ${topicsError.message}`);
}

export async function getNotesFromTopic(topicId: string) {
    const { data, error } = await supabase
        .from('topics')
        .select('notes')
        .eq('id', topicId)
        .single();

    if (error) throw new Error(`Error retriving Topic Notes: ${error.message}`);

    return data;
}

export async function updateTopicNotes(topicId: string, notes: object) {
    const { error } = await supabase
        .from('topics')
        .update({ notes })
        .eq('id', topicId);

    if (error) throw new Error(`Error updating Topic Notes: ${error.message}`);
}