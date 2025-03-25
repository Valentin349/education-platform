import Link from 'next/link';
import { getAllTopics } from '@/lib/topics.server';
import { Card, CardContent } from '@/components/ui/card';

export default async function TopicsPage() {
    try {
        const topics = await getAllTopics();

        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Topics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((course) => (
                        <Link key={course.id} href={`./topics/${course.id}`} passHref>
                            <Card className="p-4">
                                <CardContent>
                                    <h2 className="text-lg font-semibold">{course.title}</h2>
                                    <p className="text-sm text-gray-600">{course.description}</p>
                                </CardContent>
                            </Card>
                        </Link>

                    ))}
                </div>
            </div>
        );
    } catch (error: any) {
        console.error('Error fetching topics:', error.message);
        return <div>Error loading topics.</div>;
    }
}
