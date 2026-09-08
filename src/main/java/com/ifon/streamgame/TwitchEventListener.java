package com.ifon.streamgame;

import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.chat.events.channel.ChannelMessageEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Component
public class TwitchEventListener {

    // 聊天訊息資料結構（同時包含暱稱與帳號 ID）
    public static class ChatMessage {
        private String time;
        private String channel;
        private String userName;    // 帳號 ID（例如：streamer123）
        private String displayName; // 顯示暱稱（例如：實況主）
        private String message;

        public ChatMessage(String time, String channel, String userName, String displayName, String message) {
            this.time = time;
            this.channel = channel;
            this.userName = userName;
            this.displayName = displayName;
            this.message = message;
        }

        public String getTime() { return time; }
        public String getChannel() { return channel; }
        public String getUserName() { return userName; }
        public String getDisplayName() { return displayName; }
        public String getMessage() { return message; }
    }

    private static final List<ChatMessage> chatLogs = new CopyOnWriteArrayList<>();
    private static final int MAX_LOGS = 100;

    private final TwitchClient twitchClient;

    @Autowired
    public TwitchEventListener(TwitchClient twitchClient) {
        this.twitchClient = twitchClient;
    }
    @Autowired
    private CommandHandler commandHandler;

    public void handleMessage(ChannelMessageEvent event) {
        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        String channel = event.getChannel().getName();
        String userName = event.getUser().getName(); // 帳號 ID

        // 從 IRC 標籤取得顯示名稱；標籤不存在時使用帳號 ID。
        String displayName = event.getMessageEvent()
                .getTagValue("display-name")
                .orElse(userName); // 若沒有自訂暱稱，預設使用帳號 ID

        String message = event.getMessage();

        // Console 印出監控：暱稱 (帳號): 訊息
        System.out.printf("[%s] 【%s】%s (%s): %s%n", time, channel, displayName, userName, message);

        // 指令回應邏輯
        commandHandler.processCommand(event);

        // 存入結構化日誌
        chatLogs.add(new ChatMessage(time, channel, userName, displayName, message));
        if (chatLogs.size() > MAX_LOGS) {
            chatLogs.remove(0);
        }
    }

    // 舊版 API 相容方法
    public static List<String> getLatestLogs() {
        return chatLogs.stream()
                .map(log -> String.format("[%s] %s(%s): %s", log.getChannel(), log.getDisplayName(), log.getUserName(), log.getMessage()))
                .collect(Collectors.toList());
    }

    // 提供給監控頁面過濾
    public static List<ChatMessage> getLogsByChannel(String channelName) {
        if (channelName == null || channelName.trim().isEmpty()) {
            return new ArrayList<>(chatLogs);
        }
        return chatLogs.stream()
                .filter(log -> log.getChannel().equalsIgnoreCase(channelName))
                .collect(Collectors.toList());
    }
    /**
     * 手動新增機器人自己發送的訊息至日誌中（供監控面板呈現）
     */
    public static void addSelfMessage(String channel, String message) {
        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

        // 設定帳號 ID 為 "bot"，顯示暱稱為 "🤖 機器人"
        chatLogs.add(new ChatMessage(time, channel, "bowchanwau", "豹欠擬哪喂", message));

        if (chatLogs.size() > MAX_LOGS) {
            chatLogs.remove(0);
        }
    }
}
