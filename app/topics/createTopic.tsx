'use client'

import RoleBasedView from "@/components/RoleBasedView";
import { createTopic } from "@/lib/topics.client";
import { useState } from "react";

export default function CreateTopic() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video: '',
    });
    const [isLoading, setLoading] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSumbit = async () => {
        if (!formData.title || !formData.description || !formData.video) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);

            await createTopic(formData.title, formData.description, formData.video);
            alert('Successfully created topic');
            setFormData({ title: '', description: '', video: '' });
        } catch (err: any) {
            alert(err.message || 'An error occurred while creating the topic.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <RoleBasedView allowedRoles={['teacher']}>
            <div>
                <form>
                    <input type="text" name="title" placeholder="Topic Title" value={formData.title} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                    <input type="text" name="video" placeholder="Video URL" value={formData.video} onChange={handleChange} />
                    <button onClick={handleSumbit}>
                        {isLoading ? 'Loading...' : 'Create'}
                    </button>
                </form>
            </div>
        </RoleBasedView>
    );
}