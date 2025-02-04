import { getQuestionsByTopic } from "@/lib/questions.server";
import { notFound } from "next/navigation";
import TeacherViewQuiz from "./TeacherViewQuiz";
import { getCurrentUser } from "@/lib/mockUsers";
import StudentViewQuiz from "./StudentViewQuiz";


export default async function QuizPage({ params }: { params: Promise<{ topicId: string }> }) {
    const topicId = (await params).topicId;
    const questions = await getQuestionsByTopic(topicId);
    const currentUser = getCurrentUser();

    if (!questions || questions.length === 0) {
        // error page goes here
        return notFound();
    }

    if (currentUser.role === 'teacher') {
        return <TeacherViewQuiz questions={questions} topicId={topicId} />
    } else {
        return <StudentViewQuiz questions={questions} topicId={topicId}/>
    }
};