package com.ifon.streamgame.service;

import com.github.philippheuer.events4j.simple.SimpleEventHandler;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.events.ChannelGoLiveEvent;
import com.ifon.streamgame.TwitchBotService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class TwitchAutoChatService {

    private final TwitchClient twitchClient;
    private final TwitchBotService twitchBotService;

    // 定義各頻道的開台問候語
    private static final Map<String, String> GO_LIVE_MESSAGES = Map.of(
            "600189", "阿嗚！在這個特別的日子裡，讓狐帶給你法拉利的聲音！一起來！嘿！！！",
            "maoya00715", "早安卯！你的專屬(?)機器人以上線！  maoya0Mao maoya0Mao maoya0Mao (!cmd 查看所有指令)"
    );

    public TwitchAutoChatService(TwitchClient twitchClient, TwitchBotService twitchBotService) {
        this.twitchClient = twitchClient;
        this.twitchBotService = twitchBotService;
    }

    @PostConstruct
    public void init() {
        // 1. 確保監控清單中的頻道都已加入聊天室並開啟開台監控
        GO_LIVE_MESSAGES.keySet().forEach(channel -> {
            twitchClient.getClientHelper().enableStreamEventListener(channel); // 啟動開台輪詢
            log.info("🤖 已對頻道 [{}] 開啟開台狀態監控", channel);
        });

        // 2. 註冊開台事件監聽器
        SimpleEventHandler eventHandler = twitchClient.getEventManager().getEventHandler(SimpleEventHandler.class);
        eventHandler.onEvent(ChannelGoLiveEvent.class, this::handleChannelGoLive);

        log.info("✅ [TwitchAutoChatService] 開台監控模組啟動完成");
    }

    private void handleChannelGoLive(ChannelGoLiveEvent event) {
        String channel = event.getChannel().getName().toLowerCase();
        String title = event.getStream().getTitle();
        String game = event.getStream().getGameName();

        log.info("🔴 偵測到 [{}] 開台！標題：{} | 遊戲：{}", channel, title, game);

        // 取得台詞，若在清單內就調用 TwitchBotService 發送訊息
        String message = GO_LIVE_MESSAGES.get(channel);
        if (message != null) {
            twitchBotService.sendMessage(channel, message);
        }
    }
}