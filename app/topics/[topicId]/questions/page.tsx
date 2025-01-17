import { getQuestionsByTopic } from "@/lib/questions.server";
import ClientQuestion from "./ClientQuestion";
import { notFound } from "next/navigation";


export default async function QuizPage({ params }: { params: Promise<{ topicId: string }> }) {
    const topicId = (await params).topicId;
    const questions = await getQuestionsByTopic(topicId);

    if (!questions || questions.length === 0) {
        // error page goes here
        return notFound();
    }

    return <ClientQuestion questions={questions} topicId={topicId}/>;
};