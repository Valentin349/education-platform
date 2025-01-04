import { getQuestionsByTopic } from "@/lib/quiz";

export default async function QuizPage({ params }: { params: Promise<{ topicId: string }> }) {
    const topicId = (await params).topicId;
    const questions = await getQuestionsByTopic(topicId);

    return (
        <div>
            <h1>Quiz for Topic: {topicId}</h1>
            {questions.length > 0 ? (
                questions.map((question) => (
                    <div key={question.id}>
                        <h2>{question.question_text}</h2>
                        <ul>
                            {question.answers.map((answer, index) => (
                                <li key={index}>{answer.answer_text}</li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No questions available.</p>
            )}
        </div>
    );
};