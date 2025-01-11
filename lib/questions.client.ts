import { createClient } from "./supabase/client";
import { BaseAnswer } from "./types";

export async function createQuestion(question_text: string, allow_multiple: boolean, answers: BaseAnswer[]) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('questions')
        .insert([{ question_text, allow_multiple, answers }]);

    if (error) throw new Error(error.message);

    return data;
}