package com.ifon.streamgame.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.ifon.streamgame.model.GameUser;
import com.ifon.streamgame.util.JsonUtil;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class GameUserRepository {

    private static final String FILE_PATH = "data/users.json";


    /**
     * 取得所有 User
     */
    public List<GameUser> findAll() {

        List<GameUser> users = JsonUtil.read(
                FILE_PATH,
                new TypeReference<List<GameUser>>() {}
        );

        // 如果 JSON 檔案不存在
        if (users == null) {
            return new ArrayList<>();
        }

        return users;
    }


    /**
     * 根據 ID 尋找 User
     */
    public GameUser findById(String id) {

        List<GameUser> users = findAll();

        for (GameUser user : users) {

            if (user.getId().equals(id)) {
                return user;
            }
        }

        return null;
    }


    /**
     * 新增 User
     */
    public void add(GameUser user) {

        List<GameUser> users = findAll();

        users.add(user);

        save(users);
    }


    /**
     * 修改 User
     */
    public void update(GameUser updatedUser) {

        List<GameUser> users = findAll();

        for (int i = 0; i < users.size(); i++) {

            GameUser user = users.get(i);

            if (user.getId().equals(updatedUser.getId())) {

                users.set(i, updatedUser);

                save(users);

                return;
            }
        }
    }


    /**
     * 刪除 User
     */
    public void delete(String id) {

        List<GameUser> users = findAll();

        users.removeIf(
                user -> user.getId().equals(id)
        );

        save(users);
    }


    /**
     * 儲存所有 User
     */
    private void save(List<GameUser> users) {

        JsonUtil.write(
                FILE_PATH,
                users
        );
    }


    /**
     * 增加累計答對題數
     */
    public void addCorrectCount(String userId) {

        List<GameUser> users = findAll();

        for (GameUser user : users) {

            if (user.getId().equals(userId)) {

                user.setCorrectCount(
                        user.getCorrectCount() + 1
                );

                save(users);

                return;
            }
        }
    }


    /**
     * 判斷今天是否可以答題
     */
    public boolean canQuizToday(String userId) {

        GameUser user = findById(userId);

        if (user == null) {
            return false;
        }

        LocalDate today = LocalDate.now();

        // 從來沒有答過
        if (user.getLastQuizDate() == null) {
            return true;
        }

        // 最後答題日期不是今天
        return !user.getLastQuizDate().equals(today);
    }


    /**
     * 更新最後答題日期
     */
    public void updateQuizDate(String userId) {

        List<GameUser> users = findAll();

        for (GameUser user : users) {

            if (user.getId().equals(userId)) {

                user.setLastQuizDate(
                        LocalDate.now()
                );

                save(users);

                return;
            }
        }
    }


    /**
     * 尋找使用者
     * 如果不存在就自動建立
     */
    public GameUser findOrCreate(
            String userId,
            String userName
    ) {

        GameUser user = findById(userId);

        if (user != null) {
            return user;
        }

        GameUser newUser = new GameUser(
                userId,
                userName,
                1,
                0
        );

        add(newUser);

        return newUser;
    }
}