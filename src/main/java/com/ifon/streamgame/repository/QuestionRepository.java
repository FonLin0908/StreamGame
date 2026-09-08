package com.ifon.streamgame.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.ifon.streamgame.model.Question;
import com.ifon.streamgame.util.JsonUtil;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Repository
public class QuestionRepository {

    private static final String FILE_PATH =
            "data/questions.json";


    /**
     * 取得所有題目
     */
    public List<Question> findAll() {

        List<Question> questions =
                JsonUtil.read(
                        FILE_PATH,
                        new TypeReference<List<Question>>() {}
                );

        if (questions == null) {
            return new ArrayList<>();
        }

        return questions;
    }


    /**
     * 根據 ID 尋找題目
     */
    public Question findById(int id) {

        List<Question> questions = findAll();

        for (Question question : questions) {

            if (question.getId() == id) {
                return question;
            }
        }

        return null;
    }


    /**
     * 隨機取得一題
     */
    public Question getRandomQuestion() {

        List<Question> questions = findAll();

        if (questions.isEmpty()) {
            return null;
        }

        Random random = new Random();

        int index =
                random.nextInt(
                        questions.size()
                );

        return questions.get(index);
    }


    /**
     * 檢查答案
     */
    public boolean checkAnswer(
            Question question,
            String userAnswer
    ) {

        if (question == null ||
                userAnswer == null ||
                question.getAnswers() == null) {

            return false;
        }

        String input = userAnswer.trim();

        for (String answer : question.getAnswers()) {

            if (answer.equalsIgnoreCase(input)) {
                return true;
            }
        }

        return false;
    }
}