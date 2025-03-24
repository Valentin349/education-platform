import Link from 'next/link';
import CreateTopic from './components/CreateTopic';
import { getAllTopics } from '@/lib/topics.server';
import Logout from '../(auth)/components/Logout';
import { getUserProfile } from '@/lib/user';

export default async function TopicsPage() {
    try {
        const { user, profile } = await getUserProfile();
        const topics = await getAllTopics();


        return (
            <div>
                <h1>Topics</h1>
                <h2>Hello {profile?.role ?? 'student'}</h2>
                {user && (
                    <Logout />
                )}
                
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
                {profile?.role === 'teacher' && (
                    <CreateTopic />
                )}
            </div>
        );
    } catch (error: any) {
        console.error('Error fetching topics:', error.message);
        return <div>Error loading topics.</div>;
    }
}
