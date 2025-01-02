import { createClient } from '@/lib/server';

export default async function TopicsPage() {
    const supabase = await createClient();
    const { data: topics, error } = await supabase.from('topics').select('*');

    if (error) {
        console.error('Error fetching topics:', error);
        return <div>Error loading topics.</div>;
    }

    return (
        <div>
            <h1>Topics</h1>
            <ul>
                {topics?.map((topic) => (
                    <li key={topic.id}>
                        <h2>{topic.title}</h2>
                        <p>{topic.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
