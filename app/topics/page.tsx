import { getCurrentUser } from '@/lib/mockUsers';
import Link from 'next/link';
import CreateTopic from './CreateTopic';
import { getAllTopics } from '@/lib/topics.server';

export default async function TopicsPage() {
    try {
        const user = getCurrentUser();
        const topics = await getAllTopics();

        return (
            <div>
                <h1>Topics</h1>
                <h2>Hello {user.role}</h2>
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

                {/*Teacher only Features*/}
                {user.role === 'teacher' && (
                    <CreateTopic />
                )}
            </div>
        );
    } catch (error: any) {
        console.error('Error fetching topics:', error.message);
        return <div>Error loading topics.</div>;
    }
}
