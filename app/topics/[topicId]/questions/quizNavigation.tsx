type QuizNavigationProps = {
    currentQuestionIndex: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
}

export function QuizNavigation({currentQuestionIndex, totalQuestions, onPrevious, onNext}:QuizNavigationProps) {
    return (
        <div>
            <button onClick={onPrevious} disabled={currentQuestionIndex === 0}>
                previous
            </button>
            <button onClick={onNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                Next
            </button>
        </div>
    )
}