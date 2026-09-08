# StreamGame

StreamGame 是以 Spring Boot 開發的 Twitch 直播互動系統，整合聊天室機器人、頻道管理、答題遊戲、Channel Points 兌換事件與直播 Overlay。

## 專案背景

直播互動通常需要分別操作聊天室機器人、觀眾資料、頻道管理與畫面特效工具。為了簡化管理流程，我將這些需求整合成一套 Web 應用程式，並把 Twitch 聊天訊息與 Channel Points 兌換事件轉換為即時遊戲互動。

透過本專案，我實際完成從需求分析、系統架構、第三方 API 串接、資料儲存，到前端管理介面與即時動畫的完整開發流程。

## 實作重點

- 使用 Twitch4J 串接 Twitch Chat、Helix API 與 EventSub
- 分離機器人帳號與頻道主帳號的授權及用途
- 解析中英文聊天室指令並管理答題狀態
- 將 Channel Points 兌換事件轉換成 Overlay 遊戲事件
- 使用 WebSocket 將後端事件即時推送至直播畫面
- 將 Controller、Service、Repository 與 Model 分層管理
- 將敏感憑證與程式碼分離，避免上傳至公開倉庫

## 功能

- Twitch 聊天室機器人與自訂指令
- 頻道加入、離開及訊息發送
- 聊天紀錄監控
- 每日答題與即時搶答
- Channel Points 兌換事件監聽
- WebSocket 即時 Overlay 動畫
- 使用者與頻道資料管理

## 使用技術

- Java 21、Spring Boot 4.0.5
- Spring Web MVC、WebSocket、Data JPA
- PostgreSQL、JSON
- Twitch4J 1.26.0
- Thymeleaf、HTML、CSS、JavaScript、Bootstrap
- Maven、Git、GitHub

## 安裝與設定

### 1. 下載專案

```bash
git clone https://github.com/FonLin0908/StreamGame.git
cd StreamGame
```

### 2. 建立設定檔

Windows：

```bat
copy src\main\resources\application-example.properties src\main\resources\application.properties
```

Linux 或 macOS：

```bash
cp src/main/resources/application-example.properties src/main/resources/application.properties
```

在 `application.properties` 中填入 PostgreSQL 連線資訊，以及 Twitch Client、Bot、Broadcaster 的授權資料。

> `application.properties` 含有敏感資訊且已加入 `.gitignore`，請勿提交真實密碼或 Token。

### 3. 準備題庫

答題功能會讀取專案根目錄下的 `data/questions.json`，使用者答題狀態則儲存在 `data/users.json`。

```json
[
  {
    "id": 1,
    "type": "MULTIPLE_CHOICE",
    "question": "範例題目",
    "options": ["選項一", "選項二"],
    "answers": ["1"]
  }
]
```

支援 `MULTIPLE_CHOICE`、`TRUE_FALSE` 與 `SHORT_ANSWER` 三種題型。

## 啟動專案

```bash
mvn spring-boot:run
```

啟動後開啟 [http://localhost:8080](http://localhost:8080)。

## 主要頁面

| 路徑 | 功能 |
| --- | --- |
| `/` | 系統入口 |
| `/admin.html` | 使用者資料管理 |
| `/tcj_list.html` | Twitch 頻道資料管理 |
| `/twitch-manage.html` | Twitch 機器人管理 |
| `/twitch-monitor.html` | Twitch 聊天監控 |
| `/twitch.html` | Twitch 數據面板 |
| `/overlay` | 直播 Overlay |

Overlay 使用的 WebSocket 端點為 `/ws/overlay`。

## 聊天室指令

- `!command`、`!cmd`：顯示指令資訊
- `!ping`：檢查機器人狀態
- `!hi`、`!hello`：打招呼
- `!echo`：回傳指定文字
- `!運勢`：取得隨機運勢
- `!dice`、`!骰子`：擲骰子
- `!quiz`、`!每日答題`：取得每日題目
- `!答題`、`!答`：提交答案
- `!搶答開始`：開始搶答
- `!搶答`：提交搶答答案

部分指令具有頻道或權限限制。

## 開發挑戰與收穫

### 即時事件整合

聊天室訊息、EventSub 與 WebSocket 都具有非同步特性。我透過事件監聽與 Service 分工整理資料流，讓不同來源的事件能進入對應的處理流程。

### Overlay 狀態管理

Overlay 同時包含角色狀態、動畫排程與多次道具投擲。我需要確保畫面顯示數量、動畫速度與實際執行次數一致，並處理角色受傷、冰凍及死亡等狀態切換。

### 資料與授權管理

專案同時使用 PostgreSQL 與 JSON 保存不同類型的資料，並區分機器人及頻道主的 Twitch Token。這讓我更熟悉資料分層、OAuth 授權與第三方 API 的整合方式。

## 未來規劃

- 為管理功能加入登入與角色權限驗證
- 增加 Service 與 Controller 自動化測試
- 將 JSON 題庫及使用者狀態遷移至資料庫
- 限制 WebSocket 來源並強化正式部署安全
- 加入 Docker 與自動化部署流程
- 補充實際操作截圖與展示影片

## 專案結構

```text
src/main/java/com/ifon/streamgame/
├── config/       # 應用程式設定
├── model/        # 資料模型
├── repository/   # 資料存取
├── service/      # 業務邏輯
└── util/         # 共用工具

src/main/resources/
├── static/       # HTML、CSS、JavaScript 與圖片
└── templates/    # Thymeleaf 模板
```

## 測試

```bash
mvn test
```

## 安全注意事項

- 不要提交 `application.properties`、`.env` 或任何真實憑證。
- 若 Token 曾經公開，請立即撤銷並重新產生。
- 正式部署前應限制管理 API、管理頁面及 WebSocket 的存取權限。
- 正式環境應依部署方式調整 `spring.jpa.hibernate.ddl-auto`。

## 授權

本專案目前尚未指定開源授權。
