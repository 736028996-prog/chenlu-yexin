/* 可交互菜地。改作物名字、量词或初始状态，只动下面的 CROPS 和 START。 */
(function () {
  const CROPS = [
    { id: "radish", name: "萝卜", unit: "根" },
    { id: "tomato", name: "番茄", unit: "颗" },
    { id: "sunflower", name: "向日葵", unit: "朵" },
    { id: "pumpkin", name: "南瓜", unit: "个" },
    { id: "berry", name: "浆果", unit: "把" },
    { id: "wheat", name: "小麦", unit: "束" }
  ];

  const START = [
    { crop: "sunflower", stage: 4 },
    { crop: "tomato", stage: 2 },
    { crop: null, stage: 0 },
    { crop: "wheat", stage: 3 },
    { crop: "radish", stage: 1 },
    { crop: "berry", stage: 4 }
  ];

  const STAGE = ["空地", "刚播下", "发芽了", "在长大", "可以收"];
  const ACTION = ["播种", "浇水", "浇水", "浇水", "收获"];
  const KEY = "chenlu-garden-v1";

  const PW = 20;
  const PH = 22;
  const PS = 4;

  let state;
  let selected = "sunflower";
  let bed;
  let seedBar;
  let basketEl;
  let statusEl;
  let clearBtn;
  let armed = false;
  let armTimer = 0;

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function cropById(id) {
    return CROPS.find((c) => c.id === id) || null;
  }

  function fresh() {
    return {
      plots: START.map((p) => ({ crop: p.crop, stage: p.stage })),
      basket: CROPS.reduce((acc, c) => {
        acc[c.id] = 0;
        return acc;
      }, {})
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.plots) || data.plots.length !== 6) return fresh();
      const basket = fresh().basket;
      CROPS.forEach((c) => {
        const n = data.basket && data.basket[c.id];
        basket[c.id] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
      });
      const plots = data.plots.map((p) => {
        const known = p && cropById(p.crop);
        const stage = Math.max(0, Math.min(4, p.stage | 0));
        if (!known || stage === 0) return { crop: null, stage: 0 };
        return { crop: known.id, stage: stage };
      });
      return { plots: plots, basket: basket };
    } catch (err) {
      return fresh();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* 隐私模式等情况下记不住进度，菜地仍可当次使用 */
    }
  }

  function R(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  }

  function soil(ctx) {
    R(ctx, 0, 13, 20, 9, "#c6a36e");
    R(ctx, 0, 13, 20, 2, "#8d5a32");
    R(ctx, 0, 20, 20, 2, "#6b4423");
    R(ctx, 2, 16, 3, 1, "#e4c896");
    R(ctx, 12, 18, 4, 1, "#a88450");
    R(ctx, 7, 17, 2, 2, "#6b4423");
  }

  function leaves(ctx, y, look) {
    R(ctx, 4, y, 4, 2, look.leaf);
    R(ctx, 12, y + 1, 4, 2, look.dark);
    R(ctx, 7, y + 2, 3, 2, look.light);
  }

  function drawCrop(ctx, type, stage) {
    ctx.clearRect(0, 0, PW, PH);
    soil(ctx);
    if (!type || stage <= 0) {
      R(ctx, 8, 14, 4, 2, "#5a3418");
      return;
    }
    if (stage === 1) {
      R(ctx, 7, 12, 6, 3, "#5a3418");
      R(ctx, 8, 11, 4, 2, "#e6cb98");
      R(ctx, 9, 8, 2, 3, "#3f8a38");
      R(ctx, 7, 8, 2, 2, "#67b04c");
      return;
    }
    if (type === "radish") drawRadish(ctx, stage);
    else if (type === "tomato") drawTomato(ctx, stage);
    else if (type === "sunflower") drawSunflower(ctx, stage);
    else if (type === "pumpkin") drawPumpkin(ctx, stage);
    else if (type === "berry") drawBerry(ctx, stage);
    else if (type === "wheat") drawWheat(ctx, stage);
  }

  function drawRadish(ctx, stage) {
    const h = stage === 2 ? 4 : stage === 3 ? 6 : 8;
    R(ctx, 9, 13 - h, 2, h, "#2f6a30");
    leaves(ctx, 12 - h, { leaf: "#3f8a38", dark: "#2c6428", light: "#8fce62" });
    if (stage >= 3) {
      R(ctx, 8, 12, 4, 3, "#f3d5d8");
    }
    if (stage === 4) {
      R(ctx, 7, 11, 6, 5, "#f7e0e2");
      R(ctx, 8, 12, 2, 3, "#e7a8b0");
      R(ctx, 11, 10, 2, 2, "#8fce62");
      leaves(ctx, 6, { leaf: "#3f8a38", dark: "#2c6428", light: "#b6e07a" });
    }
  }

  function drawTomato(ctx, stage) {
    const h = stage === 2 ? 5 : 8;
    R(ctx, 9, 13 - h, 2, h, "#2f6a30");
    leaves(ctx, 11 - h, { leaf: "#3c8634", dark: "#245828", light: "#67b04c" });
    if (stage >= 3) {
      R(ctx, 5, 8, 4, 3, "#67b04c");
      R(ctx, 12, 9, 3, 3, "#3c8634");
    }
    if (stage === 4) {
      R(ctx, 3, 7, 6, 5, "#d24b45");
      R(ctx, 11, 8, 5, 4, "#c43c38");
      R(ctx, 4, 8, 2, 1, "#f2b0a4");
      R(ctx, 6, 6, 3, 2, "#2f6a30");
      R(ctx, 12, 7, 3, 2, "#2f6a30");
    }
  }

  function drawSunflower(ctx, stage) {
    const h = stage === 2 ? 5 : 9;
    R(ctx, 9, 14 - h, 2, h, "#3c6a28");
    R(ctx, 4, 12, 4, 2, "#3f8a38");
    R(ctx, 12, 13, 4, 2, "#2c6428");
    if (stage === 2) return;
    const cy = stage === 4 ? 4 : 6;
    R(ctx, 5, cy, 10, 6, "#f2c14e");
    R(ctx, 7, cy - 1, 6, 2, "#f2c14e");
    R(ctx, 7, cy + 5, 6, 2, "#e0a830");
    R(ctx, 8, cy + 1, 4, 4, "#6b4423");
    if (stage === 4) {
      R(ctx, 4, cy + 2, 2, 2, "#ffe07a");
      R(ctx, 14, cy + 2, 2, 2, "#ffe07a");
      px(ctx, 9, cy + 2, "#3a2416");
    }
  }

  function drawPumpkin(ctx, stage) {
    R(ctx, 9, stage === 2 ? 9 : 6, 2, stage === 2 ? 4 : 4, "#2f6a30");
    leaves(ctx, stage === 2 ? 8 : 5, { leaf: "#3f8a38", dark: "#2c6428", light: "#67b04c" });
    if (stage < 3) return;
    const y = stage === 4 ? 8 : 10;
    const h = stage === 4 ? 6 : 4;
    R(ctx, 4, y, 12, h, "#e07a28");
    R(ctx, 6, y - 1, 8, 2, "#f0a050");
    R(ctx, 9, y, 2, h, "#b85a18");
    R(ctx, 8, y - 2, 4, 2, "#2f6a30");
  }

  function drawBerry(ctx, stage) {
    const y = stage === 2 ? 8 : stage === 3 ? 6 : 4;
    const h = stage === 2 ? 5 : 8;
    R(ctx, 4, y, 12, h, "#245828");
    R(ctx, 6, y - 1, 8, 3, "#3c8634");
    R(ctx, 3, y + 2, 3, 4, "#2f6a30");
    R(ctx, 14, y + 2, 3, 4, "#1f4c28");
    if (stage >= 3) {
      R(ctx, 7, y + 3, 2, 2, "#c43458");
      R(ctx, 11, y + 4, 2, 2, "#a82848");
    }
    if (stage === 4) {
      R(ctx, 5, y + 2, 2, 2, "#e86d8c");
      R(ctx, 9, y + 5, 2, 2, "#f0a0b0");
      R(ctx, 12, y + 2, 2, 2, "#c43458");
      px(ctx, 6, y + 2, "#fff");
    }
  }

  function drawWheat(ctx, stage) {
    const heights = stage === 2 ? [5, 7, 4] : stage === 3 ? [8, 10, 7] : [10, 13, 9];
    const colors = ["#e6c56a", "#f3dc96", "#c9a24a"];
    [5, 9, 13].forEach((x, i) => {
      R(ctx, x, 13 - heights[i], 2, heights[i], colors[i]);
    });
    if (stage >= 3) {
      R(ctx, 4, 13 - heights[0] - 2, 4, 2, "#f3dc96");
      R(ctx, 8, 13 - heights[1] - 2, 4, 2, "#ffe9a8");
      R(ctx, 12, 13 - heights[2] - 2, 4, 2, "#e6c56a");
    }
  }

  function px(ctx, x, y, c) {
    R(ctx, x, y, 1, 1, c);
  }

  function paint(canvas, type, stage, scale) {
    const s = scale || PS;
    canvas.width = PW * s;
    canvas.height = PH * s;
    const context = canvas.getContext("2d");
    context.setTransform(s, 0, 0, s, 0, 0);
    context.imageSmoothingEnabled = false;
    drawCrop(context, type, stage);
  }

  function labelFor(plot) {
    if (!plot.crop || plot.stage === 0) return "空地";
    return cropById(plot.crop).name;
  }

  function describe(plot) {
    const name = labelFor(plot);
    const stageName = STAGE[plot.stage] || STAGE[0];
    const action = plot.stage === 0 ? "播种" + cropById(selected).name : ACTION[plot.stage];
    return name + "，" + stageName + "。点击" + action;
  }

  function say(text) {
    statusEl.textContent = text;
  }

  function renderBasket() {
    basketEl.replaceChildren();
    const have = CROPS.filter((c) => state.basket[c.id] > 0);
    if (!have.length) {
      const empty = document.createElement("p");
      empty.className = "basket-empty";
      empty.textContent = "篮子还是空的。成熟的菜再点一次就会进来。";
      basketEl.appendChild(empty);
      return;
    }
    const title = document.createElement("span");
    title.className = "basket-title";
    title.textContent = "篮子";
    basketEl.appendChild(title);
    have.forEach((c) => {
      const chip = document.createElement("span");
      chip.className = "basket-chip";
      chip.textContent = c.name + " " + state.basket[c.id];
      basketEl.appendChild(chip);
    });
  }

  function renderPlot(button, index) {
    const plot = state.plots[index];
    const canvas = button.querySelector("canvas");
    paint(canvas, plot.crop, plot.stage, PS);
    const name = button.querySelector(".plot-name");
    const stage = button.querySelector(".plot-stage");
    name.textContent = labelFor(plot);
    stage.textContent = STAGE[plot.stage];
    button.dataset.ripe = plot.stage === 4 ? "true" : "false";
    button.setAttribute("aria-label", "第 " + (index + 1) + " 块" + describe(plot));
  }

  function renderSeeds() {
    seedBar.replaceChildren();
    CROPS.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seed";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", c.id === selected ? "true" : "false");
      btn.dataset.crop = c.id;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      paint(canvas, c.id, 4, 2);
      const span = document.createElement("span");
      span.textContent = c.name;
      btn.append(canvas, span);
      btn.addEventListener("click", () => selectSeed(c.id));
      seedBar.appendChild(btn);
    });
  }

  function selectSeed(id) {
    selected = id;
    const crop = cropById(id);
    seedBar.querySelectorAll(".seed").forEach((btn) => {
      btn.setAttribute("aria-checked", btn.dataset.crop === id ? "true" : "false");
    });
    say("选好了" + crop.name + "。点一块空地就能种。");
  }

  function pop(button) {
    if (reduced()) return;
    button.classList.add("is-acting");
    window.setTimeout(() => button.classList.remove("is-acting"), 180);
  }

  function act(index, button) {
    const plot = state.plots[index];
    pop(button);
    if (plot.stage === 0 || !plot.crop) {
      const crop = cropById(selected);
      state.plots[index] = { crop: crop.id, stage: 1 };
      say("种下了一颗" + crop.name + "。再点它浇水。");
    } else if (plot.stage < 4) {
      plot.stage += 1;
      const crop = cropById(plot.crop);
      if (plot.stage === 4) say(crop.name + "成熟了，再点一次就能收。");
      else say("给" + crop.name + "浇了水，它又长了一点。");
      button.classList.add("is-wet");
      window.setTimeout(() => button.classList.remove("is-wet"), 500);
    } else {
      const crop = cropById(plot.crop);
      state.basket[crop.id] += 1;
      state.plots[index] = { crop: null, stage: 0 };
      say("收下一" + crop.unit + crop.name + "，放进篮子了。这一格又空出来了。");
    }
    save();
    renderPlot(button, index);
    renderBasket();
    disarm();
  }

  function cols() {
    const template = getComputedStyle(bed).gridTemplateColumns;
    if (!template || template === "none") return 2;
    return template.split(" ").length;
  }

  function disarm() {
    armed = false;
    window.clearTimeout(armTimer);
    clearBtn.textContent = "翻地重来";
    clearBtn.setAttribute("aria-pressed", "false");
  }

  function clearGarden() {
    if (!armed) {
      armed = true;
      clearBtn.textContent = "再点一次确认翻地";
      clearBtn.setAttribute("aria-pressed", "true");
      say("再点一次「确认翻地」，会清空篮子和这六块地。");
      armTimer = window.setTimeout(disarm, 2800);
      return;
    }
    state = fresh();
    state.basket = CROPS.reduce((acc, c) => {
      acc[c.id] = 0;
      return acc;
    }, {});
    state.plots = START.map((p) => ({ crop: p.crop, stage: p.stage }));
    save();
    bed.querySelectorAll(".plot").forEach((button, index) => renderPlot(button, index));
    renderBasket();
    say("地翻好了，回到这份示例菜地。");
    disarm();
  }

  function buildPlots() {
    bed.replaceChildren();
    state.plots.forEach((plot, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "plot";
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      const name = document.createElement("span");
      name.className = "plot-name";
      const stage = document.createElement("span");
      stage.className = "plot-stage";
      const drops = document.createElement("span");
      drops.className = "drops";
      drops.setAttribute("aria-hidden", "true");
      drops.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
      button.append(canvas, name, stage, drops);
      button.addEventListener("click", () => act(index, button));
      button.addEventListener("keydown", (event) => {
        const move = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols(), ArrowUp: -cols() };
        const delta = move[event.key];
        if (!delta) return;
        const next = bed.querySelectorAll(".plot")[index + delta];
        if (!next) return;
        event.preventDefault();
        next.focus();
      });
      bed.appendChild(button);
      renderPlot(button, index);
    });
  }

  function init() {
    bed = document.getElementById("soil-bed");
    seedBar = document.getElementById("seed-bar");
    basketEl = document.getElementById("basket");
    statusEl = document.getElementById("garden-status");
    clearBtn = document.getElementById("clear-garden");
    if (!bed || !seedBar) return;
    state = load();
    renderSeeds();
    buildPlots();
    renderBasket();
    say("选一颗种子，点空地播种。点幼苗浇水，成熟后再点一次收获。");
    clearBtn.addEventListener("click", clearGarden);
    clearBtn.addEventListener("blur", () => {
      window.setTimeout(disarm, 200);
    });
  }

  window.FarmGarden = { init: init, crops: CROPS };
})();
