'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { z } from 'zod';


const emailSchema = z.string().trim().email({ message: "Invalid email format" });

const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
    .regex(/^\S*$/, { message: "Password must not contain spaces" });

const usernameSchema = z.string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must only contain letters and numbers" });

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

const signupSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export async function login(formData: FormData) {
    const supabase = await createClient()

    const credentials = {
        email: formData.get('email')?.toString().trim(),
        password: formData.get('password')?.toString().trim(),
    }

    const parsedCredentials = loginSchema.safeParse(credentials);
    if (!parsedCredentials.success) {
        return { status: 'Password does not match', user: null };
    }

    const { error, data } = await supabase.auth.signInWithPassword(parsedCredentials.data)

    if (error) {
        return {
            status: error?.message,
            user: null
        };
    }

    const { data: existingUser } = await supabase.from('user_profiles')
        .select('*')
        .eq('email', credentials.email)
        .limit(1)
        .single();

    // TODO: sets all new accounts as teacher, need other users too.
    if (!existingUser) {
        const { error: insertError } = await supabase.from('user_profiles').insert({
            email: data?.user.email,
            username: data?.user?.user_metadata.username,
            role: 'teacher',
        });

        if (insertError) {
            return {
                status: insertError?.message,
                user: null,
            };
        }
    }
    revalidatePath('/', 'layout')
    return {
        status: 'success',
        user: data.user,
    };
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const credentials = {
        username: formData.get('username')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        password: formData.get('password')?.toString(),
    }

    const parsedCredentials = signupSchema.safeParse(credentials);
    if (!parsedCredentials.success) {
        return { status: parsedCredentials.error.issues[0].message, user: null };
    }

    const { error, data } = await supabase.auth.signUp({
        email: parsedCredentials.data.email,
        password: parsedCredentials.data.password,
        options: {
            data: {
                username: parsedCredentials.data.username,
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
        status: 'success',
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

export async function getUserSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return null;
    }

    return { status: 'success', user: data?.user };
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    const email = formData.get('email')?.toString().trim();

    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
        return { status: parsedEmail.error.issues[0].message };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
        redirectTo: `${origin}/reset-password`
    });

    if (error) {
        return { status: error?.message, user: null };
    }

    return { status: 'success' }
}

export async function resetPassword(formData: FormData, code: string) {
    const supabase = await createClient();

    const password = formData.get('password')?.toString();
    const parsedPassword = passwordSchema.safeParse(password);
    if (!parsedPassword.success) {
        return { status: parsedPassword.error.issues[0].message };
    }

    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);

    if (codeError) {
        return { status: codeError?.message };
    }

    const { error } = await supabase.auth.updateUser({
        password: parsedPassword.data,
    });

    if (error) {
        return { status: error?.message };
    }

    return { status: 'success' };
}