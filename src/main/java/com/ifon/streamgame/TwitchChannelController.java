package com.ifon.streamgame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/twitch/manage")
public class TwitchChannelController {

    @Autowired
    private TwitchBotService botService;

    // 1. 取得所有頻道列表
    @GetMapping("/channels")
    public List<TwitchChannelJoin> getAllChannels() {
        return botService.getAllChannels();
    }

    // 2. 新增頻道資料
    @PostMapping("/channels")
    public TwitchChannelJoin addChannel(@RequestBody TwitchChannelJoin channel) {
        return botService.addChannel(channel);
    }

    // 3. 修改頻道資料
    @PutMapping("/channels/{id}")
    public TwitchChannelJoin updateChannel(@PathVariable Long id, @RequestBody TwitchChannelJoin channel) {
        return botService.updateChannel(id, channel);
    }

    // 4. 刪除頻道資料
    @DeleteMapping("/channels/{id}")
    public String deleteChannel(@PathVariable Long id) {
        botService.deleteChannel(id);
        return "成功刪除頻道 ID: " + id;
    }

    // 5. 控制機器人加入該頻道 (並更新 DB 狀態為 JOIN)
    @PostMapping("/channels/{id}/join")
    public TwitchChannelJoin joinChannel(@PathVariable Long id) {
        return botService.joinChannel(id);
    }

    // 6. 控制機器人離開該頻道 (並更新 DB 狀態為 LEAVE)
    @PostMapping("/channels/{id}/leave")
    public TwitchChannelJoin leaveChannel(@PathVariable Long id) {
        return botService.leaveChannel(id);
    }

    // 7. 從資料表選擇頻道發送訊息
    @PostMapping("/channels/send")
    public String sendMessageToChannel(@RequestParam String channelName, @RequestParam String message) {
        try {
            botService.sendChatMessage(channelName, message);
            return "成功對頻道 [" + channelName + "] 發送訊息: " + message;
        } catch (Exception e) {
            return "發送失敗: " + e.getMessage();
        }
    }
}