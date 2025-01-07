import { createClient } from '@/lib/server';
import VideoPlayer from '@/components/videoPlayer';
import Link from 'next/link';

const chapters = [
	{ time: 0, label: "Introduction" },
	{ time: 30, label: "Overview" },
	{ time: 120, label: "Deep Dive" },
	{ time: 240, label: "Conclusion" },
];

export default async function TopicDetailsPage({ params }: { params: Promise<{ topicId: string }> }) {
	const topicId = (await params).topicId;
	const supabase = await createClient();

	const { data: topic, error: topicError } = await supabase
		.from('topics')
		.select('*')
		.eq('id', topicId)
		.single();

	if (topicError) {
		console.error('Error fetching topic:', topicError.message);
		return <div>Topic not found or error occurred.</div>;
	}

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
}
