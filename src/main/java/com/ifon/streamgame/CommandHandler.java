package com.ifon.streamgame;

import com.github.twitch4j.chat.events.channel.ChannelMessageEvent;
import com.ifon.streamgame.model.GameUser;
import com.ifon.streamgame.model.Question;
import com.ifon.streamgame.model.QuizResult;
import com.ifon.streamgame.repository.GameUserRepository;
import com.ifon.streamgame.service.QuickQuizService;
import com.ifon.streamgame.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CommandHandler {

    private final Random random = new Random();
    private final GameUserRepository gameUserRepository;

    private final QuizService quizService;
    private final QuickQuizService quickQuizService;
    public CommandHandler(
            QuizService quizService,
            QuickQuizService quickQuizService,
            GameUserRepository gameUserRepository
    ) {
        this.quizService = quizService;
        this.quickQuizService = quickQuizService;
        this.gameUserRepository = gameUserRepository;
    }



    public void processCommand(ChannelMessageEvent event) {
        String msg = event.getMessage().trim();
        String user = event.getUser().getName();
        String displayName = event.getMessageEvent().getTagValue("display-name").orElse(user);
        String channelName = event.getChannel().getName();
        String userId =
                event.getUser().getId();

        // 檢查訊息是否以驚嘆號 "!" 開頭
        if (!msg.startsWith("!")) {
            return; // 不是指令就直接跳過
        }

        // 拆分指令與參數（例如 "!echo hello world" 拆成 ["!echo", "hello", "world"]）
        String[] parts = msg.split("\\s+", 2);
        String command = parts[0].toLowerCase(); // 指令名稱，轉為小寫
        String argument = (parts.length > 1) ? parts[1] : ""; // 參數內容

        switch (command) {
            case "!command":
            case "!cmd":
                String cmd = "!hi, !運勢, !dice, !我才, ";
                String cmd600189 = "!烤狐, !卯, !600189, !愛600189";
                String moaya = "!卯, !卯之歌, !每日答題, !答, !quiz, !答, !搶答開始, !搶答, !答對次數";
                if(channelName.equalsIgnoreCase("600189")) {
                    event.reply(event.getTwitchChat(), cmd + cmd600189);
                }
                else if(channelName.equalsIgnoreCase("maoya00715")) {
                    event.reply(event.getTwitchChat(), moaya);
                }
                else {
                    event.reply(event.getTwitchChat(), cmd);
                }
                break;
            case "!ping":
                event.reply(event.getTwitchChat(), "PONG!");
                break;

            case "!hi":
            case "!hello":
                event.reply(event.getTwitchChat(), "👋 哈囉 @" + user);
                break;

            case "!echo":
                if (argument.isEmpty()) {
                    event.reply(event.getTwitchChat(), "請在 !echo 後面輸入想要講的話！");
                } else {
                    event.reply(event.getTwitchChat(), "📢 " + argument);
                }
                break;
            case "!運勢":
                String[] FORTUNES = {"大吉","中吉","小吉","末吉","凶","大凶"};
                String fortuneText = FORTUNES[random.nextInt(FORTUNES.length)];
                event.reply(event.getTwitchChat(), "@" + displayName + " 的今日運勢為 " + fortuneText);
                break;
            case "!dice":
            case "!骰子":
                if(parts.length == 1) {
                    String globalCdKey = channelName + ":!dice";
                    long remainingSeconds = checkAndSetCooldown(globalCdKey, 5);
                    if (remainingSeconds > 0) {
                        event.reply(event.getTwitchChat(), "⏱️ @" + displayName + " 骰子冷卻中，請再等 " + remainingSeconds + " 秒再試！");
                        return;
                    }
                    int rdp = (random.nextInt( 6) + 1);
                    int bot = (random.nextInt( 6) + 1);
                    event.reply(event.getTwitchChat(), "@" +  displayName + " 搖出的數字為 " + rdp );
                }
                else if(parts.length == 2) {
                    String player2 = parts[1].replace("@", "").trim();
                    if (player2.equalsIgnoreCase(user)) {
                        event.reply(event.getTwitchChat(), "⚠️ @" + displayName + " 不能挑戰你自己！");
                        return;
                    }
                    pendingChallenges.put(player2, new ChallengeRequest(displayName));
                    event.reply(event.getTwitchChat(),
                            String.format("⚔️ @%s 向 @%s 發起了骰子對決！請 @%s 在 30 秒內輸入 !accept 接受 或 !deny 拒絕！",
                                    displayName, player2, player2));


                }
                break;
            case "!accept":
            case "!接受":
                if (!pendingChallenges.containsKey(user)) {
                    event.reply(event.getTwitchChat(), "⚠️ @" + displayName + " 目前沒有人向你發起對決邀請！");
                    return;
                }

                ChallengeRequest reqY = pendingChallenges.remove(user); // 移除並取得邀請資料

                // 檢查邀請是否超過 30 秒逾時
                if (System.currentTimeMillis() - reqY.timestamp > 30000) {
                    event.reply(event.getTwitchChat(), "⏰ @" + displayName + " 該挑戰邀請已過期！");
                    return;
                }
                int rdp1 = random.nextInt(6) + 1; // 挑戰者骰子
                int rdp2 = random.nextInt(6) + 1; // 被挑戰者(自己)骰子

                String outcome = (rdp1 > rdp2) ? "恭喜 @" + reqY.challengerName + " 獲勝！"
                        : (rdp1 < rdp2) ? "恭喜 @" + displayName + " 獲勝！"
                        : "雙方平手！！";

                event.reply(event.getTwitchChat(),
                        String.format("🎲 戰局開開！@%s 搖出 %d 點，@%s 搖出 %d 點！%s",
                                reqY.challengerName, rdp1, displayName, rdp2, outcome));
                break;
            case "!deny":
            case "!拒絕":
                if (pendingChallenges.containsKey(user)) {
                    ChallengeRequest reqN = pendingChallenges.remove(user);
                    event.reply(event.getTwitchChat(),
                            String.format("🛡️ @%s 拒絕了 @%s 的對決邀請！", displayName, reqN.challengerName));
                }
                break;
            case "!隊友":
                if(channelName.equalsIgnoreCase("mihiru0110")) {
                    event.reply(event.getTwitchChat(), "隊友為：https://www.twitch.tv/gadinovo_ttv 與 https://www.twitch.tv/lyle_ann");
                }
                break;
            case "!我才":
                String globalCdKey1 = channelName + ":!我才";
                long remainingSeconds1 = checkAndSetCooldown(globalCdKey1, 5);
                if (remainingSeconds1 > 0) {
                    return;
                }
                event.reply(event.getTwitchChat(),"我才剛來而已真的不再開一下嗎？真的嗎？再開一下嘛~");
                break;
            case "!600189":
                if(channelName.equalsIgnoreCase("600189")) {
                    String globalCdKey = channelName + ":!600189";
                    long remainingSeconds = checkAndSetCooldown(globalCdKey, 5);
                    if (remainingSeconds > 0) {
                        return;
                    }
                    event.reply(event.getTwitchChat(), "600189是狐的獄號！");
                }
                break;
            case "!烤狐":
                if(channelName.equalsIgnoreCase("600189")){
                    String globalCdKey = channelName + ":!烤狐";
                    long remainingSeconds = checkAndSetCooldown(globalCdKey, 5);
                    if (remainingSeconds > 0) {
                        return;
                    }
                    String[] text = {"將軟化奶油與迷迭香、百里香混合，填入狐皮與狐肉之間的縫隙，烘烤時奶油融化滲入肉質，香氣濃郁",
                            "使用香料乾擦醃漬，烘烤過程中多次刷上厚重的美式烤肉醬，帶有濃郁甜辣與煙燻味",
                            "經過川燙皮、刷麥芽糖水、懸掛風乾等多道工序後烘烤，追求極致脆皮與金黃色澤",
                            "以大量橄欖油、鮮榨檸檬汁、蒜末與牛至醃漬，口感清新不油膩"};
                    event.reply(event.getTwitchChat(), text[random.nextInt(text.length)]);
                }
                break;
            case "!卯":
                if(channelName.equalsIgnoreCase("600189")) {
                    String globalCdKey = channelName + ":!卯";
                    long remainingSeconds = checkAndSetCooldown(globalCdKey, 5);
                    if (remainingSeconds > 0) {
                        return;
                    }
                    event.reply(event.getTwitchChat(), "卯卯卯卯卯！！！");
                }else if(channelName.equalsIgnoreCase("maoya00715")){
                    String globalCdKey = channelName + ":!卯";
                    long remainingSeconds = checkAndSetCooldown(globalCdKey, 5);
                    if (remainingSeconds > 0) {
                        return;
                    }
                    String[] text = {" maoya0Mao maoya0Mao maoya0Mao ", "喵是一時的，卯！是一輩子的！！！", "卯卯卯卯卯！！！", "卯天卯地卯世界，卯卯卯卯卯！！ maoya0Mao  maoya0Mao  maoya0Mao ", "如果你說卯，我會跟著卯；如果你不卯，我還會繼續卯；如果你一直不卯，我就卯卯卯卯到你回卯！！！"};
                    event.reply(event.getTwitchChat(), text[random.nextInt(text.length)]);
                }
            case "!愛600189":
                if(channelName.equalsIgnoreCase("600189")) {
                    event.reply(event.getTwitchChat(), "@" + displayName + "愛他就要烤了吃掉他！");
                }
                break;
            case "!200":
                if(channelName.equalsIgnoreCase("600189")) {
                    event.reply(event.getTwitchChat(), "在2026年8月19日11點20分成功達成了200追里程碑！！！讓我們熱烈掌聲！！恭喜恭喜！！！！");
                }
                break;
            case "!quiz":
            case "!每日答題":
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("frzjtcbl0908")) {
                    return;
                } else if(channelName.equalsIgnoreCase("600189")) {
                    event.reply(event.getTwitchChat(), "狐這裡沒有題目哦！狐要的話再跟我說，我再找時間安排(此為機器人回復，人不一定在)");
                }

                Question question =
                        quizService.startQuiz(user, displayName);

                if (question == null) {

                    event.reply(
                            event.getTwitchChat(),
                            "@" + displayName + " 今天已經答過題目了！"
                    );

                    break;
                }

                String questionText;

                switch (question.getType()) {

                    case MULTIPLE_CHOICE:

                        StringBuilder options =
                                new StringBuilder();

                        for (int i = 0;
                             i < question.getOptions().size();
                             i++) {

                            options.append(i + 1)
                                    .append(". ")
                                    .append(question.getOptions().get(i))
                                    .append(" ");
                        }

                        questionText =
                                        " 今日題目：" +
                                        question.getQuestion() +
                                        " " +
                                        options +
                                        "，請使用 !答題 數字 回答，例如：!答題 1";

                        break;


                    case TRUE_FALSE:

                        questionText =
                                        " 今日題目：" +
                                        question.getQuestion() +
                                        " ，請使用 !答題 O 或 !答題 X 回答，例如：!答題 O";

                        break;


                    case SHORT_ANSWER:

                        questionText =
                                        " 今日題目：" +
                                        question.getQuestion() +
                                        " ，請使用 !答題 答案 回答，例如：!答題 花枝魷魚麵";

                        break;


                    default:

                        questionText =
                                        " 題目格式發生錯誤";

                        break;
                }

                event.reply(
                        event.getTwitchChat(),
                        questionText
                );

                break;
            case "!答題":
            case "!答":
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("frzjtcbl0908")) {
                    return;
                }
                if (argument.isEmpty()) {

                    event.reply(
                            event.getTwitchChat(),
                                    "請輸入答案，若要重新得題目請用指令!每日答題"
                    );

                    break;
                }

                QuizResult result =
                        quizService.answerQuiz(
                                user,
                                argument
                        );


                if (!result.isSuccess()) {

                    event.reply(
                            event.getTwitchChat(),
                                    result.getMessage()
                    );

                    break;
                }


                if (result.isCorrect()) {

                    event.reply(
                            event.getTwitchChat(),
                                    " maoya0Mao  回答正確！目前累計答對 " +
                                    result.getCorrectCount() +
                                    " 題！"
                    );

                } else {

                    event.reply(
                            event.getTwitchChat(),
                                    " 回答錯誤！目前累計答對 " +
                                    result.getCorrectCount() +
                                    " 題！"
                    );
                }

                break;
            case "!搶答開始": {
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("frzjtcbl0908")) {
                    return;
                }

                String userIdD =
                        event.getUser().getName();

                // 檢查是否有權限
                if (!userIdD.equals("maoya00715") && !userIdD.equals("frzjtcbl0908")) {
                    System.out.println("使用者：" + userIdD + "搶答權限不足！");

                    event.reply(
                            event.getTwitchChat(),
                            "你沒有開啟搶答的權限！"
                    );

                    break;
                }


                Question questionQ =
                        quickQuizService.start();

                if (questionQ == null) {

                    event.reply(
                            event.getTwitchChat(),
                            "目前已經有搶答正在進行！"
                    );

                    break;
                }


                String questionTextQ;

                switch (questionQ.getType()) {

                    case MULTIPLE_CHOICE:

                        StringBuilder options =
                                new StringBuilder();

                        for (int i = 0;
                             i < questionQ.getOptions().size();
                             i++) {

                            options.append(i + 1)
                                    .append(". ")
                                    .append(
                                            questionQ.getOptions().get(i)
                                    )
                                    .append(" ");
                        }

                        questionTextQ =
                                "⚡ 搶答開始！" +
                                        questionQ.getQuestion() +
                                        " " +
                                        options +
                                        "使用 !搶答 數字 回答！";

                        break;


                    case TRUE_FALSE:

                        questionTextQ =
                                "⚡ 搶答開始！" +
                                        questionQ.getQuestion() +
                                        " 使用 !搶答 O 或 !搶答 X 回答！";

                        break;


                    default:

                        questionTextQ =
                                "題目格式錯誤";

                        quickQuizService.finish();

                        break;
                }


                event.reply(
                        event.getTwitchChat(),
                        questionTextQ
                );

                break;
            }
            case "!搶答": {
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("frzjtcbl0908")) {
                    return;
                }

                if (!quickQuizService.isActive()) {

                    event.reply(
                            event.getTwitchChat(),
                            "目前沒有進行中的搶答！"
                    );

                    break;
                }


                if (argument.isEmpty()) {

                    event.reply(
                            event.getTwitchChat(),
                            "請在 !搶答 後面輸入答案！"
                    );

                    break;
                }


                boolean correct =
                        quickQuizService.answer(argument);


                // 答錯
                if (!correct) {

                    GameUser gameUser =
                            gameUserRepository.findOrCreate(
                                    user,
                                    displayName
                            );

                    event.reply(
                            event.getTwitchChat(),
                            "❌ 回答錯誤！"
                    );

                    break;
                }


                // 第一個答對後結束搶答
                quickQuizService.finish();


                event.reply(
                        event.getTwitchChat(),
                        "🎉 搶答成功！回答正確！ maoya0Mao "
                );

                break;
            }
            case "!答對次數":
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("frzjtcbl0908")) {
                    return;
                }
                event.reply(event.getTwitchChat(), "你的答對次數為 " + gameUserRepository.findOrCreate(user, displayName).getCorrectCount() + " 次  maoya0Mao ");
                break;
            case "!卯之歌":
                if(!channelName.equalsIgnoreCase("maoya00715") && !channelName.equalsIgnoreCase("600189")) {
                    return;
                }
                event.reply(event.getTwitchChat(), "你一定要聽聽看這首歌 maoya0Mao maoya0Mao ：https://youtu.be/f3iJxrjxCEU");
                break;
            case "!卯南梁":
                if(!channelName.equalsIgnoreCase("maoya00715")) {
                    return;
                }
                event.reply(event.getTwitchChat(), "卯是香香軟軟可愛小南梁！ maoya0Mao ");
                break;
            case "!男娘後宮團":
            case "!南梁後宮團":
                if(!channelName.equalsIgnoreCase("maoya00715")) {
                    return;
                }
                String text = "歡迎加入卯燁的南梁後宮團，加入即為接受你成為南梁的事實。目前卯燁的後宮名單為：";
                event.reply(event.getTwitchChat(), text);
                break;
            case "!加入男娘後宮團":
            case "!加入南梁後宮團":
                if(!channelName.equalsIgnoreCase("maoya00715")) {
                    return;
                }
                event.reply(event.getTwitchChat(), "卯是香香軟軟可愛小南梁！");
                break;
            case "!退出男娘團":
            case "!退出南梁團":
                if(!channelName.equalsIgnoreCase("maoya00715")) {
                    return;
                }
                event.reply(event.getTwitchChat(), "很抱歉！這裡不受理退出卯燁的男娘後宮團！ maoya0Mao maoya0Mao ");
                break;
            default:
                // 未知指令不回覆，避免干擾聊天室。
                break;
        }
    }

    private final Map<String, ChallengeRequest> pendingChallenges = new ConcurrentHashMap<>();

    private static class ChallengeRequest {
        String challengerName; // 發起挑戰者暱稱/帳號
        long timestamp;        // 建立時間 (用來判斷逾時)

        ChallengeRequest(String challengerName) {
            this.challengerName = challengerName;
            this.timestamp = System.currentTimeMillis();
        }
    }

    private final Map<String, Long> cooldowns = new ConcurrentHashMap<>();
    private long checkAndSetCooldown(String key, int cooldownSeconds) {
        long now = System.currentTimeMillis();
        long cooldownMs = cooldownSeconds * 1000L;
        Long lastUsed = cooldowns.get(key);

        if (lastUsed != null && (now - lastUsed) < cooldownMs) {
            // 還在冷卻中，回傳剩餘秒數 (向上取整)
            long remainingMs = cooldownMs - (now - lastUsed);
            return (remainingMs / 1000) + 1;
        }

        // 通過檢查，更新該鍵值的最新使用時間
        cooldowns.put(key, now);
        return 0; // 0 代表沒有冷卻，可以執行
    }

}
