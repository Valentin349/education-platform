import VideoPlayer from '@/components/videoPlayer';
import Link from 'next/link';
import { getTopicById } from '@/lib/topics.server';

const chapters = [
	{ time: 0, label: "Introduction" },
	{ time: 30, label: "Overview" },
	{ time: 120, label: "Deep Dive" },
	{ time: 240, label: "Conclusion" },
];

export default async function TopicDetailsPage({ params }: { params: Promise<{ topicId: string }> }) {
	try {
		const topicId = (await params).topicId;
		const topic = await getTopicById(topicId);

		return (
			<div>
				<h1>{topic.title}</h1>
				<p>{topic.description}</p>
				<VideoPlayer videoUrl={topic.video_url} chapters={chapters} />
				<div>
					<Link href={'/topics'}>Topics</Link>
					<Link href={`/topics/${topicId}/questions`}>Questions</Link>
				</div>
			</div>
		);
	} catch (error: any) {
		console.error('Error fetching topic:', error.message);
		return <div>Topic not found or error occurred.</div>;
	}
}
