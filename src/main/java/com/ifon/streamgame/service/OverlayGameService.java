package com.ifon.streamgame.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifon.streamgame.OverlayWebSocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class OverlayGameService {

    private final OverlayWebSocketHandler overlayWebSocketHandler;

    private final ObjectMapper objectMapper;


    public OverlayGameService(
            OverlayWebSocketHandler overlayWebSocketHandler,
            ObjectMapper objectMapper
    ) {

        this.overlayWebSocketHandler =
                overlayWebSocketHandler;

        this.objectMapper =
                objectMapper;
    }


    public void throwRandomItem(
            String userName
    ) {

        log.info(
                "🍅 OverlayGameService.throwRandomItem() 被呼叫，userName={}",
                userName
        );


        try {

            Map<String, Object> data =
                    Map.of(
                            "type",
                            "THROW_ITEM",

                            "userName",
                            userName
                    );


            String json =
                    objectMapper.writeValueAsString(
                            data
                    );


            log.info(
                    "📦 準備 Broadcast JSON：{}",
                    json
            );


            overlayWebSocketHandler.broadcast(
                    json
            );


        } catch (Exception e) {

            log.error(
                    "❌ 建立番茄 WebSocket 訊息失敗",
                    e
            );
        }
    }
    public void throwRandomItemX10(
            String userName
    ) {

        log.info(
                "🎲 OverlayGameService.throwRandomItemX10() 被呼叫，userName={}",
                userName
        );


        try {

            Map<String, Object> data =
                    Map.of(
                            "type",
                            "THROW_ITEM_X10",

                            "userName",
                            userName
                    );


            String json =
                    objectMapper.writeValueAsString(
                            data
                    );


            log.info(
                    "📦 準備 Broadcast JSON：{}",
                    json
            );


            overlayWebSocketHandler.broadcast(
                    json
            );


        } catch (Exception e) {

            log.error(
                    "❌ 建立隨機投擲 ×10 WebSocket 訊息失敗",
                    e
            );
        }
    }
}