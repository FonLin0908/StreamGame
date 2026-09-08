package com.ifon.streamgame;

import com.github.twitch4j.TwitchClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/twitch")
public class TwitchApiController {

    @Autowired
    private TwitchEventListener twitchEventListener;

    @GetMapping("/logs")
    public List<String> getLogs() {
        return TwitchEventListener.getLatestLogs();
    }
    @Autowired
    private TwitchClient twitchClient;

    @Value("${twitch.channel.name}")
    private String channelName;

    @GetMapping("/send")
    public String sendMessage(@RequestParam String msg) {
        try {
            twitchClient.getChat().sendMessage(channelName, msg);
            return "成功發送：" + msg;
        } catch (Exception e) {
            return "發送失敗：" + e.getMessage();
        }
    }
}