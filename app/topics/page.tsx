import { createClient } from '@/lib/server';
import Link from 'next/link';

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
            <div>
                {topics?.map((topic) => (
                    <Link key={topic.id} href={`./topics/${topic.id}`} passHref>
                        <div className='card'>
                            <h2>{topic.title}</h2>
                            <p>{topic.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
