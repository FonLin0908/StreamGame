package com.ifon.streamgame.service;

import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.eventsub.events.ChannelPointsCustomRewardRedemptionEvent;
import com.github.twitch4j.eventsub.subscriptions.SubscriptionTypes;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TwitchChannelPointsService {

    private final TwitchClient twitchClient;

    private final OverlayGameService overlayGameService;


    @Value("${twitch.broadcaster-user-id}")
    private String broadcasterUserId;


    public TwitchChannelPointsService(
            TwitchClient twitchClient,
            OverlayGameService overlayGameService
    ) {

        this.twitchClient =
                twitchClient;

        this.overlayGameService =
                overlayGameService;
    }


    @PostConstruct
    public void init() {

        // =================================================
        // 監聽兌換事件
        // =================================================

        twitchClient
                .getEventSocket()
                .getEventManager()
                .onEvent(
                        ChannelPointsCustomRewardRedemptionEvent.class,
                        this::handlePointRedemption
                );


        // =================================================
        // 註冊 EventSub
        // =================================================

        twitchClient
                .getEventSocket()
                .register(

                        SubscriptionTypes
                                .CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_ADD

                                .prepareSubscription(

                                        builder ->
                                                builder
                                                        .broadcasterUserId(
                                                                broadcasterUserId
                                                        )
                                                        .build(),

                                        null
                                )
                );


        log.info(
                "🎯 已註冊忠誠點兌換監聽：{}",
                broadcasterUserId
        );
    }


    // =====================================================
    // Twitch 忠誠點兌換
    // =====================================================

    private void handlePointRedemption(
            ChannelPointsCustomRewardRedemptionEvent event
    ) {

        String userName =
                event.getUserName();

        String rewardTitle =
                event.getReward().getTitle();


        log.info(
                "🎁 {} 兌換了 [{}]",
                userName,
                rewardTitle
        );


        // =================================================
        // 單次隨機投擲
        // =================================================

        if (
                rewardTitle.equalsIgnoreCase(
                        "丟東西(有開小遊戲限定)"
                )
        ) {

            overlayGameService.throwRandomItem(
                    userName
            );
        }


        // =================================================
        // 隨機投擲 ×10
        // =================================================

        else if (
                rewardTitle.equalsIgnoreCase(
                        "丟東西10次(有開小遊戲限定)"
                )
        ) {

            overlayGameService.throwRandomItemX10(
                    userName
            );
        }
    }
}