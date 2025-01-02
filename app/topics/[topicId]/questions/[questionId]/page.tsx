import { createClient } from '@/lib/server';

export default async function QuestionDetailsPage({ params }: { params: Promise<{ questionId: string }> }) {
  const questionId = (await params).questionId;
  const supabase = await createClient();
  
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (questionError) {
    console.error('Error fetching topic:', questionError.message);
    return <div>Error loading question.</div>;
  }

  const { data: answers, error: answersError } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId);

    if (answersError) {
      console.error('Error fetching questions:', answersError.message);
      return <div>Error loading answers.</div>;
    }

  return (
    <div>
      <h1>{question.question_text}</h1>

      <h2>Answers</h2>
      <ul>
        {answers?.map((answer) => (
          <li key={answer.id}>
            {answer.answer_text} {answer.is_correct ? '(Correct)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
