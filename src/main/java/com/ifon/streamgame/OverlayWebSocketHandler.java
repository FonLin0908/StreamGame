package com.ifon.streamgame;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class OverlayWebSocketHandler
        extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions =
            ConcurrentHashMap.newKeySet();


    @Override
    public void afterConnectionEstablished(
            WebSocketSession session
    ) {

        sessions.add(
                session
        );


        log.info(
                "🎮 Overlay WebSocket 已連線 | session={} | 目前連線數={}",
                session.getId(),
                sessions.size()
        );
    }


    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {

        sessions.remove(
                session
        );


        log.info(
                "🚪 Overlay WebSocket 已離線 | session={} | 目前連線數={}",
                session.getId(),
                sessions.size()
        );
    }


    public void broadcast(String json) {

        log.info(
                "📡 開始 Broadcast | 目前 Overlay 連線數={} | JSON={}",
                sessions.size(),
                json
        );

        for (WebSocketSession session : sessions) {

            log.info(
                    "🔎 Session={} | open={}",
                    session.getId(),
                    session.isOpen()
            );

            if (!session.isOpen()) {

                log.warn(
                        "⚠️ Session 已關閉，跳過：{}",
                        session.getId()
                );

                continue;
            }

            try {

                session.sendMessage(
                        new TextMessage(json)
                );

                log.info(
                        "📤 WebSocket 訊息已送出 | Session={}",
                        session.getId()
                );

            } catch (Exception e) {

                log.error(
                        "❌ WebSocket 傳送失敗 | Session={}",
                        session.getId(),
                        e
                );
            }
        }
    }
}