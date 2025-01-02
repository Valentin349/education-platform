import { createClient } from '@/lib/server';
import VideoPlayer from '@/components/videoPlayer';

const chapters = [
  { time: 0, title: 'Introduction' },
  { time: 60, title: 'Basics of Topic' },
  { time: 180, title: 'Advanced Techniques' },
  { time: 300, title: 'Summary' },
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

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId);

  if (questionsError) {
    console.error('Error fetching questions:', questionsError.message);
    return <div>Error loading questions.</div>;
  }

  if (!topic) {
    return <div>No topic found for this ID.</div>;
  }

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>

      <h2>Questions</h2>
      <ul>
        {questions?.map((question) => (
          <li key={question.id}>{question.question_text}</li>
        ))}
      </ul>
      <VideoPlayer videoUrl={topic.video_url} chapters={chapters}/>
    </div>
  );
}
