'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // TODO: validate your inputs
    const credentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error, data } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
        return {
            status: error?.message,
            user: null
        };
    }

    revalidatePath('/', 'layout')
    return {
        status: 'Success',
        user: data.user,
    };
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const credentials = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: {
                username: credentials.username,
            }
        }
    });

    if (error) {
        return {
            status: error?.message,
            user: null
        };
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists.",
            user: null,
        };
    }

    revalidatePath('/', 'layout')
    return {
        status: 'Success',
        user: data.user,
    };
}

export async function logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut();

    if (error) {
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}