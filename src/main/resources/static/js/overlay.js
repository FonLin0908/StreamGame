// ======================================================
// DOM
// ======================================================

const pudding =
    document.getElementById("pudding");

const puddingContainer =
    document.getElementById("pudding-container");

const hpContainer =
    document.getElementById("hp-container");

const hpBar =
    document.getElementById("hp-bar");

const projectileLayer =
    document.getElementById("projectile-layer");

const effectLayer =
    document.getElementById("effect-layer");

const redeemMessage =
    document.getElementById("redeem-message");

const puddingPlatform =
    document.getElementById(
        "pudding-platform"
    );

//布丁睡覺圖片
const PUDDING_SLEEP_IMAGE =
    "/images/game/pudding-sleep.png";
// ======================================================
// 桌面物件：雞蛋
// ======================================================

const eggObject =
    document.getElementById("eggObject");

const egg =
    document.getElementById("egg");

// ======================================================
// 場景設定
// ======================================================

const RESPAWN_X = 200;

const LEFT_BOUNDARY =
    RESPAWN_X;

const RIGHT_PADDING =
    120;

// ======================================================
// 睡覺機率設定
// ======================================================

function getSleepChance() {

    const hpPercent =
        state.hp /
        state.maxHp;


    if (hpPercent <= 0.25) {
        return 0.60;
    }

    if (hpPercent <= 0.50) {
        return 0.35;
    }

    if (hpPercent <= 0.75) {
        return 0.20;
    }

    if (hpPercent < 1.00) {
        return 0.12;
    }


    // 滿血也可能單純想睡
    return 0.07;
}

// ======================================================
// 隨機投擲物品
// ======================================================

function throwRandomItem(
    userName = "測試玩家"
) {

    const roll =
        Math.random();


    // ==================================================
    // 🍅 番茄 50%
    // ==================================================

    if (roll < 0.60) {

        console.log(
            `🎲 ${userName} 抽到番茄`
        );


        /*
         * 番茄的數量是在
         * throwTomatoBatch()
         * 裡面才抽，
         * 所以提示文字也繼續由它負責。
         */

        throwTomatoBatch(
            userName
        );

        return;
    }


    // ==================================================
    // 🧊 冰塊 25%
    // ==================================================

    if (roll < 0.95) {

        console.log(
            `🎲 ${userName} 抽到冰塊`
        );


        showThrowMessage(
            userName,
            "冰塊",
            1,
            "normal"
        );


        throwIce();

        return;
    }


    // ==================================================
    // 🍫 巧克力 25%
    // ==================================================

    console.log(
        `🎲 ${userName} 抽到巧克力`
    );


    showThrowMessage(
        userName,
        "巧克力",
        1,
        "normal"
    );


    throwChocolate();
}

// ======================================================
// 連續隨機投擲設定
// ======================================================

// 十連投擲次數
const RANDOM_THROW_BATCH_COUNT =
    10;


// 每次投擲之間的間隔
const RANDOM_THROW_BATCH_DELAY =
    500;

// ======================================================
// 連續隨機投擲
// ======================================================

function throwRandomItemBatch(
    userName = "測試玩家",
    count = RANDOM_THROW_BATCH_COUNT
) {

    let currentThrow =
        0;


    console.log(
        `🎲 ${userName} 開始連續隨機投擲 ×${count}`
    );


    // ==================================================
    // 執行下一次投擲
    // ==================================================

    function throwNext() {

        currentThrow++;


        console.log(
            `🎲 隨機投擲 ${currentThrow}/${count}`
        );


        // ==================================================
        // 使用原本的隨機投擲系統
        // ==================================================

        throwRandomItem(
            userName
        );


        // ==================================================
        // 已經完成全部投擲
        // ==================================================

        if (
            currentThrow >= count
        ) {

            console.log(
                `🎲 ${userName} 的連續隨機投擲完成`
            );

            return;
        }


        // ==================================================
        // 等待後進行下一次
        // ==================================================

        setTimeout(
            throwNext,
            RANDOM_THROW_BATCH_DELAY
        );
    }


    // 第一發立即執行
    throwNext();
}

// ======================================================
// 番茄設定
// ======================================================

const TOMATO_DAMAGE =
    5;

const TOMATO_FLIGHT_TIME =
    850;

const TOMATO_START_X_OFFSET =
    40;

const TOMATO_START_Y =
    180;

const TOMATO_THROW_MIN_X =
    300;

const TOMATO_THROW_RIGHT_PADDING =
    150;


// ======================================================
// 番茄數量機率
//
// ×1  = 30%
// ×2  = 25%
// ×4  = 20%
// ×8  = 12%
// ×16 = 7%
// ×32 = 4%
// ×64 = 2%
// ======================================================

const TOMATO_COUNT_OPTIONS = [

    {
        count: 4,
        weight: 30
    },

    {
        count: 8,
        weight: 25
    },

    {
        count: 16,
        weight: 20
    },

    {
        count: 32,
        weight: 12
    },

    {
        count: 64,
        weight: 7
    },

    {
        count: 128,
        weight: 4
    }

];

// ======================================================
// ICE 設定
// ======================================================

const ICE_FLIGHT_TIME = 650;

const ICE_START_X_OFFSET = 50;

const ICE_START_Y = 120;

const ICE_DAMAGE = 10;

const ICE_FREEZE_TIME = 2000;

let freezeTimer = null;

// ======================================================
// CHOCOLATE 設定
// ======================================================

// 飛行時間
const CHOCOLATE_FLIGHT_TIME =
    850;

// 顯示大小 80px，所以半徑約 40px
const CHOCOLATE_RADIUS =
    55;

const CHOCOLATE_BOUNCE_DISTANCE = 140;

// 場上目前存在的巧克力
let activeChocolateProjectile =
    null;
let activeChocolate =
    null;

// 吃巧克力恢復 HP
const CHOCOLATE_HEAL =
    50;

// ======================================================
// 巧克力追蹤設定
// ======================================================

// 追巧克力時比平常走快
const CHOCOLATE_CHASE_SPEED =
    120;

// ======================================================
// 桌面物件：展示台
// ======================================================


function getPlatformRect() {

    return puddingPlatform
        .getBoundingClientRect();
}

function getPlatformCenterX() {

    const rect =
        getPlatformRect();

    return (
        rect.left +
        rect.width / 2
    );
}

// ======================================================
// 睡覺 / 展示台設定
// ======================================================

// 前往展示台的速度
const SLEEP_WALK_SPEED =
    90;


// 距離展示台多少 px 時停止
const PLATFORM_APPROACH_OFFSET =
    -125;

// ======================================================
// 睡眠設定
// ======================================================

// 最短睡眠時間
const SLEEP_MIN_DURATION =
    5000;


// 最長睡眠時間
const SLEEP_MAX_DURATION =
    12000;


// 每隔多久回血一次
const SLEEP_HEAL_INTERVAL =
    1000;


// 每次恢復多少 HP
const SLEEP_HEAL_AMOUNT =
    5;

// ======================================================
// 展示台最終落點微調
// ======================================================

// 正數 = 往右
// 負數 = 往左
const PLATFORM_LANDING_OFFSET_X =
    135;


// 正數 = 往下
// 負數 = 往上
const PLATFORM_LANDING_OFFSET_Y =
    55;

// ======================================================
// 取得展示台停靠位置
// ======================================================

function getPlatformApproachX() {

    const gameRect =
        gameArea.getBoundingClientRect();


    const platformRect =
        puddingPlatform.getBoundingClientRect();


    /*
     * 展示台左側相對於遊戲區的位置
     */
    const platformLeft =
        platformRect.left -
        gameRect.left;


    /*
     * 布丁從展示台左邊接近。
     */
    return (
        platformLeft -
        PLATFORM_APPROACH_OFFSET
    );
}

// ======================================================
// 跳上展示台設定
// ======================================================

// 整個跳躍花多久
const PLATFORM_JUMP_DURATION =
    650;


// 跳躍額外高度
const PLATFORM_JUMP_HEIGHT =
    75;


// 台面位置微調
// 之後依實際畫面調這個就好
const PLATFORM_SURFACE_OFFSET_Y =
    75;

// ======================================================
// 跳下展示台設定
// ======================================================

const PLATFORM_JUMP_DOWN_DURATION =
    600;


// 跳下時的拋物線高度
const PLATFORM_JUMP_DOWN_HEIGHT =
    65;


// 落地時離展示台中心的水平距離
const PLATFORM_JUMP_DOWN_DISTANCE =
    130;

let platformJumpDownStartTime =
    0;


let platformJumpDownStartX =
    0;


let platformJumpDownTargetX =
    0;


let platformJumpDownStartY =
    0;

// ======================================================
// 取得展示台台面 Y
// ======================================================

function getPlatformSurfaceY() {

    const gameRect =
        gameArea.getBoundingClientRect();


    const platformRect =
        puddingPlatform.getBoundingClientRect();


    const platformTop =
        platformRect.top -
        gameRect.top;


    return (
        platformTop +
        PLATFORM_SURFACE_OFFSET_Y
    );
}

let platformJumpStartTime =
    0;


let platformJumpStartX =
    0;


let platformJumpTargetX =
    0;


let platformJumpStartY =
    0;


let platformJumpTargetY =
    0;

// ======================================================
// 雞蛋設定
// ======================================================

// 雞蛋目前 X 座標
let eggX =
    0;


// 雞蛋目前水平速度
let eggVelocityX =
    0;


// 雞蛋目前旋轉角度
let eggRotation =
    65;


// 是否正在滾動
let eggRolling =
    false;


// 被布丁撞到時的初始速度
const EGG_PUSH_SPEED =
    380;


// 每秒減速量
const EGG_FRICTION =
    650;


// 速度低於這個值就直接停止
const EGG_STOP_SPEED =
    10;

// ======================================================
// 布丁玩雞蛋設定
// ======================================================

// 追蛋速度
const EGG_CHASE_SPEED =
    100;


// 每次 idle 時，有多少機率想玩雞蛋
// 先用 35% 測試，之後再降低
const EGG_PLAY_CHANCE =
    0.35;


// 推完蛋後停頓多久再追
const EGG_PLAY_PAUSE =
    350;

// ======================================================
// 睡覺設定
// ======================================================

// 跳上展示台後多久開始睡
const PLATFORM_SLEEP_DELAY =
    500;


// ======================================================
// 角色狀態
// ======================================================

const state = {

    x: RESPAWN_X,

    speed: 45,

    direction: 1,

    // idle / walk / hit / dead
    mode: "idle",

    targetX: null,

    // 控制角色能不能散步
    locked: false,

    // 是否正在播放受傷動畫
    hitAnimating: false,

    //冰凍狀態
    frozen: false,

    //張口吃狀態
    eatingChocolate: false,

    //追逐巧克力
    chasingChocolate: false,

    //巧克力狀態
    chocolate: false,

    //遊玩雞蛋狀態
    playingEgg: false,

    // 已經推了幾次
    eggPlayCount: 0,

    // 這次預計玩幾次
    eggPlayTarget: 0,

    sleeping: false,
    goingToSleep: false,
    jumpingToPlatform: false,
    jumpingFromPlatform: false,

    hp: 100,

    maxHp: 100
};

// ======================================================
// 更新布丁外觀
// ======================================================

function updatePuddingAppearance() {

    // ==================================================
    // 死亡
    // ==================================================

    if (state.mode === "dead") {

        pudding.src =
            "/images/game/pudding-dead.png";

        return;
    }


    // ==================================================
    // 冰凍
    // ==================================================

    if (state.frozen) {

        pudding.src =
            "/images/game/pudding-frozen.png";

        return;
    }


    // ==================================================
    // 正在吃巧克力
    // ==================================================

    if (state.eatingChocolate) {

        pudding.src =
            "/images/game/pudding-eat.png";

        return;
    }


    // ==================================================
    // 巧克力狀態
    // ==================================================

    if (state.chocolate) {

        pudding.src =
            "/images/game/pudding-chocolate.png";

        pudding.classList.add(
            "chocolate"
        );

        return;
    }


    // ==================================================
    // 普通狀態
    // ==================================================

    pudding.src =
        "/images/game/pudding.png";


    pudding.classList.remove(
        "chocolate"
    );
}

// ======================================================
// Timer
// ======================================================

let hpHideTimer =
    null;

let sleepEndTimer =
    null;

let sleepHealTimer =
    null;

// ======================================================
// 兌換訊息設定
// ======================================================

// 同時最多顯示幾條
const MAX_REDEEM_MESSAGES =
    4;


// 一般訊息停留時間
const REDEEM_MESSAGE_LIFETIME =
    4000;


// 淡出時間
const REDEEM_MESSAGE_FADE_TIME =
    500;

// ======================================================
// 讓單一兌換訊息自動淡出並刪除
// ======================================================

function scheduleRedeemMessageRemoval(
    messageItem,
    displayTime
) {

    setTimeout(() => {

        // 可能已經因為訊息太多被提前刪掉
        if (!messageItem.isConnected) {
            return;
        }


        // 開始淡出
        messageItem.classList.add(
            "removing"
        );


        // 淡出完成後真正刪除
        setTimeout(() => {

            if (
                messageItem.isConnected
            ) {

                messageItem.remove();
            }

        }, REDEEM_MESSAGE_FADE_TIME);

    }, displayTime);
}

// ======================================================
// 場景範圍
// ======================================================

function getRightBoundary() {

    return (
        window.innerWidth -
        RIGHT_PADDING
    );
}


// ======================================================
// 桌面高度
// ======================================================

function getTableSurfaceY() {

    const puddingRect =
        pudding.getBoundingClientRect();

    /*
     * 布丁本身站在桌面上，
     * 所以使用布丁底部作為桌面基準。
     */

    return puddingRect.bottom;
}


// ======================================================
// Random
// ======================================================

function random(
    min,
    max
) {

    return (
        Math.random() *
        (max - min) +
        min
    );
}


// ======================================================
// HP
// ======================================================

function updateHpBar() {

    const percent =
        (
            state.hp /
            state.maxHp
        ) * 100;

    hpBar.style.width =
        `${percent}%`;
}


// ======================================================
// 顯示 HP
// ======================================================

function showHpBar() {

    if (
        hpHideTimer !== null
    ) {

        clearTimeout(
            hpHideTimer
        );

        hpHideTimer =
            null;
    }


    hpContainer.classList.add(
        "show"
    );
}


// ======================================================
// 隱藏 HP
// ======================================================

function hideHpBar() {

    hpContainer.classList.remove(
        "show"
    );
}


// ======================================================
// 延遲隱藏 HP
// ======================================================

function scheduleHideHpBar() {

    if (
        hpHideTimer !== null
    ) {

        clearTimeout(
            hpHideTimer
        );
    }


    hpHideTimer =
        setTimeout(() => {

            if (
                state.mode !== "dead"
            ) {

                hideHpBar();
            }

            hpHideTimer =
                null;

        }, 3000);
}

// ======================================================
// 開始前往展示台
// ======================================================

function startGoingToSleep() {

    // ==================================================
    // 無法睡覺的狀態
    // ==================================================

    if (
        state.mode === "dead" ||
        state.frozen ||
        state.locked ||
        state.eatingChocolate ||
        state.chasingChocolate ||
        state.playingEgg ||
        state.sleeping ||
        state.goingToSleep
    ) {
        return;
    }


    state.goingToSleep =
        true;


    state.mode =
        "goingToSleep";


    console.log(
        "💤 布丁想睡覺，前往展示台"
    );
}

// ======================================================
// 更新：前往展示台
// ======================================================

function updateGoingToSleep(
    deltaTime
) {

    if (!state.goingToSleep) {
        return;
    }


    const targetX =
        getPlatformApproachX();


    const distance =
        targetX -
        state.x;


    // ==================================================
    // 已經到展示台旁
    // ==================================================

    if (
        Math.abs(distance) <= 5
    ) {

        state.x =
            targetX;


        puddingContainer.style.left =
            `${state.x}px`;


        console.log(
            "💤 布丁抵達展示台旁"
        );


        state.mode =
            "platformReady";


        startJumpToPlatform();


        return;
    }


    // ==================================================
    // 決定方向
    // ==================================================

    state.direction =
        distance > 0
            ? 1
            : -1;


    // ==================================================
    // 移動
    // ==================================================

    state.x +=
        SLEEP_WALK_SPEED *
        state.direction *
        deltaTime;


    // ==================================================
    // 防止超出場景
    // ==================================================

    state.x =
        Math.max(
            LEFT_BOUNDARY,
            Math.min(
                state.x,
                getRightBoundary()
            )
        );


    puddingContainer.style.left =
        `${state.x}px`;


    // ==================================================
    // 走路動畫
    // ==================================================

    const bounce =
        Math.abs(
            Math.sin(
                performance.now() / 125
            )
        ) * 6;


    const squash =
        Math.sin(
            performance.now() / 125
        ) * 0.03;


    const directionScale =
        state.direction === 1
            ? 1
            : -1;


    pudding.style.transform =
        `
        translateY(-${bounce}px)
        scaleX(${directionScale * (1 + squash)})
        scaleY(${1 - squash})
        `;
}

// ======================================================
// 開始跳上展示台
// ======================================================

function startJumpToPlatform() {

    if (
        !state.goingToSleep ||
        state.mode !== "platformReady"
    ) {
        return;
    }


    state.jumpingToPlatform =
        true;

    state.mode =
        "jumpingToPlatform";


    // ==================================================
    // 記錄起跳時間
    // ==================================================

    platformJumpStartTime =
        performance.now();


    // ==================================================
    // 起點
    // ==================================================

    platformJumpStartX =
        state.x;


    platformJumpStartY =
        0;


    // ==================================================
    // 展示台中央
    // ==================================================

    const gameRect =
        gameArea.getBoundingClientRect();


    const platformRect =
        puddingPlatform.getBoundingClientRect();


    const platformCenterX =
        (
            platformRect.left -
            gameRect.left
        ) +
        platformRect.width / 2;


    /*
     * state.x 通常代表 puddingContainer 左側，
     * 所以要扣掉布丁寬度的一半。
     */
    platformJumpTargetX =
        platformCenterX -
        puddingContainer.offsetWidth / 2 +
        PLATFORM_LANDING_OFFSET_X;


    // ==================================================
    // 目標高度
    // ==================================================

    const tableSurfaceY =
        getTableSurfaceY();


    const platformSurfaceY =
        getPlatformSurfaceY();


    /*
     * transform 的 Y：
     *
     * 0 = 桌面
     * 負數 = 往上
     */
    platformJumpTargetY =
        -(
            tableSurfaceY -
            platformSurfaceY
        ) +
        PLATFORM_LANDING_OFFSET_Y;


    console.log(
        "💤 布丁開始跳上展示台",
        {
            startX:
                platformJumpStartX,

            targetX:
                platformJumpTargetX,

            targetY:
                platformJumpTargetY
        }
    );
}

// ======================================================
// 開始從展示台跳下來
// ======================================================

function startJumpFromPlatform() {

    if (
        state.mode !== "onPlatform" ||
        state.sleeping
    ) {
        return;
    }


    state.jumpingFromPlatform =
        true;

    state.mode =
        "jumpingFromPlatform";


    // ==================================================
    // 記錄起跳資料
    // ==================================================

    platformJumpDownStartTime =
        performance.now();


    platformJumpDownStartX =
        state.x;


    platformJumpDownStartY =
        platformJumpTargetY;


    // ==================================================
    // 決定往哪邊跳
    // ==================================================

    /*
     * 展示台在畫面偏左，
     * 所以目前先固定往右邊跳。
     */

    state.direction =
        1;


    platformJumpDownTargetX =
        platformJumpDownStartX +
        PLATFORM_JUMP_DOWN_DISTANCE;


    // ==================================================
    // 防止跳出桌面
    // ==================================================

    platformJumpDownTargetX =
        Math.min(
            platformJumpDownTargetX,
            getRightBoundary()
        );


    console.log(
        "☀️ 布丁準備跳下展示台",
        {
            startX:
                platformJumpDownStartX,

            targetX:
                platformJumpDownTargetX,

            startY:
                platformJumpDownStartY
        }
    );
}

// ======================================================
// 更新：跳上展示台
// ======================================================

function updateJumpToPlatform() {

    if (
        !state.jumpingToPlatform
    ) {
        return;
    }


    const elapsed =
        performance.now() -
        platformJumpStartTime;


    const progress =
        Math.min(
            elapsed /
            PLATFORM_JUMP_DURATION,
            1
        );


    // ==================================================
    // X 軸
    // ==================================================

    const currentX =
        platformJumpStartX +
        (
            platformJumpTargetX -
            platformJumpStartX
        ) *
        progress;


    state.x =
        currentX;


    puddingContainer.style.left =
        `${currentX}px`;


    // ==================================================
    // Y 軸
    //
    // 基礎移動：
    // 0 → 展示台高度
    //
    // 再加上一個拋物線跳躍
    // ==================================================

    const baseY =
        platformJumpStartY +
        (
            platformJumpTargetY -
            platformJumpStartY
        ) *
        progress;


    const jumpArc =
        Math.sin(
            progress *
            Math.PI
        ) *
        PLATFORM_JUMP_HEIGHT;


    const currentY =
        baseY -
        jumpArc;


    pudding.style.transform =
        `
        translateY(${currentY}px)
        scaleX(${state.direction})
        `;


    // ==================================================
    // 還沒跳完
    // ==================================================

    if (
        progress < 1
    ) {
        return;
    }


    // ==================================================
    // 落到展示台
    // ==================================================

    state.jumpingToPlatform =
        false;


    state.mode =
        "onPlatform";


    state.x =
        platformJumpTargetX;


    puddingContainer.style.left =
        `${platformJumpTargetX}px`;


    pudding.style.transform =
        `
        translateY(${platformJumpTargetY}px)
        scaleX(${state.direction})
        `;


    console.log(
        "💤 布丁成功跳上展示台"
    );

    // ==================================================
    // 稍微停一下再躺下
    // ==================================================

    setTimeout(
        () => {

            if (
                state.mode === "onPlatform"
            ) {

                startSleeping();
            }

        },
        PLATFORM_SLEEP_DELAY
    );

}

// ======================================================
// 更新：從展示台跳下來
// ======================================================

function updateJumpFromPlatform() {

    if (
        !state.jumpingFromPlatform
    ) {
        return;
    }


    const elapsed =
        performance.now() -
        platformJumpDownStartTime;


    const progress =
        Math.min(
            elapsed /
            PLATFORM_JUMP_DOWN_DURATION,
            1
        );


    // ==================================================
    // X 軸
    // ==================================================

    const currentX =
        platformJumpDownStartX +
        (
            platformJumpDownTargetX -
            platformJumpDownStartX
        ) *
        progress;


    state.x =
        currentX;


    puddingContainer.style.left =
        `${currentX}px`;


    // ==================================================
    // Y 軸
    //
    // 展示台高度 → 桌面高度 0
    // ==================================================

    const baseY =
        platformJumpDownStartY *
        (
            1 - progress
        );


    // ==================================================
    // 拋物線
    // ==================================================

    const jumpArc =
        Math.sin(
            progress *
            Math.PI
        ) *
        PLATFORM_JUMP_DOWN_HEIGHT;


    const currentY =
        baseY -
        jumpArc;


    // ==================================================
    // 更新布丁
    // ==================================================

    pudding.style.transform =
        `
        translateY(${currentY}px)
        scaleX(${state.direction})
        `;


    // ==================================================
    // 還沒落地
    // ==================================================

    if (
        progress < 1
    ) {
        return;
    }


    // ==================================================
    // 正式落回桌面
    // ==================================================

    finishJumpFromPlatform();
}

// ======================================================
// 完成跳下展示台
// ======================================================

function finishJumpFromPlatform() {

    state.jumpingFromPlatform =
        false;

    state.goingToSleep =
        false;

    state.sleeping =
        false;


    // ==================================================
    // 回到桌面座標
    // ==================================================

    state.x =
        platformJumpDownTargetX;


    puddingContainer.style.left =
        `${state.x}px`;


    pudding.style.transform =
        `
        translateY(0)
        scaleX(${state.direction})
        `;


    // ==================================================
    // HP Bar 也回到正常高度
    // ==================================================

    hpContainer.style.transform =
        "";


    hideHpBar();


    // ==================================================
    // 恢復正常外觀
    // ==================================================

    updatePuddingAppearance();


    console.log(
        "☀️ 布丁跳下展示台，恢復正常活動"
    );


    // ==================================================
    // 回到一般行動
    // ==================================================

    state.mode =
        "idle";


    resumePuddingAction();
}

// ======================================================
// 開始睡覺
// ======================================================

function startSleeping() {

    if (
        state.mode !== "onPlatform"
    ) {
        return;
    }


    state.sleeping =
        true;

    state.goingToSleep =
        false;

    state.mode =
        "sleeping";


    // ==================================================
    // 切換睡覺圖片
    // ==================================================

    pudding.src =
        PUDDING_SLEEP_IMAGE;


    pudding.style.transform =
        `
        translateY(${platformJumpTargetY}px)
        scaleX(1)
        `;


    // ==================================================
    // 隨機決定這次睡多久
    // ==================================================

    const sleepDuration =
        Math.floor(
            Math.random() *
            (
                SLEEP_MAX_DURATION -
                SLEEP_MIN_DURATION +
                1
            )
        ) +
        SLEEP_MIN_DURATION;


    console.log(
        `💤 布丁開始睡覺，預計睡 ${(sleepDuration / 1000).toFixed(1)} 秒`
    );

    // ==================================================
        // HP Bar 跟著布丁移到展示台上
        // ==================================================

        hpContainer.style.transform =
            `translateY(${platformJumpTargetY}px)`;


    if (
        state.hp <
        state.maxHp
    ) {

        hpContainer.style.opacity =
            "1";

        updateHpBar();
    }

    // ==================================================
    // 開始回血
    // ==================================================

    startSleepHealing();


    // ==================================================
    // 睡眠時間結束
    // ==================================================

    sleepEndTimer =
        setTimeout(
            () => {

                finishSleeping();

            },
            sleepDuration
        );
}

// ======================================================
// 睡眠回血
// ======================================================

function startSleepHealing() {

    // 防止重複 Timer
    clearInterval(
        sleepHealTimer
    );


    sleepHealTimer =
        setInterval(
            () => {

                // ==========================================
                // 已經不在睡覺
                // ==========================================

                if (
                    !state.sleeping ||
                    state.mode !== "sleeping"
                ) {

                    clearInterval(
                        sleepHealTimer
                    );

                    sleepHealTimer =
                        null;

                    return;
                }


                // ==========================================
                // HP 已滿
                // ==========================================

                if (
                    state.hp >=
                    state.maxHp
                ) {

                    state.hp =
                        state.maxHp;


                    updateHpBar();


                    /*
                     * HP 滿就提早醒來
                     */
                    finishSleeping();

                    return;
                }


                // ==========================================
                // 回血
                // ==========================================

                state.hp =
                    Math.min(
                        state.hp +
                        SLEEP_HEAL_AMOUNT,

                        state.maxHp
                    );


                updateHpBar();


                console.log(
                    `❤️ 睡眠回血：${state.hp}/${state.maxHp}`
                );


                // ==========================================
                // 這次回血後剛好滿血
                // ==========================================

                if (
                    state.hp >=
                    state.maxHp
                ) {

                    finishSleeping();
                }

            },
            SLEEP_HEAL_INTERVAL
        );
}

// ======================================================
// 結束睡眠
// ======================================================

function finishSleeping() {

    if (
        !state.sleeping
    ) {
        return;
    }


    console.log(
        "☀️ 布丁睡醒了"
    );


    // ==================================================
    // 清除睡眠 Timer
    // ==================================================

    if (
        sleepEndTimer !== null
    ) {

        clearTimeout(
            sleepEndTimer
        );

        sleepEndTimer =
            null;
    }


    if (
        sleepHealTimer !== null
    ) {

        clearInterval(
            sleepHealTimer
        );

        sleepHealTimer =
            null;
    }


    // ==================================================
    // 結束睡眠狀態
    // ==================================================

    state.sleeping =
        false;

    hideHpBar();


    // 保持在展示台上，等待後續狀態切換。
    state.mode =
        "onPlatform";


    // ==================================================
    // 切回正常外觀
    // ==================================================

    updatePuddingAppearance();


    // ==================================================
    // 保持站在展示台
    // ==================================================

    pudding.style.transform =
        `
        translateY(${platformJumpTargetY}px)
        scaleX(${state.direction})
        `;


    // ==================================================
    // 短暫醒來後跳下展示台
    // ==================================================

    setTimeout(
        () => {

            if (
                state.mode === "onPlatform" &&
                !state.sleeping
            ) {

                startJumpFromPlatform();
            }

        },
        500
    );

    console.log(
        `☀️ 睡眠結束，目前 HP：${state.hp}/${state.maxHp}`
    );

}

// ======================================================
// 初始化雞蛋位置
// ======================================================

function initializeEgg() {

    /*
     * offsetLeft 就是雞蛋目前相對於
     * 定位父元素的實際 left。
     *
     * 這跟之後：
     * eggObject.style.left = `${eggX}px`
     * 使用的是同一套座標。
     */

    eggX =
        eggObject.offsetLeft;


    // 把原本 58% 固定成實際 px
    eggObject.style.left =
        `${eggX}px`;


    console.log(
        `🥚 雞蛋初始化 X=${Math.round(eggX)}`
    );
}

// ======================================================
// 檢查布丁是否撞到雞蛋
// ======================================================

function checkPuddingEggCollision() {

    // 只有「正在玩雞蛋」時才啟用碰撞
    if (!state.playingEgg) {
        return;
    }

    // 雞蛋正在滾動時
    // 暫時不要再次觸發
    if (eggRolling) {
        return;
    }


    // 死亡 / 冰凍時不推蛋
    if (
        state.mode === "dead" ||
        state.frozen
    ) {
        return;
    }


    const puddingRect =
        pudding.getBoundingClientRect();


    const eggRect =
        eggObject.getBoundingClientRect();


    // ==================================================
    // 布丁碰撞框縮小
    // ==================================================

    const puddingPaddingX =
        puddingRect.width * 0.21;

    const puddingPaddingTop =
        puddingRect.height * 0.15;

    const puddingPaddingBottom =
        puddingRect.height * 0.08;


    const puddingLeft =
        puddingRect.left +
        puddingPaddingX;

    const puddingRight =
        puddingRect.right -
        puddingPaddingX;

    const puddingTop =
        puddingRect.top +
        puddingPaddingTop;

    const puddingBottom =
        puddingRect.bottom -
        puddingPaddingBottom;


    // ==================================================
    // 雞蛋碰撞框縮小
    // ==================================================

    const eggPaddingX =
        eggRect.width * 0.21;

    const eggPaddingTop =
        eggRect.height * 0.12;

    const eggPaddingBottom =
        eggRect.height * 0.10;


    const eggLeft =
        eggRect.left +
        eggPaddingX;

    const eggRight =
        eggRect.right -
        eggPaddingX;

    const eggTop =
        eggRect.top +
        eggPaddingTop;

    const eggBottom =
        eggRect.bottom -
        eggPaddingBottom;


    // ==================================================
    // 真正碰撞判定
    // ==================================================

    const collided =
        puddingRight >= eggLeft &&
        puddingLeft <= eggRight &&
        puddingBottom >= eggTop &&
        puddingTop <= eggBottom;


    if (!collided) {
        return;
    }


    // ==================================================
    // 判斷從哪一側撞
    // ==================================================

    const puddingCenterX =
        (
            puddingLeft +
            puddingRight
        ) / 2;


    const eggCenterX =
        (
            eggLeft +
            eggRight
        ) / 2;


    const direction =
        puddingCenterX <
        eggCenterX
            ? 1
            : -1;


    pushEgg(
        direction
    );
}

// ======================================================
// 推動雞蛋
// ======================================================

function pushEgg(
    direction
) {

    if (eggRolling) {
        return;
    }


    eggRolling =
        true;


    eggVelocityX =
        EGG_PUSH_SPEED *
        direction;


    // ==================================================
    // 記錄玩蛋次數
    // ==================================================

    if (state.playingEgg) {

        state.eggPlayCount++;

        console.log(
            `🥚 玩蛋進度 ${state.eggPlayCount}/${state.eggPlayTarget}`
        );
    }


    playEggBump();


    console.log(
        direction > 0
            ? "🍮🥚 布丁把雞蛋往右推！"
            : "🥚🍮 布丁把雞蛋往左推！"
    );
}

// ======================================================
// 更新雞蛋滾動
// ======================================================

function updateEgg(
    deltaTime
) {

    if (!eggRolling) {
        return;
    }


    // ==================================================
    // 更新位置
    // ==================================================

    eggX +=
        eggVelocityX *
        deltaTime;


    // ==================================================
    // 根據移動距離旋轉
    // ==================================================

    eggRotation +=
        eggVelocityX *
        deltaTime *
        1.2;


    // ==================================================
    // 場景邊界
    // ==================================================

    const gameRect =
        gameArea.getBoundingClientRect();


    const eggWidth =
        eggObject.offsetWidth;


    const minX =
        20;


    const maxX =
        gameRect.width -
        eggWidth -
        20;


    // ==================================================
    // 左邊界
    // ==================================================

    if (
        eggX <= minX
    ) {

        resetEggToCenter();

        return;
    }


    // ==================================================
    // 右邊界
    // ==================================================

    if (
        eggX >= maxX
    ) {

        resetEggToCenter();

        return;
    }


    // ==================================================
    // 摩擦力減速
    // ==================================================

    if (
        eggVelocityX > 0
    ) {

        eggVelocityX -=
            EGG_FRICTION *
            deltaTime;


        if (
            eggVelocityX < 0
        ) {

            eggVelocityX =
                0;
        }

    } else if (
        eggVelocityX < 0
    ) {

        eggVelocityX +=
            EGG_FRICTION *
            deltaTime;


        if (
            eggVelocityX > 0
        ) {

            eggVelocityX =
                0;
        }
    }


    // ==================================================
    // 停止
    // ==================================================

    if (
        Math.abs(
            eggVelocityX
        ) <= EGG_STOP_SPEED
    ) {

        eggVelocityX =
            0;

        eggRolling =
            false;


        console.log(
            "🥚 雞蛋停止滾動"
        );


        // ==================================================
        // 如果正在玩雞蛋
        // ==================================================

        if (state.playingEgg) {

            // 已經玩夠了
            if (
                state.eggPlayCount >=
                state.eggPlayTarget
            ) {

                finishPlayingEgg();

            } else {

                // 還沒玩夠
                // 稍微停一下再繼續追

                state.mode =
                    "eggPause";


                setTimeout(() => {

                    if (
                        state.playingEgg &&
                        state.mode === "eggPause" &&
                        !state.frozen &&
                        state.mode !== "dead"
                    ) {

                        state.mode =
                            "chaseEgg";
                    }

                }, EGG_PLAY_PAUSE);
            }
        }
    }


    // ==================================================
    // 套用位置
    // ==================================================

    eggObject.style.left =
        `${eggX}px`;


    // ==================================================
    // 套用旋轉
    // ==================================================

    egg.style.transform =
        `rotate(${eggRotation}deg)`;
}

// ======================================================
// 雞蛋撞擊彈跳
// ======================================================

function playEggBump() {

    // 移除舊動畫
    eggObject.classList.remove(
        "egg-bump"
    );


    // 強制瀏覽器重新計算
    // 讓連續碰撞也能重新播放動畫
    void eggObject.offsetWidth;


    // 重新加入動畫
    eggObject.classList.add(
        "egg-bump"
    );
}

// ======================================================
// 開始玩雞蛋
// ======================================================

function startPlayingEgg() {

    // ==================================================
    // 不能開始玩的狀態
    // ==================================================

    if (
        state.mode === "dead" ||
        state.frozen ||
        state.locked ||
        state.eatingChocolate ||
        state.chasingChocolate
    ) {
        return;
    }


    // 雞蛋不存在
    if (
        eggObject === null ||
        !eggObject.isConnected
    ) {
        return;
    }


    // 已經在玩
    if (state.playingEgg) {
        return;
    }


    // ==================================================
    // 開始玩
    // ==================================================

    state.playingEgg =
        true;


    state.eggPlayCount =
        0;


    // 隨機玩 2～4 次
    state.eggPlayTarget =
        2 +
        Math.floor(
            Math.random() * 3
        );


    state.mode =
        "chaseEgg";


    console.log(
        `🥚 布丁想玩雞蛋！這次預計推 ${state.eggPlayTarget} 次`
    );
}

// ======================================================
// 更新：追雞蛋
// ======================================================

function updateEggChase(
    deltaTime
) {

    if (!state.playingEgg) {
        return;
    }


    // ==================================================
    // 雞蛋正在滾
    // 布丁先停下來看
    // ==================================================

    if (eggRolling) {
        return;
    }


    const puddingRect =
        pudding.getBoundingClientRect();


    const eggRect =
        eggObject.getBoundingClientRect();


    const puddingCenterX =
        puddingRect.left +
        puddingRect.width / 2;


    const eggCenterX =
        eggRect.left +
        eggRect.width / 2;


    const distance =
        eggCenterX -
        puddingCenterX;


    // ==================================================
    // 決定方向
    // ==================================================

    state.direction =
        distance > 0
            ? 1
            : -1;


    // ==================================================
    // 朝雞蛋移動
    // ==================================================

    state.x +=
        EGG_CHASE_SPEED *
        state.direction *
        deltaTime;


    // 防止超出布丁活動範圍
    state.x =
        Math.max(
            LEFT_BOUNDARY,
            Math.min(
                state.x,
                getRightBoundary()
            )
        );


    puddingContainer.style.left =
        `${state.x}px`;


    // ==================================================
    // 追蛋走路動畫
    // ==================================================

    const bounce =
        Math.abs(
            Math.sin(
                performance.now() / 125
            )
        ) * 6;


    const squash =
        Math.sin(
            performance.now() / 125
        ) * 0.03;


    const directionScale =
        state.direction === 1
            ? 1
            : -1;


    pudding.style.transform =
        `
        translateY(-${bounce}px)
        scaleX(${directionScale * (1 + squash)})
        scaleY(${1 - squash})
        `;
}

// ======================================================
// 雞蛋超出邊緣移動雞蛋
// ======================================================

function resetEggToCenter() {

    const gameRect =
        gameArea.getBoundingClientRect();


    const eggWidth =
        eggObject.offsetWidth;


    // ==================================================
    // 傳送到場景中央
    // ==================================================

    eggX =
        (
            gameRect.width -
            eggWidth
        ) / 2;


    // ==================================================
    // 停止雞蛋物理
    // ==================================================

    eggVelocityX =
        0;

    eggRolling =
        false;


    eggObject.style.left =
        `${eggX}px`;


    // ==================================================
    // 如果正在玩雞蛋
    // 直接結束這次玩耍
    // ==================================================

    if (state.playingEgg) {

        finishPlayingEgg();
    }


    console.log(
        "🥚 雞蛋碰到邊緣，回到中央並結束玩耍"
    );
}

// ======================================================
// 結束玩雞蛋
// ======================================================

function finishPlayingEgg() {

    console.log(
        `🍮 布丁玩完雞蛋了，共推 ${state.eggPlayCount} 次`
    );


    state.playingEgg =
        false;


    state.eggPlayCount =
        0;

    state.eggPlayTarget =
        0;


    state.mode =
        "idle";


    startIdle();
}

// ======================================================
// 取消玩雞蛋
// ======================================================

function cancelPlayingEgg() {

    if (!state.playingEgg) {
        return;
    }


    console.log(
        "🥚 玩雞蛋被中斷"
    );


    state.playingEgg =
        false;

    state.eggPlayCount =
        0;

    state.eggPlayTarget =
        0;


    /*
     * 不在這裡直接改 mode，
     * 因為呼叫它的可能是 hit / frozen / dead。
     * 讓各自的狀態流程自己接手。
     */
}

// ======================================================
// IDLE
// ======================================================

function startIdle() {

    if (
        state.locked ||
        state.mode === "dead"
    ) {
        return;
    }


    state.mode =
        "idle";


    const idleTime =
        random(
            2000,
            5000
        );


    setTimeout(() => {

        if (
            state.mode !== "idle" ||
            state.locked
        ) {
            return;
        }


        // ==================================================
        // 先判斷是否想睡覺
        // ==================================================

        const sleepChance =
            getSleepChance();


        if (
            Math.random() <
            sleepChance
        ) {

            console.log(
                `💤 布丁想睡覺，目前睡覺機率 ${Math.round(sleepChance * 100)}%`
            );


            startGoingToSleep();

            return;
        }


        // ==================================================
        // 沒想睡，再判斷是否想玩雞蛋
        // ==================================================

        if (
            Math.random() <
            EGG_PLAY_CHANCE
        ) {

            startPlayingEgg();

            return;
        }


        // ==================================================
        // 都沒有就正常散步
        // ==================================================

        startWalk();

    }, idleTime);
}


// ======================================================
// WALK
// ======================================================

function startWalk() {

    if (
        state.locked ||
        state.mode === "dead"
    ) {
        return;
    }


    state.mode =
        "walk";


    const min =
        LEFT_BOUNDARY;

    const max =
        getRightBoundary();


    state.targetX =
        random(
            min,
            max
        );


    state.direction =
        state.targetX >= state.x
            ? 1
            : -1;
}


// ======================================================
// 傷害
//
// 注意：
//
// 這個函式只負責 HP。
// 不會因為受傷動畫正在播放而阻止扣血。
// ======================================================

function damagePudding(
    damage
) {

    // 已死亡不能繼續受傷
    if (state.mode === "dead") {
        return;
    }


    // ==================================================
    // 扣血
    // ==================================================

    state.hp -= damage;


    if (state.hp < 0) {
        state.hp = 0;
    }


    updateHpBar();

    showHpBar();


    console.log(
        `💥 布丁受到 ${damage} 傷害！HP: ${state.hp}/${state.maxHp}`
    );


    // ==================================================
    // 死亡
    // ==================================================

    if (state.hp === 0) {

        startDead();

        return;
    }


    // ==================================================
    // 冰凍中
    //
    // 只扣血，不播放普通受傷動畫。
    // 保留：
    // pudding-frozen.png
    // state.mode = "frozen"
    // freezeTimer
    // ==================================================

    if (
        state.frozen ||
        state.mode === "frozen"
    ) {

        console.log(
            "❄️ 布丁冰凍中受到傷害，維持冰凍狀態"
        );

        scheduleHideHpBar();

        return;
    }


    // ==================================================
    // 非冰凍狀態才播放普通受傷動畫
    // ==================================================

    playHitAnimation();


    scheduleHideHpBar();
}


// ======================================================
// 受傷動畫
//
// 只處理動畫。
// 不負責扣 HP。
// ======================================================

function playHitAnimation() {

    if (
        state.mode === "dead" ||
        state.mode === "frozen" ||
        state.frozen
    ) {
        return;
    }


    if (state.hitAnimating) {
        return;
    }


    state.hitAnimating =
        true;

    cancelPlayingEgg();

    state.locked =
        true;

    state.mode =
        "hit";


    // 受傷時永遠用原本這張
    pudding.src =
        "/images/game/pudding-hit.png";


    setTimeout(() => {

        if (
            state.mode === "dead"
        ) {

            state.hitAnimating =
                false;

            return;
        }


        state.hitAnimating =
            false;

        state.locked =
            false;


        // ★ 不要寫死 pudding.png
        // 由目前角色狀態決定恢復哪張
        updatePuddingAppearance();


        resumePuddingAction();

    }, 800);
}


// ======================================================
// DEAD
// ======================================================

function startDead() {

    // 防止重複執行死亡
    if (
        state.mode === "dead"
    ) {
        return;
    }


    state.mode =
        "dead";

    state.locked =
        true;

    state.hitAnimating =
        false;

    cancelPlayingEgg();

    if (
        hpHideTimer !== null
    ) {

        clearTimeout(
            hpHideTimer
        );

        hpHideTimer =
            null;
    }

    if (freezeTimer !== null) {

        clearTimeout(
            freezeTimer
        );

        freezeTimer =
            null;
    }


    state.frozen =
        false;

    // ==================================================
    // 死亡解除巧克力狀態
    // ==================================================

    state.chocolate =
        false;

    state.eatingChocolate =
        false;

    state.chasingChocolate =
        false;

    pudding.classList.remove(
        "chocolate"
    );

    pudding.classList.remove(
        "chocolate-transform"
    );

    showHpBar();


    pudding.src =
        "/images/game/pudding-dead.png";


    console.log(
        "💀 布丁死亡！"
    );


    // 3 秒後復活
    setTimeout(() => {

        startRespawn();

    }, 3000);
}


// ======================================================
// RESPAWN
// ======================================================

function startRespawn() {

    console.log(
        "🍮 布丁準備復活..."
    );


    // ==================================================
    // 原地淡出
    // ==================================================

    pudding.style.opacity =
        "0";

    hpContainer.style.opacity =
        "0";


    setTimeout(() => {

        // ==================================================
        // 完全消失後才瞬移回盤子
        // ==================================================

        state.x =
            RESPAWN_X;


        puddingContainer.style.left =
            `${RESPAWN_X}px`;


        // ==================================================
        // 重置基本狀態
        // ==================================================

        state.hp =
            state.maxHp;

        state.direction =
            1;

        state.hitAnimating =
            false;

        state.frozen =
            false;

        state.eatingChocolate =
            false;

        state.chasingChocolate =
            false;

        state.locked =
            false;


        // ==================================================
        // 移除巧克力狀態
        // ==================================================

        state.chocolate =
            false;


        pudding.classList.remove(
            "chocolate"
        );

        pudding.classList.remove(
            "chocolate-transform"
        );


        // ==================================================
        // ★ 很重要
        // 先離開死亡狀態
        // ==================================================

        state.mode =
            "idle";


        // ==================================================
        // 更新 HP
        // ==================================================

        updateHpBar();


        // ==================================================
        // ★ mode 已經不是 dead
        // 現在才更新圖片
        // ==================================================

        updatePuddingAppearance();


        // ==================================================
        // 顯示
        // ==================================================

        pudding.style.opacity =
            "1";


        hpContainer.style.opacity =
            "";


        hideHpBar();


        console.log(
            `✨ 布丁復活！HP: ${state.hp}/${state.maxHp}`
        );


        // ==================================================
        // 如果桌上還有巧克力就繼續追
        // 否則正常 idle
        // ==================================================

        resumePuddingAction();

    }, 500);
}


// ======================================================
// 番茄污漬
// ======================================================

function createTomatoSplat(
    x,
    groundY
) {

    const splat =
        document.createElement(
            "img"
        );


    splat.src =
        "/images/game/items/tomato-splat.png";


    splat.classList.add(
        "tomato-splat"
    );


    // ==================================================
    // 使用番茄真正落點
    // ==================================================

    splat.style.left =
        `${x}px`;


    splat.style.top =
        `${groundY + 8}px`;


    effectLayer.appendChild(
        splat
    );


    // ==================================================
    // 3 秒後淡出
    // ==================================================

    setTimeout(() => {

        splat.classList.add(
            "fade-out"
        );


        setTimeout(() => {

            splat.remove();

        }, 500);

    }, 3000);
}


// ======================================================
// 番茄碰撞判定
// ======================================================

function isTomatoHitPudding(
    tomato
) {

    /*
     * 死亡中的布丁沒有碰撞。
     *
     * 番茄會直接穿過去，
     * 最後砸到桌面。
     */

    if (
        state.mode === "dead"
    ) {
        return false;
    }


    const tomatoRect =
        tomato.getBoundingClientRect();


    const puddingRect =
        pudding.getBoundingClientRect();


    // ==================================================
    // 布丁碰撞框
    // ==================================================

    const puddingPaddingX =
        puddingRect.width *
        0.18;


    const puddingPaddingTop =
        puddingRect.height *
        0.12;


    const puddingPaddingBottom =
        puddingRect.height *
        0.08;


    const puddingLeft =
        puddingRect.left +
        puddingPaddingX;


    const puddingRight =
        puddingRect.right -
        puddingPaddingX;


    const puddingTop =
        puddingRect.top +
        puddingPaddingTop;


    const puddingBottom =
        puddingRect.bottom -
        puddingPaddingBottom;


    // ==================================================
    // 番茄碰撞框
    // ==================================================

    const tomatoPadding =
        tomatoRect.width *
        0.15;


    const tomatoLeft =
        tomatoRect.left +
        tomatoPadding;


    const tomatoRight =
        tomatoRect.right -
        tomatoPadding;


    const tomatoTop =
        tomatoRect.top +
        tomatoPadding;


    const tomatoBottom =
        tomatoRect.bottom -
        tomatoPadding;


    // ==================================================
    // AABB Collision
    // ==================================================

    return (

        tomatoRight >=
            puddingLeft &&

        tomatoLeft <=
            puddingRight &&

        tomatoBottom >=
            puddingTop &&

        tomatoTop <=
            puddingBottom

    );
}


// ======================================================
// 丟一顆番茄
//
// 注意：
//
// 即使布丁在投擲途中死亡，也要完成本批次剩餘的投擲。
//
// 如果抽到 ×64，布丁在第 20 顆死亡，
// 剩下 44 顆仍然必須真的丟出來。
// ======================================================

function throwTomato() {

    // ==================================================
    // 建立番茄
    // ==================================================

    const tomato =
        document.createElement(
            "img"
        );


    tomato.src =
        "/images/game/items/tomato.png";


    tomato.classList.add(
        "tomato-projectile"
    );


    projectileLayer.appendChild(
        tomato
    );


    // ==================================================
    // 起點
    // ==================================================

    const startX =
        window.innerWidth +
        TOMATO_START_X_OFFSET;


    const startY =
        TOMATO_START_Y;


    // ==================================================
    // 隨機落點
    // ==================================================

    const minX =
        TOMATO_THROW_MIN_X;


    const maxX =
        window.innerWidth -
        TOMATO_THROW_RIGHT_PADDING;


    const targetX =
        random(
            minX,
            maxX
        );


    // ==================================================
    // 桌面高度
    // ==================================================

    const groundY =
        getTableSurfaceY();


    // 番茄約 75px
    const tomatoRadius =
        37;


    const calculatedTargetY =
        groundY -
        tomatoRadius;


    /*
     * 防止 CSS 改動後
     * targetY 意外跑到起點上方。
     */

    const targetY =
        Math.max(
            calculatedTargetY,
            startY + 100
        );


    // ==================================================
    // 動畫
    // ==================================================

    const startTime =
        performance.now();


    function animateTomato(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed /
            TOMATO_FLIGHT_TIME;


        if (
            progress > 1
        ) {

            progress =
                1;
        }


        // ==================================================
        // X
        // ==================================================

        const x =
            startX +
            (
                targetX -
                startX
            ) *
            progress;


        // ==================================================
        // Y
        //
        // progress² 模擬重力
        // ==================================================

        const gravityProgress =
            progress *
            progress;


        const y =
            startY +
            (
                targetY -
                startY
            ) *
            gravityProgress;


        // ==================================================
        // 更新位置
        // ==================================================

        tomato.style.left =
            `${x}px`;


        tomato.style.top =
            `${y}px`;


        // ==================================================
        // 碰撞布丁
        // ==================================================

        if (
            isTomatoHitPudding(
                tomato
            )
        ) {

            console.log(
                "🍅 番茄命中布丁！"
            );


            tomato.remove();


            damagePudding(
                TOMATO_DAMAGE
            );


            return;
        }


        // ==================================================
        // 砸到桌面
        // ==================================================

        if (
            progress >= 1
        ) {

            tomato.remove();


            console.log(
                "🍅 番茄砸到桌面！"
            );


            createTomatoSplat(
                targetX,
                groundY
            );


            return;
        }


        requestAnimationFrame(
            animateTomato
        );
    }


    requestAnimationFrame(
        animateTomato
    );
}


// ======================================================
// 抽番茄數量
//
// 只抽一次。
// 顯示、速度、實際生成全部共用同一個 count。
// ======================================================

function getRandomTomatoCount() {

    const totalWeight =
        TOMATO_COUNT_OPTIONS.reduce(

            (
                sum,
                option
            ) =>
                sum +
                option.weight,

            0
        );


    let value =
        Math.random() *
        totalWeight;


    for (
        const option
        of TOMATO_COUNT_OPTIONS
    ) {

        value -=
            option.weight;


        if (
            value <= 0
        ) {

            return option.count;
        }
    }


    return 1;
}


// ======================================================
// 根據番茄數量決定投擲間隔
// ======================================================

function getTomatoDelayRange(
    count
) {

    switch (
        count
    ) {

        // ×4
        case 4:

            return {
                min: 350,
                max: 500
            };


        // ×8
        case 8:

            return {
                min: 220,
                max: 320
            };


        // ×16
        case 16:

            return {
                min: 130,
                max: 200
            };


        // ×32
        case 32:

            return {
                min: 70,
                max: 120
            };


        // ×64
        case 64:

            return {
                min: 35,
                max: 60
            };


        // ×128
        case 128:

            return {
                min: 15,
                max: 30
            };

        default:

            return {
                min: 150,
                max: 250
            };
    }
}


// ======================================================
// 顯示番茄兌換訊息
// ======================================================

// ======================================================
// 顯示投擲兌換訊息
// ======================================================

// ======================================================
// 顯示投擲兌換訊息
// ======================================================

function showThrowMessage(
    userName,
    itemName,
    count,
    level = "normal"
) {

    // ==================================================
    // 建立單一訊息
    // ==================================================

    const messageItem =
        document.createElement(
            "div"
        );


    messageItem.classList.add(
        "redeem-message-item"
    );


    // ==================================================
    // 玩家名稱 + 文字
    // ==================================================

    const text =
        document.createElement(
            "span"
        );


    text.classList.add(
        "redeem-message-text"
    );


    text.textContent =
        `${userName} 觸發了投擲${itemName} `;


    // ==================================================
    // 數量
    // ==================================================

    const countText =
        document.createElement(
            "span"
        );


    countText.classList.add(
        "redeem-count"
    );


    countText.textContent =
        `×${count}`;


    // ==================================================
    // 數量等級
    // ==================================================

    if (
        level === "legendary"
    ) {

        countText.classList.add(
            "legendary"
        );

    } else if (
        level === "large"
    ) {

        countText.classList.add(
            "large"
        );

    } else if (
        level === "medium"
    ) {

        countText.classList.add(
            "medium"
        );
    }


    // ==================================================
    // 組合
    // ==================================================

    messageItem.appendChild(
        text
    );


    messageItem.appendChild(
        countText
    );


    // ==================================================
    // 新訊息放最上面
    // ==================================================

    redeemMessage.prepend(
        messageItem
    );


    // ==================================================
    // 最多只允許 4 則
    // ==================================================

    const messages =
        redeemMessage.querySelectorAll(
            ".redeem-message-item"
        );


    if (
        messages.length >
        MAX_REDEEM_MESSAGES
    ) {

        // 最後一個就是最舊的
        const oldestMessage =
            messages[
                messages.length - 1
            ];


        // 超過 4 則直接移除
        oldestMessage.remove();
    }


    // ==================================================
    // 決定停留時間
    // ==================================================

    let displayTime =
        REDEEM_MESSAGE_LIFETIME;


    if (
        level === "large"
    ) {

        displayTime =
            5000;

    } else if (
        level === "legendary"
    ) {

        displayTime =
            6000;
    }


    // ==================================================
    // 自動淡出並刪除
    // ==================================================

    scheduleRedeemMessageRemoval(
        messageItem,
        displayTime
    );
}


// ======================================================
// 一次番茄兌換
//
// 每批次只抽取一次數量，確保顯示、射速與迴圈次數一致。
//
// 例如抽到 32：
//
// count = 32
//
// ↓
//
// 顯示 ×32
// 使用 ×32 射速
// for 執行 32 次
//
// ======================================================

function throwTomatoBatch(
    userName = "測試玩家"
) {

    // ==================================================
    // 只抽一次番茄數量
    // ==================================================

    const count =
        getRandomTomatoCount();


    // ==================================================
    // 決定訊息強調程度
    // ==================================================

    let level =
        "normal";


    if (count >= 64) {

        level =
            "legendary";

    } else if (count >= 32) {

        level =
            "large";

    } else if (count >= 8) {

        level =
            "medium";
    }


    // ==================================================
    // 顯示提示
    // ==================================================

    showThrowMessage(
        userName,
        "番茄",
        count,
        level
    );


    // ==================================================
    // 根據數量決定投擲速度
    // ==================================================

    const delayRange =
        getTomatoDelayRange(
            count
        );


    console.log(
        `🍅 ${userName} 觸發投擲番茄 ×${count}`
    );


    // ==================================================
    // 實際投擲
    // ==================================================

    let delay =
        0;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        setTimeout(() => {

            throwTomato();

        }, delay);


        if (i < count - 1) {

            delay +=
                random(
                    delayRange.min,
                    delayRange.max
                );
        }
    }
}

// ======================================================
// 丟出冰塊
// ======================================================

function throwIce() {

    // 布丁死亡時先不允許投擲
    if (state.mode === "dead") {
        return;
    }


    // ==================================================
    // 建立冰塊
    // ==================================================

    const ice =
        document.createElement("img");


    ice.src =
        "/images/game/items/ice.png";


    ice.classList.add(
        "ice-projectile"
    );


    projectileLayer.appendChild(
        ice
    );


    // ==================================================
    // 冰塊起點
    // ==================================================

    const startX =
        window.innerWidth +
        ICE_START_X_OFFSET;


    const startY =
        ICE_START_Y;


    // ==================================================
    // 鎖定布丁「現在」的位置
    //
    // 注意：
    // 只在投擲瞬間取得一次
    // 後面不會持續追蹤
    // ==================================================

    const puddingRect =
        pudding.getBoundingClientRect();


    const targetX =
        puddingRect.left +
        puddingRect.width / 2;


    const targetY =
        puddingRect.top +
        puddingRect.height / 2;


    console.log(
        `🧊 冰塊鎖定位置：X=${Math.round(targetX)}, Y=${Math.round(targetY)}`
    );


    // ==================================================
    // 開始時間
    // ==================================================

    const startTime =
        performance.now();


    // ==================================================
    // 冰塊動畫
    // ==================================================

    function animateIce(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed /
            ICE_FLIGHT_TIME;


        if (progress > 1) {
            progress = 1;
        }


        // ==================================================
        // X 軸
        // ==================================================

        const x =
            startX +
            (
                targetX -
                startX
            ) *
            progress;


        // ==================================================
        // Y 軸
        //
        // 稍微做出往下砸的感覺
        // ==================================================

        const gravityProgress =
            progress *
            progress;


        const y =
            startY +
            (
                targetY -
                startY
            ) *
            gravityProgress;


        // ==================================================
        // 更新位置
        // ==================================================

        ice.style.left =
            `${x}px`;


        ice.style.top =
            `${y}px`;

        // ==================================================
        // 碰撞布丁
        // ==================================================

        if (
            isIceHitPudding(ice)
        ) {

            console.log(
                "🧊 冰塊命中布丁！"
            );


            ice.classList.add(
                "hit"
            );


            // ==================================================
            // -5 HP + 冰凍
            // ==================================================

            damagePuddingByIce();


            setTimeout(() => {

                ice.remove();

            }, 120);


            return;
        }

        // ==================================================
        // 抵達原本鎖定的位置
        // ==================================================

        if (progress >= 1) {

            ice.remove();

            console.log(
                "🧊 冰塊抵達鎖定位置"
            );

            return;
        }


        requestAnimationFrame(
            animateIce
        );
    }


    requestAnimationFrame(
        animateIce
    );
}

// ======================================================
// 冰塊碰撞判定
// ======================================================

function isIceHitPudding(ice) {

    // 死亡中的布丁不接受碰撞
    if (state.mode === "dead") {
        return false;
    }


    const iceRect =
        ice.getBoundingClientRect();

    const puddingRect =
        pudding.getBoundingClientRect();


    // ==================================================
    // 縮小布丁碰撞框
    // 避免只是擦到圖片透明邊緣也算命中
    // ==================================================

    const puddingPaddingX =
        puddingRect.width * 0.18;

    const puddingPaddingTop =
        puddingRect.height * 0.12;

    const puddingPaddingBottom =
        puddingRect.height * 0.08;


    const puddingLeft =
        puddingRect.left +
        puddingPaddingX;

    const puddingRight =
        puddingRect.right -
        puddingPaddingX;

    const puddingTop =
        puddingRect.top +
        puddingPaddingTop;

    const puddingBottom =
        puddingRect.bottom -
        puddingPaddingBottom;


    // ==================================================
    // 冰塊碰撞框
    // ==================================================

    const icePadding =
        iceRect.width * 0.12;


    const iceLeft =
        iceRect.left +
        icePadding;

    const iceRight =
        iceRect.right -
        icePadding;

    const iceTop =
        iceRect.top +
        icePadding;

    const iceBottom =
        iceRect.bottom -
        icePadding;


    // ==================================================
    // AABB 碰撞
    // ==================================================

    return (
        iceRight >= puddingLeft &&
        iceLeft <= puddingRight &&
        iceBottom >= puddingTop &&
        iceTop <= puddingBottom
    );
}

// ======================================================
// 冰塊傷害
// ======================================================

function damagePuddingByIce() {

    if (state.mode === "dead") {
        return;
    }


    state.hp -=
        ICE_DAMAGE;


    if (state.hp < 0) {

        state.hp = 0;
    }


    updateHpBar();

    showHpBar();


    console.log(
        `🧊 布丁受到冰塊 ${ICE_DAMAGE} 傷害！HP: ${state.hp}/${state.maxHp}`
    );


    // ==================================================
    // 死亡
    // ==================================================

    if (state.hp === 0) {

        startDead();

        return;
    }


    // ==================================================
    // 冰凍
    // ==================================================

    freezePudding();


    scheduleHideHpBar();
}

// ======================================================
// 冰凍布丁
// ======================================================

function freezePudding() {

    // 死亡不處理
    if (state.mode === "dead") {
        return;
    }


    console.log(
        "❄️ 布丁被冰凍！"
    );


    // ==================================================
    // 如果正在播放普通受傷動畫
    // 直接取消其狀態
    // ==================================================

    state.hitAnimating =
        false;


    cancelPlayingEgg();

    // ==================================================
    // 鎖定角色
    // ==================================================

    state.frozen =
        true;

    state.locked =
        true;

    state.mode =
        "frozen";


    // ==================================================
    // 切換冰凍圖片
    // ==================================================

    pudding.src =
        "/images/game/pudding-frozen.png";


    // ==================================================
    // 如果之前已經有冰凍 Timer
    // 重新計算 2 秒
    // ==================================================

    if (freezeTimer !== null) {

        clearTimeout(
            freezeTimer
        );
    }


    freezeTimer =
        setTimeout(() => {

            unfreezePudding();

        }, ICE_FREEZE_TIME);
}

// ======================================================
// 解凍
// ======================================================

function unfreezePudding() {

    if (state.mode === "dead") {

        freezeTimer =
            null;

        return;
    }


    console.log(
        "💧 布丁解凍！"
    );


    state.frozen =
        false;

    state.locked =
        false;


    updatePuddingAppearance();


    freezeTimer =
        null;


    // ==================================================
    // 解凍後恢復原本目標
    // ==================================================

    resumePuddingAction();
}

// ======================================================
// 清理巧克力
// ======================================================

function clearChocolate() {

    if (activeChocolateProjectile !== null) {

        activeChocolateProjectile.remove();

        activeChocolateProjectile =
            null;
    }


    if (activeChocolate !== null) {

        activeChocolate.remove();

        activeChocolate =
            null;
    }


    // 清除舊追逐狀態
    state.chasingChocolate =
        false;


    if (
        state.mode === "chaseChocolate"
    ) {

        state.mode =
            "idle";
    }
}

// ======================================================
// 投擲巧克力
// ======================================================

function throwChocolate() {

    // 死亡時先不產生新的巧克力
    if (state.mode === "dead") {
        return;
    }


    // ==================================================
    // 場上最多一塊巧克力
    // ==================================================

    clearChocolate();


    // ==================================================
    // 建立飛行中的巧克力
    // ==================================================

    const chocolate =
        document.createElement("img");


    chocolate.src =
        "/images/game/items/chocolate.png";


    chocolate.classList.add(
        "chocolate-projectile"
    );


    projectileLayer.appendChild(
        chocolate
    );


    // ==================================================
    // 起點
    //
    // 從畫面右上方「外面」飛進來
    // ==================================================

    const startX =
        window.innerWidth + 50;


    const startY =
        150;


    // ==================================================
    // 隨機落點 X
    // ==================================================

    const targetX =
        random(
            250,
            window.innerWidth - 200
        );


    // ==================================================
    // 桌面高度
    // ==================================================

    const groundY =
        getTableSurfaceY();


    /*
     * 巧克力中心要停在桌面上方半個高度，
     * 這樣底部才會碰到桌面。
     */
    const calculatedTargetY =
        groundY -
        CHOCOLATE_RADIUS;


    const targetY =
        Math.max(
            calculatedTargetY,
            startY + 100
        );


    // ==================================================
    // 動畫開始時間
    // ==================================================

    const startTime =
        performance.now();


    // ==================================================
    // 飛行
    // ==================================================

    function animateChocolate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed /
            CHOCOLATE_FLIGHT_TIME;


        if (progress > 1) {

            progress = 1;
        }


        // ==================================================
        // X 軸
        // ==================================================

        const x =
            startX +
            (
                targetX -
                startX
            ) *
            progress;


        // ==================================================
        // 基本 Y 軸
        // ==================================================

        const linearY =
            startY +
            (
                targetY -
                startY
            ) *
            progress;


        // ==================================================
        // 拋物線高度
        //
        // 0 → 最高點 → 0
        // ==================================================

        const arc =
            Math.sin(
                progress *
                Math.PI
            ) * 120;


        const y =
            linearY -
            arc;


        // ==================================================
        // 更新位置
        // ==================================================

        chocolate.style.left =
            `${x}px`;


        chocolate.style.top =
            `${y}px`;


        // ==================================================
        // 落地
        // ==================================================

        if (progress >= 1) {

            chocolate.remove();

            activeChocolateProjectile =
                null;


            spawnGroundChocolate(
                targetX,
                targetY
            );


            return;
        }


        requestAnimationFrame(
            animateChocolate
        );
    }


    requestAnimationFrame(
        animateChocolate
    );
}

// ======================================================
// 巧克力落地
// ======================================================

function spawnGroundChocolate(
    x,
    y
) {

    // 如果桌上有舊巧克力，先清掉
    if (activeChocolate !== null) {

        activeChocolate.remove();

        activeChocolate = null;
    }


    const chocolate =
        document.createElement("img");


    chocolate.src =
        "/images/game/items/chocolate.png";


    chocolate.classList.add(
        "chocolate-ground",
        "land"
    );


    // 第一次落點
    chocolate.style.left =
        `${x}px`;

    chocolate.style.top =
        `${y}px`;


    projectileLayer.appendChild(
        chocolate
    );


    activeChocolate =
        chocolate;


    console.log(
        `🍫 巧克力第一次落地 X=${Math.round(x)}`
    );


    // ==================================================
    // 大跳動畫結束
    // ==================================================

    chocolate.addEventListener(
        "animationend",
        () => {

            let finalX =
                x -
                CHOCOLATE_BOUNCE_DISTANCE;

            finalX =
                Math.max(
                    120,
                    finalX
                );


            chocolate.style.left =
                `${finalX}px`;


            chocolate.classList.remove(
                "land"
            );


            console.log(
                `🍫 巧克力大跳完成，最終 X=${Math.round(finalX)}`
            );


            // ★ 少的就是這一行
            startChasingChocolate();

        },
        {
            once: true
        }
    );
}

// ======================================================
// 恢復角色目前應該做的事情
// ======================================================

function resumePuddingAction() {

    // ==================================================
    // 還有巧克力存在
    // → 優先繼續追巧克力
    // ==================================================

    if (
        activeChocolate !== null &&
        activeChocolate.isConnected
    ) {

        console.log(
            "🍫 巧克力還在，布丁繼續追！"
        );

        state.chasingChocolate =
            true;

        state.mode =
            "chaseChocolate";

        return;
    }


    // ==================================================
    // 沒有巧克力
    // → 回到正常待機
    // ==================================================

    state.chasingChocolate =
        false;

    state.mode =
        "idle";

    startIdle();
}

// ======================================================
// 開始追巧克力
// ======================================================

function startChasingChocolate() {

    if (
        activeChocolate === null ||
        !activeChocolate.isConnected
    ) {
        return;
    }


    if (
        state.mode === "dead"
    ) {
        return;
    }


    state.chasingChocolate =
        true;


    // 冰凍中先記住「我要追」
    // 但不要把 frozen mode 蓋掉
    if (state.frozen) {

        console.log(
            "🍮 布丁想吃巧克力，但現在被凍住了"
        );

        return;
    }


    state.mode =
        "chaseChocolate";


    console.log(
        "🍮 布丁發現巧克力，開始衝過去！"
    );
}

// ======================================================
// 更新：追巧克力
// ======================================================

function updateChocolateChase(
    deltaTime
) {

    // ==================================================
    // 沒有巧克力
    // ==================================================

    if (
        activeChocolate === null ||
        !activeChocolate.isConnected
    ) {

        state.chasingChocolate =
            false;

        state.mode =
            "idle";

        startIdle();

        return;
    }


    // ==================================================
    // 死亡
    // ==================================================

    if (state.mode === "dead") {
        return;
    }


    // ==================================================
    // 冰凍期間不能移動
    // ==================================================

    if (state.frozen) {
        return;
    }


    // ==================================================
    // 取得巧克力中心 X
    // ==================================================

    const chocolateRect =
        activeChocolate.getBoundingClientRect();


    const chocolateX =
        chocolateRect.left +
        chocolateRect.width / 2;


    // ==================================================
    // 取得布丁中心 X
    // ==================================================

    const puddingRect =
        pudding.getBoundingClientRect();


    const puddingX =
        puddingRect.left +
        puddingRect.width / 2;


    // ==================================================
    // 計算距離
    // ==================================================

    const distance =
        chocolateX -
        puddingX;


    // ==================================================
    // 抵達巧克力
    // ==================================================

    if (
        Math.abs(distance) <= 70
    ) {

        eatChocolate();

        return;
    }


    // ==================================================
    // 決定方向
    // ==================================================

    if (distance > 0) {

        state.direction =
            1;

    } else {

        state.direction =
            -1;
    }


    // ==================================================
    // 往巧克力移動
    // ==================================================

    state.x +=
        CHOCOLATE_CHASE_SPEED *
        state.direction *
        deltaTime;


    // ==================================================
    // 防止超出場景
    // ==================================================

    state.x =
        Math.max(
            LEFT_BOUNDARY,
            Math.min(
                state.x,
                getRightBoundary()
            )
        );


    // ==================================================
    // 更新角色真正的位置
    //
    // 注意：
    // 是 puddingContainer
    // 不是 puddingWrapper
    // ==================================================

    puddingContainer.style.left =
        `${state.x}px`;


    // ==================================================
    // 追逐時仍保留走路彈跳
    // ==================================================

    const bounce =
        Math.abs(
            Math.sin(
                performance.now() / 110
            )
        ) * 7;


    const squash =
        Math.sin(
            performance.now() / 110
        ) * 0.035;


    const directionScale =
        state.direction === 1
            ? 1
            : -1;


    pudding.style.transform =
        `
        translateY(-${bounce}px)
        scaleX(${directionScale * (1 + squash)})
        scaleY(${1 - squash})
        `;
}

// ======================================================
// 吃巧克力
// ======================================================

function eatChocolate() {

    // ==================================================
    // 防止重複進入吃東西動畫
    // ==================================================

    if (state.eatingChocolate) {
        return;
    }


    // ==================================================
    // 巧克力不存在
    // ==================================================

    if (
        activeChocolate === null ||
        !activeChocolate.isConnected
    ) {
        return;
    }


    console.log(
        "😮 布丁準備吃巧克力！"
    );


    // ==================================================
    // 進入進食狀態
    // ==================================================

    state.eatingChocolate =
        true;

    state.chasingChocolate =
        false;

    state.mode =
        "eatingChocolate";

    state.locked =
        true;


    // ==================================================
    // 張嘴
    // ==================================================

    pudding.src =
        "/images/game/pudding-eat.png";


    // ==================================================
    // 250ms 後真正吃掉巧克力
    // ==================================================

    setTimeout(() => {

        /*
         * 這段時間內巧克力有可能被其他事件清除，
         * 所以再確認一次。
         */

        if (
            activeChocolate !== null &&
            activeChocolate.isConnected
        ) {

            activeChocolate.remove();

            activeChocolate =
                null;
        }


        console.log(
            "🍫 巧克力被吃掉了！"
        );


        // ==================================================
        // 再維持張嘴 120ms
        // ==================================================

        setTimeout(() => {

            // ==================================================
            // 回復 HP
            // ==================================================

            state.hp =
                Math.min(
                    100,
                    state.hp +
                    CHOCOLATE_HEAL
                );


            console.log(
                `❤️ 巧克力回血 +${CHOCOLATE_HEAL}，目前 HP=${state.hp}`
            );


            updateHpBar();

            showHpBar();

            scheduleHideHpBar();

            // ==================================================
            // 張嘴階段結束
            // ==================================================

            state.eatingChocolate =
                false;

            // ==================================================
            // 進入巧克力狀態
            // ==================================================

            state.chocolate =
                true;


            // ==================================================
            // 先切換成巧克力布丁
            // ==================================================

            updatePuddingAppearance();


            // ==================================================
            // 啟動變身動畫
            // ==================================================

            pudding.classList.add(
                "chocolate-transform"
            );


            // ==================================================
            // 產生巧克力粒子
            // ==================================================

            createChocolateParticles();


            console.log(
                "✨ 巧克力變身開始！"
            );


            // ==================================================
            // 等待變身動畫完成
            // ==================================================

            setTimeout(() => {

                pudding.classList.remove(
                    "chocolate-transform"
                );


                // ==================================================
                // 結束進食狀態
                // ==================================================


                state.locked =
                    false;


                // ==================================================
                // 恢復原本行動
                // ==================================================

                resumePuddingAction();


                console.log(
                    "🍫🍮 巧克力布丁變身完成！"
                );

            }, 550);

        }, 120);

    }, 250);
}

// ======================================================
// 巧克力變身粒子
// ======================================================

function createChocolateParticles() {

    const rect =
        pudding.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    // 產生 10 個粒子
    const particleCount =
        10;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.classList.add(
            "chocolate-particle"
        );


        // 一半使用金色
        if (i % 2 === 0) {

            particle.classList.add(
                "gold"
            );
        }


        // ==================================================
        // 從布丁中心附近產生
        // ==================================================

        particle.style.left =
            `${centerX}px`;

        particle.style.top =
            `${centerY}px`;


        // ==================================================
        // 隨機散射方向
        // ==================================================

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            70 +
            Math.random() *
            70;


        const moveX =
            Math.cos(angle) *
            distance;


        const moveY =
            Math.sin(angle) *
            distance;


        particle.style.setProperty(
            "--particle-x",
            `${moveX}px`
        );


        particle.style.setProperty(
            "--particle-y",
            `${moveY}px`
        );


        document.body.appendChild(
            particle
        );


        // ==================================================
        // 動畫結束自動刪除
        // ==================================================

        particle.addEventListener(
            "animationend",
            () => {

                particle.remove();

            },
            {
                once: true
            }
        );
    }
}

// ======================================================
// UPDATE
// ======================================================

function update(
    deltaTime
) {

    if (
        state.mode === "goingToSleep"
    ) {

        updateGoingToSleep(
            deltaTime
        );

        return;
    }


    if (
        state.mode === "jumpingToPlatform"
    ) {

        updateJumpToPlatform();

        return;
    }


    if (
        state.mode === "platformReady"
    ) {
        return;
    }


    if (
        state.mode === "onPlatform"
    ) {
        return;
    }


    if (
        state.mode === "sleeping"
    ) {
        return;
    }


    if (
        state.mode === "jumpingFromPlatform"
    ) {

        updateJumpFromPlatform();

        return;
    }


    // ==================================================
    // PLATFORM READY
    // ==================================================

    if (
        state.mode === "platformReady"
    ) {

        return;
    }

    // ==================================================
    // 雞蛋物理
    // ==================================================

    updateEgg(
        deltaTime
    );


    // ==================================================
    // 雞蛋碰撞
    //
    // checkPuddingEggCollision() 內部已經會判斷
    // playingEgg，所以平常散步不會推蛋。
    // ==================================================

    checkPuddingEggCollision();


    // ==================================================
    // CHASE EGG
    // ==================================================

    if (
        state.mode === "chaseEgg"
    ) {

        updateEggChase(
            deltaTime
        );

        return;
    }


    // ==================================================
    // EGG PAUSE
    // ==================================================

    if (
        state.mode === "eggPause"
    ) {
        return;
    }


    // ==================================================
    // EATING CHOCOLATE
    // ==================================================

    if (
        state.mode === "eatingChocolate"
    ) {
        return;
    }


    // ==================================================
    // CHASE CHOCOLATE
    // ==================================================

    if (
        state.mode === "chaseChocolate"
    ) {

        updateChocolateChase(
            deltaTime
        );

        return;
    }

    // ==================================================
    // WALK POSITION
    // ==================================================

    if (
        state.mode === "walk"
    ) {

        state.x +=
            state.speed *
            state.direction *
            deltaTime;


        // ==================================================
        // 左邊界
        // ==================================================

        if (
            state.x <
            LEFT_BOUNDARY
        ) {

            state.x =
                LEFT_BOUNDARY;
        }


        // ==================================================
        // 右邊界
        // ==================================================

        const rightBoundary =
            getRightBoundary();


        if (
            state.x >
            rightBoundary
        ) {

            state.x =
                rightBoundary;
        }


        // ==================================================
        // 是否抵達目的地
        // ==================================================

        const distance =
            Math.abs(
                state.targetX -
                state.x
            );


        if (
            distance < 5
        ) {

            state.x =
                state.targetX;


            startIdle();
        }
    }


    // ==================================================
    // 更新布丁 X
    // ==================================================

    puddingContainer.style.left =
        `${state.x}px`;


    // ==================================================
    // DEAD
    // ==================================================

    if (
        state.mode === "dead"
    ) {

        const directionScale =
            state.direction === 1
                ? 1
                : -1;


        pudding.style.transform =
            `
            scaleX(${directionScale})
            `;


        return;
    }


    // ==================================================
    // FROZEN
    // ==================================================

    if (
        state.mode === "frozen"
    ) {

        const directionScale =
            state.direction === 1
                ? 1
                : -1;


        pudding.style.transform =
            `
            scaleX(${directionScale})
            `;


        return;
    }


    // ==================================================
    // HIT
    // ==================================================

    if (
        state.mode === "hit"
    ) {

        const time =
            performance.now();


        const shake =
            Math.sin(
                time / 25
            ) * 6;


        const directionScale =
            state.direction === 1
                ? 1
                : -1;


        pudding.style.transform =
            `
            translateX(${shake}px)
            scaleX(${directionScale})
            `;


        return;
    }


    // ==================================================
    // WALK ANIMATION
    // ==================================================

    if (
        state.mode === "walk"
    ) {

        const bounce =
            Math.abs(
                Math.sin(
                    performance.now() /
                    140
                )
            ) * 5;


        const squash =
            Math.sin(
                performance.now() /
                140
            ) * 0.03;


        const directionScale =
            state.direction === 1
                ? 1
                : -1;


        pudding.style.transform =
            `
            translateY(-${bounce}px)
            scaleX(${directionScale * (1 + squash)})
            scaleY(${1 - squash})
            `;
    }


    // ==================================================
    // IDLE ANIMATION
    // ==================================================

    else if (
        state.mode === "idle"
    ) {

        const breathe =
            Math.sin(
                performance.now() /
                500
            ) * 0.015;


        const directionScale =
            state.direction === 1
                ? 1
                : -1;


        pudding.style.transform =
            `
            scaleX(${directionScale * (1 + breathe)})
            scaleY(${1 - breathe})
            `;
    }
}


// ======================================================
// GAME LOOP
// ======================================================

let lastTime =
    performance.now();


function gameLoop(
    currentTime
) {

    const deltaTime =
        (
            currentTime -
            lastTime
        ) / 1000;


    lastTime =
        currentTime;


    update(
        deltaTime
    );


    requestAnimationFrame(
        gameLoop
    );
}


// ======================================================
// 鍵盤測試
//
// H = 直接受到 10 傷害
//
// T = 模擬一次觀眾兌換
// ======================================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        // ==================================================
        // H
        // ==================================================

        if (
            key === "h"
        ) {

            damagePudding(
                10
            );
        }


        // ==================================================
        // T
        // ==================================================

        if (
            key === "t"
        ) {

            throwTomatoBatch(
                "測試玩家"
            );
        }

        // ==================================================
        // I
        // ==================================================

        if (key === "i") {

            // 強制冰塊
                showThrowMessage(
                    "測試玩家",
                    "冰塊",
                    1
                );
            throwIce();
        }

        // ==================================================
        // C
        // ==================================================

        if (key === "c") {

            showThrowMessage(
                    "測試玩家",
                    "巧克力",
                    1,
                    "normal"
                );

            throwChocolate();
        }

        // ==================================================
        // R
        // ==================================================

        if (key === "r") {

            // 隨機道具
            throwRandomItem(
                "測試玩家"
            );
        }

        if (
            event.key.toLowerCase() === "y"
        ) {

            throwRandomItemBatch(
                "測試玩家",
                10
            );
        }

        //玩雞蛋
        if (key === "e") {

            startPlayingEgg();
        }

        //睡覺
        if (
            key === "s"
        ) {

            startGoingToSleep();
        }

    }
);


// ======================================================
// Resize
// ======================================================

window.addEventListener(
    "resize",
    () => {

        const rightBoundary =
            getRightBoundary();


        if (
            state.x >
            rightBoundary
        ) {

            state.x =
                rightBoundary;
        }


        if (
            state.x <
            LEFT_BOUNDARY
        ) {

            state.x =
                LEFT_BOUNDARY;
        }

    }
);


// ======================================================
// 初始化
// ======================================================

state.x =
    RESPAWN_X;


puddingContainer.style.left =
    `${RESPAWN_X}px`;


state.hp =
    state.maxHp;


updateHpBar();


pudding.src =
    "/images/game/pudding.png";


pudding.style.opacity =
    "1";


hideHpBar();

initializeEgg();

eggObject.addEventListener(
    "animationend",
    () => {

        eggObject.classList.remove(
            "egg-bump"
        );
    }
);

startIdle();


requestAnimationFrame(
    gameLoop
);


// ======================================================
// Overlay WebSocket
// ======================================================

let overlaySocket = null;
let reconnectTimer = null;


// ======================================================
// 建立 WebSocket 連線
// ======================================================

function connectOverlayWebSocket() {

    const protocol =
        window.location.protocol === "https:"
            ? "wss"
            : "ws";

    const socketUrl =
        `${protocol}://${window.location.host}/ws/overlay`;

    console.log(
        "🔌 準備連線 Overlay WebSocket：",
        socketUrl
    );

    overlaySocket =
        new WebSocket(socketUrl);


    // ==================================================
    // 連線成功
    // ==================================================

    overlaySocket.onopen = () => {

        console.log(
            "✅ Overlay WebSocket 已連線"
        );

        if (reconnectTimer !== null) {

            clearTimeout(
                reconnectTimer
            );

            reconnectTimer = null;
        }
    };


    // ==================================================
    // 收到後端訊息
    // ==================================================

    overlaySocket.onmessage = event => {

        console.log(
            "🔥 WebSocket 收到原始訊息：",
            event.data
        );

        try {

            const data =
                JSON.parse(
                    event.data
                );

            console.log(
                "📦 JSON 解析成功：",
                data
            );

            handleOverlayEvent(
                data
            );

        } catch (error) {

            console.error(
                "❌ WebSocket JSON 解析失敗：",
                error
            );
        }
    };


    // ==================================================
    // 發生錯誤
    // ==================================================

    overlaySocket.onerror = error => {

        console.error(
            "❌ Overlay WebSocket Error：",
            error
        );
    };


    // ==================================================
    // 斷線
    // ==================================================

    overlaySocket.onclose = event => {

        console.warn(
            "⚠️ Overlay WebSocket 已斷線"
        );

        console.warn(
            "Code：",
            event.code
        );

        console.warn(
            "Reason：",
            event.reason
        );

        console.warn(
            "Clean：",
            event.wasClean
        );


        if (reconnectTimer === null) {

            reconnectTimer =
                setTimeout(() => {

                    reconnectTimer = null;

                    connectOverlayWebSocket();

                }, 3000);
        }
    };
}


// ======================================================
// 處理後端遊戲事件
// ======================================================

function handleOverlayEvent(
    data
) {

    console.log(
        "🎮 handleOverlayEvent() 收到：",
        data
    );


    switch (data.type) {

        // ==================================================
        // 單次隨機投擲
        // ==================================================

        case "THROW_ITEM":

            console.log(
                `🎁 ${data.userName} 觸發隨機投擲`
            );


            throwRandomItem(
                data.userName
            );

            break;


        // ==================================================
        // 隨機投擲 ×10
        // ==================================================

        case "THROW_ITEM_X10":

            console.log(
                `🎁 ${data.userName} 觸發隨機投擲 ×10`
            );


            throwRandomItemBatch(
                data.userName,
                10
            );

            break;


        // ==================================================
        // 未知事件
        // ==================================================

        default:

            console.warn(
                "⚠️ 未知 Overlay Event：",
                data.type
            );
    }
}


// ======================================================
// 啟動 WebSocket
// ======================================================

connectOverlayWebSocket();
