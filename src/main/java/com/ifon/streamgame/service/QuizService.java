package com.ifon.streamgame.service;

import com.ifon.streamgame.model.GameUser;
import com.ifon.streamgame.model.Question;
import com.ifon.streamgame.model.QuizResult;
import com.ifon.streamgame.repository.GameUserRepository;
import com.ifon.streamgame.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class QuizService {

    private final GameUserRepository gameUserRepository;
    private final QuestionRepository questionRepository;

    public QuizService(
            GameUserRepository gameUserRepository,
            QuestionRepository questionRepository
    ) {
        this.gameUserRepository = gameUserRepository;
        this.questionRepository = questionRepository;
    }


    /**
     * 開始每日答題
     */
    public Question startQuiz(
            String userId,
            String userName
    ) {

        GameUser user =
                gameUserRepository.findOrCreate(
                        userId,
                        userName
                );

        LocalDate today =
                LocalDate.now();


        // 今天已經完成答題
        if (user.getLastQuizDate() != null
                && user.getLastQuizDate().equals(today)) {

            return null;
        }


        // 今天已經抽過題目，但還沒有回答
        if (user.getQuizStartDate() != null
                && user.getQuizStartDate().equals(today)
                && user.getCurrentQuestionId() != null) {

            return questionRepository.findById(
                    user.getCurrentQuestionId()
            );
        }


        // 隨機抽題
        Question question =
                questionRepository.getRandomQuestion();

        if (question == null) {
            return null;
        }


        // 記錄目前題目 ID
        user.setCurrentQuestionId(
                question.getId()
        );

        // 記錄抽題日期
        user.setQuizStartDate(today);

        // 更新 users.json
        gameUserRepository.update(user);

        return question;
    }


    /**
     * 回答每日題目
     */
    public QuizResult answerQuiz(
            String userId,
            String userAnswer
    ) {

        GameUser user =
                gameUserRepository.findById(userId);

        // 使用者不存在
        if (user == null) {

            return new QuizResult(
                    false,
                    false,
                    0,
                    "找不到使用者"
            );
        }


        LocalDate today =
                LocalDate.now();


        // 今天已經回答過
        if (user.getLastQuizDate() != null
                && user.getLastQuizDate().equals(today)) {

            return new QuizResult(
                    false,
                    false,
                    user.getCorrectCount(),
                    "今天已經回答過了"
            );
        }


        // 沒有正在進行中的題目
        if (user.getCurrentQuestionId() == null
                || user.getQuizStartDate() == null
                || !user.getQuizStartDate().equals(today)) {

            return new QuizResult(
                    false,
                    false,
                    user.getCorrectCount(),
                    "目前沒有進行中的題目"
            );
        }


        // 取得正在回答的題目
        Question question =
                questionRepository.findById(
                        user.getCurrentQuestionId()
                );


        // 題目不存在
        if (question == null) {

            return new QuizResult(
                    false,
                    false,
                    user.getCorrectCount(),
                    "找不到題目"
            );
        }


        // 判斷答案
        boolean correct =
                questionRepository.checkAnswer(
                        question,
                        userAnswer
                );


        // 答對才增加累計答對題數
        if (correct) {

            user.setCorrectCount(
                    user.getCorrectCount() + 1
            );
        }


        // 不論答對答錯
        // 今天都算已經完成每日答題
        user.setLastQuizDate(today);


        // 清除正在進行中的題目
        user.setCurrentQuestionId(null);
        user.setQuizStartDate(null);


        // 更新 users.json
        gameUserRepository.update(user);


        if (correct) {

            return new QuizResult(
                    true,
                    true,
                    user.getCorrectCount(),
                    "回答正確"
            );

        } else {

            return new QuizResult(
                    true,
                    false,
                    user.getCorrectCount(),
                    "回答錯誤"
            );
        }
    }
}