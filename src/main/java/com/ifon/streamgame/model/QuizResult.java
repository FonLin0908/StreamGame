package com.ifon.streamgame.model;

public class QuizResult {

    private boolean success;
    private boolean correct;
    private int correctCount;
    private String message;

    public QuizResult(
            boolean success,
            boolean correct,
            int correctCount,
            String message
    ) {
        this.success = success;
        this.correct = correct;
        this.correctCount = correctCount;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public boolean isCorrect() {
        return correct;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public String getMessage() {
        return message;
    }
}