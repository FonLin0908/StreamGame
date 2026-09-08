package com.ifon.streamgame;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 所有 API 預設直接回傳 JSON 或純文字。
@RequestMapping("/tcj")
public class TCJWebController {

    @Autowired
    private TCJRepository tCJRepository;

    @Autowired
    @Lazy
    private TwitchBotService twitchBotService;

    // 取得指定頻道的聊天日誌 API
    @GetMapping("/logs")
    public List<TwitchEventListener.ChatMessage> getLogs(
            @RequestParam(required = false) String channelName
    ) {
        return TwitchEventListener.getLogsByChannel(channelName);
    }

    // 1. 新增 / 儲存頻道資料 API (連動機器人)
    @RequestMapping(value = "/save", method = {RequestMethod.GET, RequestMethod.POST})
    public String saveTCJ(
            @RequestParam String name,
            @RequestParam String channelName,
            @RequestParam(required = false, defaultValue = "LEFT") String joinOrLeave,
            @RequestParam(required = false, defaultValue = "USER") String pro
    ) {
        TwitchChannelJoin tcj = new TwitchChannelJoin();
        tcj.setName(name);
        tcj.setChannelName(channelName);
        tcj.setJoinOrLeave(joinOrLeave);
        tcj.setPro(pro);

        tCJRepository.save(tcj);

        // 依據 joinOrLeave 狀態決定是否讓機器人加入聊天室
        if ("JOIN".equalsIgnoreCase(joinOrLeave) || "JOINED".equalsIgnoreCase(joinOrLeave)) {
            twitchBotService.tCJoin(channelName);
        }

        return "台主 " + name + " 資料已同步至 Supabase！";
    }

    // 2. 獲取所有使用者/頻道資料
    @GetMapping("/all")
    public List<TwitchChannelJoin> getAllTCJs() {
        return tCJRepository.findAll();
    }

    // 3. 移除頻道資料 (自動讓機器人退出該頻道)
    @RequestMapping(value = "/delete", method = {RequestMethod.GET, RequestMethod.POST})
    public String deleteTCJ(@RequestParam Long id) {
        return tCJRepository.findById(id).map(tcj -> {
            // 刪除前先讓機器人離開頻道
            twitchBotService.tCLeave(tcj.getChannelName());
            tCJRepository.deleteById(id);
            return "ID #" + id + " (" + tcj.getChannelName() + ") 已從雲端移除並退出頻道";
        }).orElse("找不到該 ID");
    }

    // 4. 編輯頻道基本資料
    @RequestMapping(value = "/update", method = {RequestMethod.GET, RequestMethod.POST})
    public String updateTCJ(
            @RequestParam Long id,
            @RequestParam String name,
            @RequestParam String channelName,
            @RequestParam String pro
    ) {
        return tCJRepository.findById(id).map(tcj -> {
            // 如果頻道名稱更換了，且原本是加入狀態，先退舊頻道再進新頻道
            if (!tcj.getChannelName().equalsIgnoreCase(channelName) &&
                    ("JOIN".equalsIgnoreCase(tcj.getJoinOrLeave()) || "JOINED".equalsIgnoreCase(tcj.getJoinOrLeave()))) {
                twitchBotService.tCLeave(tcj.getChannelName());
                twitchBotService.tCJoin(channelName);
            }

            tcj.setName(name);
            tcj.setChannelName(channelName);
            tcj.setPro(pro);
            tCJRepository.save(tcj);
            return "台主 #" + id + " 資料已更新！";
        }).orElse("找不到該台主");
    }

    // 5. 控制機器人進退 (並同步更新 DB 狀態)
    @PostMapping("/updateJOL")
    public String updateJOL(
            @RequestParam Long id,
            @RequestParam String joinOrLeave
    ) {
        return tCJRepository.findById(id).map(tcj -> {
            tcj.setJoinOrLeave(joinOrLeave);
            tCJRepository.save(tcj);

            // 同步控制機器人在 Twitch IRC 中的動作
            if ("JOIN".equalsIgnoreCase(joinOrLeave) || "JOINED".equalsIgnoreCase(joinOrLeave)) {
                twitchBotService.tCJoin(tcj.getChannelName());
            } else {
                twitchBotService.tCLeave(tcj.getChannelName());
            }

            return "ID: " + id + " 狀態已成功更新為: " + joinOrLeave + "，且機器人已同步狀態！";
        }).orElse("找不到該 ID 的資料");
    }

    // 6. [新功能] 從資料表選擇頻道並發送訊息
    @RequestMapping(value = "/send", method = {RequestMethod.GET, RequestMethod.POST})
    public String sendMessage(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String channelName,
            @RequestParam String msg
    ) {
        String targetChannel = channelName;

        // 若有帶入 ID，優先使用 ID 從資料庫查出頻道名稱
        if (id != null) {
            targetChannel = tCJRepository.findById(id)
                    .map(TwitchChannelJoin::getChannelName)
                    .orElse(null);
            if (targetChannel == null) {
                return "發送失敗：找不到 ID #" + id + " 的頻道";
            }
        }

        if (targetChannel == null || targetChannel.trim().isEmpty()) {
            return "發送失敗：請提供 id 或 channelName 參數";
        }

        boolean success = twitchBotService.sendMessage(targetChannel, msg);
        return success ? "成功對頻道 [" + targetChannel + "] 發送訊息: " + msg : "發送失敗，請確認機器人狀態";
    }

}
