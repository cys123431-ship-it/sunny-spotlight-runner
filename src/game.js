(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const comboEl = document.getElementById("combo");
  const stageEl = document.getElementById("stage");
  const stageNameEl = document.getElementById("stageName");
  const stageProgressEl = document.getElementById("stageProgress");
  const stageBanner = document.getElementById("stageBanner");
  const stageBannerLabel = document.getElementById("stageBannerLabel");
  const stageBannerName = document.getElementById("stageBannerName");
  const heartsEl = document.getElementById("hearts");
  const energyFill = document.getElementById("energyFill");
  const overlay = document.getElementById("overlay");
  const resultEl = document.getElementById("result");
  const startButton = document.getElementById("startButton");

  const W = 1280;
  const H = 720;
  const GROUND_Y = 574;
  const ASSET_BASE = "public/assets/generated/";

  const ASSETS = {
    sky: "sunny_park_sky.png",
    mid: "sunny_park_mid.png",
    front: "sunny_park_front.png",
    spotlight: "sunny_spotlight.png",
    heart: "sunny_heart.png",
    playerIdle: "sunny_player_idle.png",
    playerRun1: "sunny_player_run_1.png",
    playerRun2: "sunny_player_run_2.png",
    playerRun3: "sunny_player_run_3.png",
    playerRun4: "sunny_player_run_4.png",
    playerJump: "sunny_player_jump.png",
    playerSlide: "sunny_player_slide.png",
    playerHurt: "sunny_player_hurt.png",
    enemyHidden: "sunny_enemy_hidden.png",
    enemyRevealed: "sunny_enemy_revealed.png",
    enemyPop: "sunny_enemy_pop.png",
    basket: "sunny_obstacle_basket.png",
    flowerpot: "sunny_obstacle_flowerpot.png",
    fence: "sunny_obstacle_fence.png",
    puddle: "sunny_obstacle_puddle.png",
    sun: "sunny_collectible_sun.png",
    energyCell: "sunny_energy_cell.png",
    finish: "sunny_finish_gate.png",
    sparkle: "sunny_sparkle_burst.png",
  };

  for (let i = 1; i <= 20; i += 1) {
    ASSETS[`stage${i}`] = `sunny_stage_${String(i).padStart(2, "0")}_bg.png`;
  }

  const STAGES = [
    { name: "햇살 공원", bg: "stage1", accent: "#ffe06a", ground: "#61bd52", baseSpeed: 330, length: 3000, obstacle: 1.35, enemy: 2.25, collectible: 1.18 },
    { name: "벚꽃 정원", bg: "stage2", accent: "#ff9fcb", ground: "#72c960", baseSpeed: 338, length: 3150, obstacle: 1.3, enemy: 2.15, collectible: 1.16 },
    { name: "반짝 호숫길", bg: "stage3", accent: "#67d9ff", ground: "#57bc78", baseSpeed: 346, length: 3300, obstacle: 1.24, enemy: 2.05, collectible: 1.14 },
    { name: "시트러스 과수원", bg: "stage4", accent: "#ffc34d", ground: "#7cbc45", baseSpeed: 354, length: 3450, obstacle: 1.2, enemy: 1.95, collectible: 1.12 },
    { name: "언덕 축제", bg: "stage5", accent: "#ff8a5c", ground: "#68bd52", baseSpeed: 362, length: 3600, obstacle: 1.16, enemy: 1.9, collectible: 1.1 },
    { name: "해변 산책로", bg: "stage6", accent: "#40d6f5", ground: "#dcb967", baseSpeed: 370, length: 3800, obstacle: 1.12, enemy: 1.85, collectible: 1.08 },
    { name: "대나무 숲", bg: "stage7", accent: "#84df69", ground: "#6fad4e", baseSpeed: 378, length: 3950, obstacle: 1.08, enemy: 1.8, collectible: 1.06 },
    { name: "구름 왕국", bg: "stage8", accent: "#b7a1ff", ground: "#d9d0ff", baseSpeed: 386, length: 4100, obstacle: 1.04, enemy: 1.75, collectible: 1.05 },
    { name: "무지개 계곡", bg: "stage9", accent: "#ff7bc8", ground: "#6fc65d", baseSpeed: 394, length: 4250, obstacle: 1.0, enemy: 1.7, collectible: 1.04 },
    { name: "해바라기 들판", bg: "stage10", accent: "#ffd333", ground: "#caa04b", baseSpeed: 402, length: 4400, obstacle: 0.98, enemy: 1.65, collectible: 1.03 },
    { name: "눈꽃 마을", bg: "stage11", accent: "#93e8ff", ground: "#dceef6", baseSpeed: 410, length: 4550, obstacle: 0.96, enemy: 1.6, collectible: 1.02 },
    { name: "단풍 숲길", bg: "stage12", accent: "#ff9145", ground: "#c46b35", baseSpeed: 418, length: 4700, obstacle: 0.94, enemy: 1.55, collectible: 1.01 },
    { name: "사막 오아시스", bg: "stage13", accent: "#46d9d0", ground: "#d4a85d", baseSpeed: 426, length: 4850, obstacle: 0.92, enemy: 1.5, collectible: 1.0 },
    { name: "수정 동굴", bg: "stage14", accent: "#46e8ff", ground: "#4a628f", baseSpeed: 434, length: 5000, obstacle: 0.9, enemy: 1.45, collectible: 0.98 },
    { name: "캔디 카니발", bg: "stage15", accent: "#ff8fd4", ground: "#f09cb0", baseSpeed: 442, length: 5150, obstacle: 0.88, enemy: 1.4, collectible: 0.96 },
    { name: "하늘섬 정원", bg: "stage16", accent: "#9cefff", ground: "#86ca63", baseSpeed: 450, length: 5300, obstacle: 0.86, enemy: 1.36, collectible: 0.95 },
    { name: "새벽 항구", bg: "stage17", accent: "#ffb16e", ground: "#d18d57", baseSpeed: 458, length: 5450, obstacle: 0.84, enemy: 1.32, collectible: 0.94 },
    { name: "반딧불 초원", bg: "stage18", accent: "#d6ff7f", ground: "#547d53", baseSpeed: 466, length: 5600, obstacle: 0.82, enemy: 1.28, collectible: 0.93 },
    { name: "별빛 관측소", bg: "stage19", accent: "#8ff4ff", ground: "#416598", baseSpeed: 474, length: 5750, obstacle: 0.8, enemy: 1.24, collectible: 0.92 },
    { name: "황금 하늘문", bg: "stage20", accent: "#ffd56e", ground: "#e3bc56", baseSpeed: 488, length: 6200, obstacle: 0.76, enemy: 1.16, collectible: 0.9 },
  ];

  const image = {};
  const imagePromises = {};
  const keys = new Set();
  const pointer = {
    x: W * 0.68,
    y: H * 0.5,
    active: false,
    lastMove: 0,
  };

  const player = {
    x: W * 0.25,
    y: GROUND_Y,
    vy: 0,
    width: 92,
    height: 122,
    slideTimer: 0,
    hurtTimer: 0,
    grounded: true,
  };

  const state = {
    mode: "ready",
    lastTime: 0,
    score: 0,
    combo: 1,
    comboTimer: 0,
    lives: 3,
    energy: 100,
    distance: 0,
    stageIndex: 0,
    stageDistance: 0,
    gateSpawned: false,
    stageBannerTimer: 0,
    speed: 345,
    spawnTimer: 0,
    collectibleTimer: 1.8,
    enemyTimer: 2.2,
    entities: [],
    particles: [],
    bg: {
      sky: 0,
      mid: 0,
      front: 0,
    },
  };

  const hudCache = {
    score: "",
    combo: "",
    stage: "",
    stageName: "",
    lives: -1,
  };

  const obstacleTypes = [
    { kind: "obstacle", asset: "basket", w: 78, h: 60, damage: 1 },
    { kind: "obstacle", asset: "flowerpot", w: 72, h: 75, damage: 1 },
    { kind: "obstacle", asset: "fence", w: 105, h: 62, damage: 1 },
    { kind: "obstacle", asset: "puddle", w: 104, h: 34, damage: 1, low: true },
  ];

  const runFrames = ["playerRun1", "playerRun2", "playerRun3", "playerRun4"];

  function currentStage() {
    return STAGES[state.stageIndex] || STAGES[STAGES.length - 1];
  }

  function showStageBanner() {
    const stage = currentStage();
    stageBannerLabel.textContent = `STAGE ${state.stageIndex + 1} / ${STAGES.length}`;
    stageBannerName.textContent = stage.name;
    stageBanner.classList.add("show");
    state.stageBannerTimer = 1.75;
  }

  function loadImages() {
    const entries = Object.entries(ASSETS).filter(([key]) => !key.startsWith("stage") || key === "stage1");
    return Promise.all(
      entries.map(([key]) => loadImage(key)),
    );
  }

  function loadImage(key) {
    if (image[key]) return Promise.resolve(image[key]);
    if (imagePromises[key]) return imagePromises[key];
    const file = ASSETS[key];
    imagePromises[key] = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        image[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Missing asset: ${file}`);
        resolve(null);
      };
      img.src = `${ASSET_BASE}${file}`;
    });
    return imagePromises[key];
  }

  function warmStageImages(index) {
    for (let i = index; i <= Math.min(index + 2, STAGES.length - 1); i += 1) {
      loadImage(STAGES[i].bg);
    }
  }

  function resetGame() {
    state.mode = "playing";
    state.lastTime = performance.now();
    state.score = 0;
    state.combo = 1;
    state.comboTimer = 0;
    state.lives = 3;
    state.energy = 100;
    state.distance = 0;
    state.stageIndex = 0;
    state.stageDistance = 0;
    state.gateSpawned = false;
    state.stageBannerTimer = 0;
    state.speed = currentStage().baseSpeed;
    state.spawnTimer = 0.8;
    state.collectibleTimer = 1.35;
    state.enemyTimer = 1.8;
    state.entities = [];
    state.particles = [];
    state.bg.sky = 0;
    state.bg.mid = 0;
    state.bg.front = 0;
    player.y = GROUND_Y;
    player.vy = 0;
    player.slideTimer = 0;
    player.hurtTimer = 0;
    player.grounded = true;
    pointer.active = true;
    overlay.classList.add("hidden");
    resultEl.textContent = "";
    warmStageImages(0);
    updateHud();
    showStageBanner();
  }

  function endGame() {
    state.mode = "gameover";
    resultEl.textContent = `STAGE ${state.stageIndex + 1} · ${Math.floor(state.score).toLocaleString()} POINTS`;
    startButton.textContent = "RESTART";
    overlay.classList.remove("hidden");
  }

  function winGame() {
    state.mode = "gameover";
    state.score += 5000 * state.combo;
    resultEl.textContent = `ALL 20 STAGES CLEAR · ${Math.floor(state.score).toLocaleString()} POINTS`;
    startButton.textContent = "RESTART";
    overlay.classList.remove("hidden");
  }

  function updateHud() {
    const stage = currentStage();
    const scoreText = Math.floor(state.score).toLocaleString();
    const comboText = `x${state.combo}`;
    const stageText = `${state.stageIndex + 1}/${STAGES.length}`;
    if (hudCache.score !== scoreText) {
      hudCache.score = scoreText;
      scoreEl.textContent = scoreText;
    }
    if (hudCache.combo !== comboText) {
      hudCache.combo = comboText;
      comboEl.textContent = comboText;
    }
    if (hudCache.stage !== stageText) {
      hudCache.stage = stageText;
      stageEl.textContent = stageText;
    }
    if (hudCache.stageName !== stage.name) {
      hudCache.stageName = stage.name;
      stageNameEl.textContent = stage.name;
    }
    stageProgressEl.style.width = `${Math.min(100, (state.stageDistance / stage.length) * 100)}%`;
    energyFill.style.width = `${Math.max(0, Math.min(100, state.energy))}%`;
    if (hudCache.lives === state.lives) return;
    hudCache.lives = state.lives;
    heartsEl.replaceChildren();
    for (let i = 0; i < state.lives; i += 1) {
      const heart = new Image();
      heart.src = `${ASSET_BASE}${ASSETS.heart}`;
      heart.alt = "";
      heartsEl.appendChild(heart);
    }
  }

  function jump() {
    if (state.mode !== "playing" || !player.grounded) return;
    player.vy = -780;
    player.grounded = false;
    player.slideTimer = 0;
    playTone(520, 0.055, "triangle", 0.05);
  }

  function slide() {
    if (state.mode !== "playing" || !player.grounded) return;
    player.slideTimer = 0.48;
  }

  function mapPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * W;
    pointer.y = ((event.clientY - rect.top) / rect.height) * H;
    pointer.active = true;
    pointer.lastMove = performance.now();
  }

  function spawnObstacle() {
    const base = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const scale = base.low ? 0.9 + Math.random() * 0.12 : 0.88 + Math.random() * 0.2;
    state.entities.push({
      ...base,
      x: W + 90,
      y: GROUND_Y,
      w: base.w * scale,
      h: base.h * scale,
      hit: false,
    });
  }

  function spawnCollectible() {
    const isEnergy = Math.random() < 0.44;
    state.entities.push({
      kind: isEnergy ? "energy" : "sun",
      asset: isEnergy ? "energyCell" : "sun",
      x: W + 70,
      y: GROUND_Y - 125 - Math.random() * 120,
      w: isEnergy ? 42 : 46,
      h: isEnergy ? 56 : 50,
      bob: Math.random() * Math.PI * 2,
      taken: false,
    });
  }

  function spawnEnemy() {
    state.entities.push({
      kind: "enemy",
      asset: "enemyHidden",
      x: W + 80,
      y: GROUND_Y - 126 - Math.random() * 135,
      w: 90,
      h: 67,
      reveal: 0,
      revealed: false,
      popped: false,
    });
  }

  function spawnFinishGate() {
    state.entities.push({
      kind: "finish",
      asset: "finish",
      x: W + 120,
      y: GROUND_Y,
      w: 150,
      h: 112,
      hit: false,
    });
  }

  function update(dt, now) {
    if (state.mode !== "playing") return;

    const stage = currentStage();
    const speedBoost = Math.min(110, state.stageDistance * 0.012);
    state.speed = stage.baseSpeed + speedBoost;
    state.distance += state.speed * dt;
    state.stageDistance += state.speed * dt;
    state.score += (state.speed * dt * 0.08) * state.combo;
    state.comboTimer = Math.max(0, state.comboTimer - dt);
    if (state.comboTimer <= 0) state.combo = 1;
    state.stageBannerTimer = Math.max(0, state.stageBannerTimer - dt);
    if (state.stageBannerTimer <= 0) stageBanner.classList.remove("show");

    player.vy += 1850 * dt;
    player.y += player.vy * dt;
    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.vy = 0;
      player.grounded = true;
    }
    player.slideTimer = Math.max(0, player.slideTimer - dt);
    player.hurtTimer = Math.max(0, player.hurtTimer - dt);

    const spotlightLive = state.energy > 0 && pointer.active;
    if (spotlightLive) {
      state.energy = Math.max(0, state.energy - 5.5 * dt);
    } else {
      state.energy = Math.min(100, state.energy + 8 * dt);
    }

    state.bg.sky = (state.bg.sky - state.speed * 0.055 * dt) % W;
    state.bg.mid = (state.bg.mid - state.speed * 0.22 * dt) % W;
    state.bg.front = (state.bg.front - state.speed * 0.85 * dt) % W;

    state.spawnTimer -= dt;
    state.collectibleTimer -= dt;
    state.enemyTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnObstacle();
      state.spawnTimer = Math.max(0.48, stage.obstacle - state.stageIndex * 0.008) + Math.random() * 0.42;
    }
    if (state.collectibleTimer <= 0) {
      spawnCollectible();
      state.collectibleTimer = stage.collectible + Math.random() * 1.1;
    }
    if (state.enemyTimer <= 0) {
      spawnEnemy();
      state.enemyTimer = stage.enemy + Math.random() * 0.9;
    }
    if (state.stageDistance >= stage.length && !state.gateSpawned) {
      spawnFinishGate();
      state.gateSpawned = true;
    }

    updateEntities(dt, now, spotlightLive);
    updateParticles(dt);
    updateHud();
  }

  function updateEntities(dt, now, spotlightLive) {
    const playerBox = getPlayerBox();
    for (const entity of state.entities) {
      entity.x -= state.speed * dt;
      if (entity.bob !== undefined) {
        entity.bob += dt * 4.5;
      }

      if (entity.kind === "enemy") {
        if (spotlightLive && spotlightHits(entity)) {
          entity.reveal += dt;
          state.energy = Math.max(0, state.energy - 8 * dt);
          addSpark(entity.x + entity.w * 0.5, entity.y - entity.h * 0.45, 1);
          if (entity.reveal >= 0.55 && !entity.revealed) {
            entity.revealed = true;
            entity.asset = "enemyRevealed";
            state.score += 140 * state.combo;
            state.combo = Math.min(9, state.combo + 1);
            state.comboTimer = 4.5;
            playTone(760, 0.06, "sine", 0.06);
          }
          if (entity.reveal >= 1.08 && !entity.popped) {
            entity.popped = true;
            entity.kind = "pop";
            entity.asset = "enemyPop";
            entity.life = 0.35;
            state.score += 260 * state.combo;
            playTone(980, 0.08, "triangle", 0.05);
          }
        } else {
          entity.reveal = Math.max(0, entity.reveal - dt * 0.36);
        }
      }

      if (entity.kind === "pop") {
        entity.life -= dt;
        entity.scale = 1 + (0.35 - entity.life) * 1.5;
      }

      if (entity.kind === "obstacle" && !entity.hit && intersects(playerBox, entityBox(entity))) {
        entity.hit = true;
        damagePlayer();
      }

      if ((entity.kind === "sun" || entity.kind === "energy") && !entity.taken && intersects(playerBox, entityBox(entity))) {
        entity.taken = true;
        if (entity.kind === "energy") {
          state.energy = Math.min(100, state.energy + 34);
          playTone(620, 0.08, "sine", 0.05);
        } else {
          state.score += 180 * state.combo;
          state.combo = Math.min(9, state.combo + 1);
          state.comboTimer = 4.5;
          playTone(830, 0.08, "triangle", 0.04);
        }
        burst(entity.x, entity.y);
      }

      if (entity.kind === "finish" && !entity.hit && intersects(playerBox, entityBox(entity))) {
        entity.hit = true;
        state.score += 800 * state.combo;
        state.combo = Math.min(9, state.combo + 2);
        state.comboTimer = 5;
        burst(entity.x + entity.w * 0.5, entity.y - entity.h * 0.7);
        playTone(1040, 0.12, "triangle", 0.06);
        advanceStage();
      }
    }

    state.entities = state.entities.filter((entity) => {
      if (entity.taken) return false;
      if (entity.kind === "pop" && entity.life <= 0) return false;
      return entity.x + entity.w > -160;
    });
  }

  function advanceStage() {
    if (state.stageIndex >= STAGES.length - 1) {
      winGame();
      return;
    }
    state.stageIndex += 1;
    state.stageDistance = 0;
    state.gateSpawned = false;
    state.energy = Math.min(100, state.energy + 28);
    state.entities = [];
    state.particles = [];
    state.spawnTimer = 1.05;
    state.collectibleTimer = 1.1;
    state.enemyTimer = 1.55;
    state.bg.sky = 0;
    state.bg.mid = 0;
    state.bg.front = 0;
    warmStageImages(state.stageIndex);
    showStageBanner();
    updateHud();
  }

  function updateParticles(dt) {
    for (const particle of state.particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 90 * dt;
    }
    state.particles = state.particles.filter((particle) => particle.life > 0);
  }

  function damagePlayer() {
    if (player.hurtTimer > 0) return;
    player.hurtTimer = 0.95;
    state.lives -= 1;
    state.combo = 1;
    state.comboTimer = 0;
    state.energy = Math.max(0, state.energy - 16);
    shake(8);
    playTone(180, 0.12, "sawtooth", 0.035);
    if (state.lives <= 0) {
      endGame();
    }
  }

  function getPlayerBox() {
    const sliding = player.slideTimer > 0;
    const w = sliding ? 92 : 76;
    const h = sliding ? 58 : 112;
    return {
      x: player.x - w * 0.45,
      y: player.y - h,
      w,
      h,
    };
  }

  function entityBox(entity) {
    return {
      x: entity.x - entity.w * 0.5,
      y: entity.y - entity.h,
      w: entity.w,
      h: entity.h,
    };
  }

  function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function spotlightHits(entity) {
    const lamp = getLampPoint();
    const target = {
      x: entity.x,
      y: entity.y - entity.h * 0.5,
    };
    const dx = pointer.x - lamp.x;
    const dy = pointer.y - lamp.y;
    const tx = target.x - lamp.x;
    const ty = target.y - lamp.y;
    const beamLen = Math.hypot(dx, dy);
    const targetLen = Math.hypot(tx, ty);
    if (beamLen < 60 || targetLen < 40 || targetLen > 660) return false;
    const dot = (dx * tx + dy * ty) / (beamLen * targetLen);
    const nearPointer = Math.hypot(pointer.x - target.x, pointer.y - target.y) < 128;
    return dot > 0.9 || nearPointer;
  }

  function getLampPoint() {
    return {
      x: player.x + 38,
      y: player.y - (player.slideTimer > 0 ? 56 : 92),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawEntities("behind");
    drawPlayer();
    drawEntities("front");
    drawSpotlight();
    drawParticles();

    if (state.mode === "ready") {
      drawAttract();
    }
  }

  function drawBackground() {
    const stage = currentStage();
    const bg = image[stage.bg];
    ctx.fillStyle = "#8ed7ff";
    ctx.fillRect(0, 0, W, H);
    if (bg) {
      drawStageImage(bg, state.bg.mid);
    } else {
      drawLayer(image.sky, state.bg.sky, 0, 322, 1.02);
      drawLayer(image.mid, state.bg.mid, 210, 270, 1.04);
      drawLayer(image.front, state.bg.front, 462, 258, 1.06);
    }

    drawStageAtmosphere(stage);

    const grass = ctx.createLinearGradient(0, GROUND_Y - 10, 0, H);
    grass.addColorStop(0, `${stage.ground}55`);
    grass.addColorStop(0.4, `${stage.ground}22`);
    grass.addColorStop(1, "rgba(98, 65, 20, 0.16)");
    ctx.fillStyle = grass;
    ctx.fillRect(0, GROUND_Y - 10, W, H - GROUND_Y + 10);
  }

  function drawStageImage(img, offset) {
    const drawW = W;
    const start = Math.floor((offset * 0.32) % drawW) - drawW;
    for (let x = start; x < W + drawW; x += drawW) {
      ctx.drawImage(img, x, 0, drawW, H);
    }
  }

  function drawStageAtmosphere(stage) {
    ctx.save();
    const glow = ctx.createRadialGradient(W * 0.84, H * 0.1, 20, W * 0.84, H * 0.1, 360);
    glow.addColorStop(0, `${stage.accent}70`);
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    if (state.stageIndex >= 13) {
      ctx.globalAlpha = 0.18;
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 18; i += 1) {
        const x = (i * 197 + state.distance * 0.08) % (W + 120) - 60;
        const y = 60 + ((i * 83) % 260);
        ctx.fillStyle = i % 2 ? stage.accent : "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawLayer(img, offset, y, height, scaleX = 1) {
    if (!img) return;
    const drawW = W * scaleX;
    const start = Math.floor(offset - drawW);
    for (let x = start; x < W + drawW; x += drawW) {
      ctx.drawImage(img, x, y, drawW, height);
    }
  }

  function drawEntities(layer) {
    for (const entity of state.entities) {
      if (layer === "behind" && entity.kind !== "enemy") continue;
      if (layer === "front" && entity.kind === "enemy") continue;
      drawEntity(entity);
    }
  }

  function drawEntity(entity) {
    const img = image[entity.asset];
    const bob = entity.bob !== undefined ? Math.sin(entity.bob) * 7 : 0;
    const box = entityBox(entity);
    const scale = entity.scale || 1;
    const alpha = entity.kind === "enemy" && !entity.revealed ? 0.6 + entity.reveal * 0.55 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    if (entity.kind === "enemy") {
      ctx.filter = `brightness(${0.78 + entity.reveal * 0.55}) saturate(${0.8 + entity.reveal * 0.5})`;
    }
    if (img) {
      const dw = box.w * scale;
      const dh = box.h * scale;
      ctx.drawImage(img, entity.x - dw * 0.5, box.y + bob - (dh - box.h), dw, dh);
    } else {
      drawFallback(box.x, box.y, box.w, box.h, entity.kind);
    }
    ctx.restore();

    if (entity.kind === "enemy" && entity.reveal > 0) {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 219, 74, ${0.35 + entity.reveal * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(entity.x, entity.y - entity.h * 0.5, 48 + entity.reveal * 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPlayer() {
    const sliding = player.slideTimer > 0;
    let key = "playerIdle";
    if (player.hurtTimer > 0) key = "playerHurt";
    else if (!player.grounded) key = "playerJump";
    else if (sliding) key = "playerSlide";
    else if (state.mode === "playing") {
      const frame = Math.floor((state.distance / 58) % runFrames.length);
      key = runFrames[frame];
    }

    const img = image[key];
    const w = sliding ? 118 : 96;
    const h = sliding ? 88 : 132;
    const x = player.x - w * 0.5;
    const y = player.y - h;

    ctx.save();
    if (player.hurtTimer > 0) {
      ctx.globalAlpha = 0.72 + Math.sin(performance.now() * 0.04) * 0.18;
    }
    if (img) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      drawFallback(x, y, w, h, "player");
    }
    ctx.restore();
  }

  function drawSpotlight() {
    if (!pointer.active || state.energy <= 0 || state.mode !== "playing") return;
    const lamp = getLampPoint();
    const dx = pointer.x - lamp.x;
    const dy = pointer.y - lamp.y;
    const len = Math.min(690, Math.max(260, Math.hypot(dx, dy) + 150));
    const angle = Math.atan2(dy, dx);
    const img = image.spotlight;

    ctx.save();
    ctx.globalAlpha = 0.3 + (state.energy / 100) * 0.42;
    ctx.globalCompositeOperation = "screen";
    ctx.translate(lamp.x, lamp.y);
    ctx.rotate(angle);
    if (img) {
      ctx.drawImage(img, -24, -118, len, 236);
    } else {
      const glow = ctx.createLinearGradient(0, 0, len, 0);
      glow.addColorStop(0, "rgba(255, 240, 130, 0.8)");
      glow.addColorStop(1, "rgba(255, 209, 57, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, -120);
      ctx.lineTo(len, 120);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const lampGlow = ctx.createRadialGradient(lamp.x, lamp.y, 3, lamp.x, lamp.y, 34);
    lampGlow.addColorStop(0, "rgba(255, 253, 202, 0.95)");
    lampGlow.addColorStop(1, "rgba(255, 202, 55, 0)");
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(lamp.x, lamp.y, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawAttract() {
    const lamp = getLampPoint();
    const t = performance.now() * 0.001;
    pointer.x = W * 0.67 + Math.cos(t * 1.2) * 110;
    pointer.y = H * 0.43 + Math.sin(t * 1.6) * 70;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    pointer.x = W * 0.67 + Math.cos(t * 1.2) * 110;
    pointer.y = H * 0.43 + Math.sin(t * 1.6) * 70;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.42;
    ctx.translate(lamp.x, lamp.y);
    ctx.rotate(Math.atan2(pointer.y - lamp.y, pointer.x - lamp.x));
    if (image.spotlight) ctx.drawImage(image.spotlight, -24, -118, 590, 236);
    ctx.restore();
  }

  function drawFallback(x, y, w, h, kind) {
    ctx.fillStyle = kind === "enemy" ? "#39465a" : "#ffcf4d";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
  }

  function addSpark(x, y, amount = 3) {
    if (Math.random() > 0.26) return;
    for (let i = 0; i < amount; i += 1) {
      state.particles.push({
        x: x + (Math.random() - 0.5) * 26,
        y: y + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 34,
        vy: -20 - Math.random() * 40,
        life: 0.35 + Math.random() * 0.25,
        maxLife: 0.6,
        size: 2 + Math.random() * 3,
        color: Math.random() < 0.5 ? "#fff0a8" : "#61dcff",
      });
    }
  }

  function burst(x, y) {
    for (let i = 0; i < 18; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = 80 + Math.random() * 170;
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 80,
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8,
        size: 2 + Math.random() * 4,
        color: Math.random() < 0.5 ? "#ffe166" : "#ffffff",
      });
    }
  }

  let shakeUntil = 0;
  let shakePower = 0;
  function shake(power) {
    shakeUntil = performance.now() + 180;
    shakePower = power;
  }

  let audioCtx;
  function playTone(freq, duration, type, volume) {
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio is optional.
    }
  }

  function frame(now) {
    const dt = Math.min(0.033, (now - state.lastTime) / 1000 || 0);
    state.lastTime = now;

    ctx.save();
    if (now < shakeUntil) {
      ctx.translate((Math.random() - 0.5) * shakePower, (Math.random() - 0.5) * shakePower);
    }
    update(dt, now);
    draw();
    ctx.restore();
    requestAnimationFrame(frame);
  }

  function bindEvents() {
    startButton.addEventListener("click", resetGame);
    window.addEventListener("keydown", (event) => {
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
        event.preventDefault();
        if (state.mode === "ready" || state.mode === "gameover") resetGame();
        else jump();
      }
      if (["ArrowDown", "KeyS", "ShiftLeft", "ShiftRight"].includes(event.code)) {
        event.preventDefault();
        slide();
      }
      keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => keys.delete(event.code));
    canvas.addEventListener("pointermove", mapPointer);
    canvas.addEventListener("pointerdown", (event) => {
      mapPointer(event);
      if (state.mode === "ready" || state.mode === "gameover") resetGame();
      else if (event.pointerType === "touch" && event.clientY > canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height * 0.66) {
        jump();
      }
    });
    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
    });
  }

  loadImages().then(() => {
    bindEvents();
    warmStageImages(0);
    updateHud();
    state.lastTime = performance.now();
    requestAnimationFrame(frame);
  });
})();
