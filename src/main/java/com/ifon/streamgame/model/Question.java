package com.ifon.streamgame.model;

import java.util.List;

public class Question {

    private int id;

    private QuestionType type;

    private String question;

    private List<String> options;

    private List<String> answers;


    public Question() {
    }


    public Question(
            int id,
            QuestionType type,
            String question,
            List<String> options,
            List<String> answers
    ) {

        this.id = id;
        this.type = type;
        this.question = question;
        this.options = options;
        this.answers = answers;
    }


    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }


    public QuestionType getType() {
        return type;
    }


    public void setType(QuestionType type) {
        this.type = type;
    }


    public String getQuestion() {
        return question;
    }


    public void setQuestion(String question) {
        this.question = question;
    }


    public List<String> getOptions() {
        return options;
    }


    public void setOptions(List<String> options) {
        this.options = options;
    }


    public List<String> getAnswers() {
        return answers;
    }


    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }


    @Override
    public String toString() {

        return "Question{" +
                "id=" + id +
                ", type=" + type +
                ", question='" + question + '\'' +
                ", options=" + options +
                ", answers=" + answers +
                '}';
    }
}