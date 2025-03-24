import { profile } from "console";
import { createClient } from "./supabase/server";

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        return { user: user, profile: profile};
    }

    return { user: null, profile: null };
}