import { getQuestionsByTopic } from "@/lib/quiz";
import ClientQuestion from "./ClientQuestion";


export default async function QuizPage({ params }: { params: Promise<{ topicId: string }> }) {
    const topicId = (await params).topicId;
    const questions = await getQuestionsByTopic(topicId);

    return <ClientQuestion questions={questions}/>;
};