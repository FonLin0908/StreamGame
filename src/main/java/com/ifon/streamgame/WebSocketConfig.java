package com.ifon.streamgame;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig
        implements WebSocketConfigurer {

    private final OverlayWebSocketHandler overlayWebSocketHandler;

    public WebSocketConfig(
            OverlayWebSocketHandler overlayWebSocketHandler
    ) {
        this.overlayWebSocketHandler =
                overlayWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(
            WebSocketHandlerRegistry registry
    ) {

        registry
                .addHandler(
                        overlayWebSocketHandler,
                        "/ws/overlay"
                )
                .setAllowedOrigins("*");
    }
}