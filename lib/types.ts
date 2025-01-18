export type Question = {
    id: number;
    topic_id: number;
    question_text: string;
    allow_multiple: boolean;
    answers: StoredAnswer[];
};

export type BaseAnswer = {
    answer_text: string;
    is_correct: boolean;
}

export type StoredAnswer = BaseAnswer & {
    id: number;
    question_id: number;
}
