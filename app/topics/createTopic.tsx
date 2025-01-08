'use client'

import RoleBasedView from "@/components/RoleBasedView";
import { createTopic } from "@/lib/topics";
import { useState } from "react";

export default function CreateTopic() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSumbit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        setIsSubmitting(true);
        try {
            await createTopic(formData.title, formData.description, formData.video);
            setSuccess('Successfully created topic');
            setFormData({ title: '', description: '', video: '' });
        } catch (err: any) {
            setError(err.message || 'An error occurred while creating the topic.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const validateForm = () => {
        const { title, description, video } = formData;
    
        if (!title.trim()) return 'Title is required.';
        if (!description.trim()) return 'Description is required.';
        if (!video.trim()) return 'Video URL is required.';
    
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(video)) return 'Please enter a valid Video URL.';
    
        return null;
      };

    return (
        <RoleBasedView allowedRoles={['teacher']}>
            <div>
                <form>
                    <input type="text" name="title" placeholder="Topic Title" value={formData.title} />
                    <input type="text" name="description" placeholder="Description" value={formData.description} />
                    <input type="text" name="video" placeholder="Video URL" value={formData.video} />
                    <button type="submit">Create</button>
                </form>
            </div>
        </RoleBasedView>
    );
}