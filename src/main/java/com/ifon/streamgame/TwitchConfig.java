package com.ifon.streamgame;

import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwitchConfig {

    // ==========================================
    // Twitch Developer Application
    // ==========================================

    @Value("${twitch.client.id}")
    private String clientId;

    @Value("${twitch.client.secret}")
    private String clientSecret;


    // ==========================================
    // Bot 帳號
    //
    // 用途：
    // - Twitch Chat 登入
    // - 加入聊天室
    // - 讀取聊天室訊息
    // - 發送聊天室訊息
    // ==========================================

    @Value("${twitch.bot.access-token}")
    private String botAccessToken;


    // ==========================================
    // 頻道主帳號
    //
    // 用途：
    // - EventSub
    // - Channel Points
    // - 頻道主授權 Helix API
    // ==========================================

    @Value("${twitch.broadcaster.access-token}")
    private String broadcasterAccessToken;


    @Bean
    public TwitchClient twitchClient() {

        // ------------------------------
        // Bot Credential
        // ------------------------------

        OAuth2Credential botCredential =
                new OAuth2Credential(
                        "twitch",
                        removeOAuthPrefix(botAccessToken)
                );


        // ------------------------------
        // Broadcaster Credential
        // ------------------------------

        OAuth2Credential broadcasterCredential =
                new OAuth2Credential(
                        "twitch",
                        removeOAuthPrefix(broadcasterAccessToken)
                );


        // ------------------------------
        // Twitch Client
        // ------------------------------

        return TwitchClientBuilder.builder()

                // Twitch Application
                .withClientId(clientId)
                .withClientSecret(clientSecret)

                // Bot 帳號負責 Chat
                .withChatAccount(botCredential)

                // 頻道主帳號負責 Helix / EventSub
                .withDefaultAuthToken(broadcasterCredential)

                // Twitch Chat
                .withEnableChat(true)

                // Twitch Helix API
                .withEnableHelix(true)

                // Twitch EventSub WebSocket
                .withEnableEventSocket(true)

                .build();
    }


    /**
     * OAuth2Credential 統一使用純 Access Token，
     * 如果設定值前面有 oauth:，先移除。
     */
    private String removeOAuthPrefix(String token) {

        if (token == null) {
            return null;
        }

        return token.startsWith("oauth:")
                ? token.substring(6)
                : token;
    }
}