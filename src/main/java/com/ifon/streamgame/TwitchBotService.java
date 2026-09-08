package com.ifon.streamgame;

import com.github.philippheuer.events4j.simple.SimpleEventHandler;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.chat.events.channel.ChannelMessageEvent;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TwitchBotService {

    private final TwitchClient twitchClient;
    private final TwitchEventListener twitchEventListener;
    private final TCJRepository repository; // 操作 Supabase 資料庫

    public TwitchBotService(TwitchClient twitchClient,
                            TwitchEventListener twitchEventListener,
                            TCJRepository repository) {
        this.twitchClient = twitchClient;
        this.twitchEventListener = twitchEventListener;
        this.repository = repository;
    }

    // ------------------------------------------------------------------
    // 1. 系統啟動時：自動加入所有標記為 JOIN / JOINED 的頻道 + 註冊指令監聽
    // ------------------------------------------------------------------
    @PostConstruct
    public void init() {
        System.out.println("正在從 Supabase 讀取頻道資料...");

        List<TwitchChannelJoin> allChannels = repository.findAll();
        for (TwitchChannelJoin channel : allChannels) {
            String status = channel.getJoinOrLeave();
            if (status != null && (status.equalsIgnoreCase("JOINED") || status.equalsIgnoreCase("JOIN"))) {
                twitchClient.getChat().joinChannel(channel.getChannelName());
                System.out.println("✅ 已自動加入頻道: " + channel.getChannelName());
            }
        }

        // 註冊訊息日誌與指令監聽器
        SimpleEventHandler eventHandler = twitchClient.getEventManager().getEventHandler(SimpleEventHandler.class);
        eventHandler.onEvent(ChannelMessageEvent.class, twitchEventListener::handleMessage);

        System.out.println("✅ [TwitchBotService] 初始化完成");
    }

    // ------------------------------------------------------------------
    // 2. 頻道加入與離開（提供給 Controller 與內部邏輯呼叫）
    // ------------------------------------------------------------------

    /**
     * 直接傳入頻道名稱加入聊天室
     */
    public void tCJoin(String channelName) {
        try {
            twitchClient.getChat().joinChannel(channelName);
            System.out.println("✅ 成功加入 Twitch 頻道: " + channelName);
        } catch (Exception e) {
            System.err.println("❌ 加入頻道失敗 [" + channelName + "]: " + e.getMessage());
        }
    }

    /**
     * 直接傳入頻道名稱離開聊天室
     */
    public void tCLeave(String channelName) {
        try {
            twitchClient.getChat().leaveChannel(channelName);
            System.out.println("🚪 成功離開 Twitch 頻道: " + channelName);
        } catch (Exception e) {
            System.err.println("❌ 離開頻道失敗 [" + channelName + "]: " + e.getMessage());
        }
    }

    /**
     * 透過 ID 加入並更新 Supabase 狀態
     */
    public TwitchChannelJoin joinChannelById(Long id) {
        TwitchChannelJoin tcj = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到頻道 ID: " + id));

        tCJoin(tcj.getChannelName());
        tcj.setJoinOrLeave("JOINED");
        return repository.save(tcj);
    }

    /**
     * 透過 ID 離開並更新 Supabase 狀態
     */
    public TwitchChannelJoin leaveChannelById(Long id) {
        TwitchChannelJoin tcj = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到頻道 ID: " + id));

        tCLeave(tcj.getChannelName());
        tcj.setJoinOrLeave("LEFT");
        return repository.save(tcj);
    }

    // ------------------------------------------------------------------
    // 3. 發送訊息至指定頻道
    // ------------------------------------------------------------------
    public boolean sendMessage(String channelName, String msg) {
        try {
            twitchClient.getChat().sendMessage(channelName, msg);
            System.out.println("💬 成功對頻道 [" + channelName + "] 發送訊息: " + msg);

            // 將機器人送出的訊息同步至監控面板。
            TwitchEventListener.addSelfMessage(channelName, msg);

            return true;
        } catch (Exception e) {
            System.err.println("❌ 發送失敗 [" + channelName + "]: " + e.getMessage());
            return false;
        }
    }

    // 相容既有呼叫端的方法名稱。
    public boolean sendMessageToChannel(String channelName, String msg) {
        return sendMessage(channelName, msg);
    }

    // ------------------------------------------------------------------
    // 4. 資料表內容修改（CRUD 功能）
    // ------------------------------------------------------------------
    public List<TwitchChannelJoin> getAllChannels() {
        return repository.findAll();
    }

    public TwitchChannelJoin addChannel(TwitchChannelJoin channel) {
        if (channel.getJoinOrLeave() == null) {
            channel.setJoinOrLeave("LEFT");
        }
        return repository.save(channel);
    }

    public TwitchChannelJoin updateChannel(Long id, TwitchChannelJoin updatedData) {
        TwitchChannelJoin existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到頻道 ID: " + id));

        existing.setName(updatedData.getName());
        existing.setChannelName(updatedData.getChannelName());
        existing.setPro(updatedData.getPro());
        if (updatedData.getJoinOrLeave() != null) {
            existing.setJoinOrLeave(updatedData.getJoinOrLeave());
        }
        return repository.save(existing);
    }

    public void deleteChannel(Long id) {
        repository.findById(id).ifPresent(tcj -> {
            if ("JOINED".equalsIgnoreCase(tcj.getJoinOrLeave()) || "JOIN".equalsIgnoreCase(tcj.getJoinOrLeave())) {
                tCLeave(tcj.getChannelName());
            }
            repository.delete(tcj);
        });
    }
    // 依資料 ID 加入頻道。
    public TwitchChannelJoin joinChannel(Long id) {
        return joinChannelById(id);
    }

    // 依資料 ID 離開頻道。
    public TwitchChannelJoin leaveChannel(Long id) {
        return leaveChannelById(id);
    }
    // 提供 Controller 發送聊天室訊息。
    public boolean sendChatMessage(String channelName, String msg) {
        return sendMessage(channelName, msg);
    }
    public void findUserId(String channelName) {

        var result = twitchClient.getHelix()
                .getUsers(
                        null,
                        null,
                        List.of(channelName)
                )
                .execute();

        result.getUsers().forEach(user -> {
            System.out.println("頻道名稱: " + user.getDisplayName());
            System.out.println("Login: " + user.getLogin());
            System.out.println("User ID: " + user.getId());
        });
    }
}
