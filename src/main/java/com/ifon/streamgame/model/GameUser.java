package com.ifon.streamgame.model;

import java.time.LocalDate;

public class GameUser {

    private String id;
    private String name;
    private int level;

    // 累計答對題數
    private int correctCount;

    // 最後完成每日答題的日期
    private LocalDate lastQuizDate;

    // 目前正在回答的題目 ID
    private Integer currentQuestionId;

    // 目前題目開始的日期
    private LocalDate quizStartDate;


    public GameUser() {
    }


    public GameUser(
            String id,
            String name,
            int level,
            int correctCount
    ) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.correctCount = correctCount;

        this.lastQuizDate = null;
        this.currentQuestionId = null;
        this.quizStartDate = null;
    }


    public String getId() {
        return id;
    }


    public void setId(String id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public int getLevel() {
        return level;
    }


    public void setLevel(int level) {
        this.level = level;
    }


    public int getCorrectCount() {
        return correctCount;
    }


    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }


    public LocalDate getLastQuizDate() {
        return lastQuizDate;
    }


    public void setLastQuizDate(LocalDate lastQuizDate) {
        this.lastQuizDate = lastQuizDate;
    }


    public Integer getCurrentQuestionId() {
        return currentQuestionId;
    }


    public void setCurrentQuestionId(Integer currentQuestionId) {
        this.currentQuestionId = currentQuestionId;
    }


    public LocalDate getQuizStartDate() {
        return quizStartDate;
    }


    public void setQuizStartDate(LocalDate quizStartDate) {
        this.quizStartDate = quizStartDate;
    }


    @Override
    public String toString() {
        return "GameUser{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", level=" + level +
                ", correctCount=" + correctCount +
                ", lastQuizDate=" + lastQuizDate +
                ", currentQuestionId=" + currentQuestionId +
                ", quizStartDate=" + quizStartDate +
                '}';
    }
}