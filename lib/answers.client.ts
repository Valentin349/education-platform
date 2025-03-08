import { createClient } from "./supabase/client";
import { Answer } from "./types";

const supabase = createClient();

export async function deleteAnswers(deletedAnswerIds: number[]): Promise<void> {
    const { error: deleteError } = await supabase
        .from("answers")
        .delete()
        .in("id", deletedAnswerIds);

    if (deleteError) {
        throw new Error(`Error updating question: ${deleteError.message}`);
    }
}

export async function upsertAnswers(answers: Answer[]): Promise<void> {
    const { error: upsertAnswerError } = await supabase
        .from("answers")
        .upsert(answers, { onConflict: "id" });

    if (upsertAnswerError) {
        throw new Error(`Error upserting answers: ${upsertAnswerError.message}`);
    }
}

export async function insertNewAnswers(answers: Answer[]): Promise<void> {
    const { error: insertAnswerError } = await supabase
        .from('answers')
        .insert(answers);

    if (insertAnswerError) {
        throw new Error(`Error inserting answers: ${insertAnswerError.message}`);
    }
}



