package com.ifon.streamgame;

import com.ifon.streamgame.service.OverlayGameService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class OverlayController {
    private final OverlayGameService overlayGameService;

    public OverlayController(
            OverlayGameService overlayGameService
    ) {
        this.overlayGameService =
                overlayGameService;
    }

    @GetMapping("/overlay")
    public String overlay() {
        return "overlay";
    }

    @GetMapping("/test-tomato")
    @ResponseBody
    public String testTomato() {

        overlayGameService.throwRandomItem(
                "後端測試玩家"
        );

        return "OK";
    }
}