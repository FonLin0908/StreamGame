package com.ifon.streamgame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    // 整合後的儲存 API
    @GetMapping("/save")
    public String saveUser(
            @RequestParam String name,
            @RequestParam(required = false, defaultValue = "N/A") String twitchID,
            @RequestParam(required = false, defaultValue = "N/A") String discordID,
            @RequestParam(required = false, defaultValue = "USER") String role
    ) {
        User user = new User();
        user.setName(name);
        user.setTwitchID(twitchID);
        user.setDiscordID(discordID);
        user.setRole(role);

        userRepository.save(user);
        return "使用者 " + name + " 已同步至 Supabase！";
    }

    // 獲取所有使用者
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 移除使用者
    @GetMapping("/delete")
    public String deleteUser(@RequestParam Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "ID #" + id + " 已從雲端移除";
        }
        return "找不到該 ID";
    }

    //編輯使用者資料
    @GetMapping("/update")
    public String updateUser(
            @RequestParam Long id,
            @RequestParam String name,
            @RequestParam String twitchID,
            @RequestParam String discordID,
            @RequestParam String role
    ) {
        return userRepository.findById(id).map(user -> {
            user.setName(name);
            user.setTwitchID(twitchID);
            user.setDiscordID(discordID);
            user.setRole(role);
            userRepository.save(user);
            return "使用者 #" + id + " 資料已更新！";
        }).orElse("找不到該使用者");
    }
}