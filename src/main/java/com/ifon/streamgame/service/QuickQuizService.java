package com.ifon.streamgame.service;

import com.ifon.streamgame.model.Question;
import com.ifon.streamgame.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuickQuizService {

    private final QuestionRepository questionRepository;

    // 目前搶答題目
    private Question currentQuestion;

    // 是否正在搶答
    private boolean active = false;


    public QuickQuizService(
            QuestionRepository questionRepository
    ) {
        this.questionRepository = questionRepository;
    }


    /**
     * 開始搶答
     */
    public Question start() {

        // 已經有搶答正在進行
        if (active) {
            return null;
        }

        Question question =
                questionRepository.getRandomQuestion();

        if (question == null) {
            return null;
        }

        currentQuestion = question;
        active = true;

        return question;
    }


    /**
     * 是否正在搶答
     */
    public boolean isActive() {
        return active;
    }


    /**
     * 檢查答案
     */
    public boolean answer(String answer) {

        if (!active || currentQuestion == null) {
            return false;
        }

        return questionRepository.checkAnswer(
                currentQuestion,
                answer
        );
    }


    /**
     * 結束搶答
     */
    public void finish() {

        active = false;
        currentQuestion = null;
    }


    /**
     * 取得目前題目
     */
    public Question getCurrentQuestion() {
        return currentQuestion;
    }
}