export type Question = {
    id: number;
    topic_id: number;
    question_text: string;
    allow_multiple: boolean;
    answers: Answer[];
};

export type Answer = {
    id?: number;
    question_id?: number;
    answer_text: string;
    is_correct: boolean;
}
