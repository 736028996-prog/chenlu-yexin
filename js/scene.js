/* 原创像素场景。改颜色看文件顶部的 DAY / NIGHT。坐标都是逻辑像素。 */
(function () {
  const LW = 400;
  const LH = 224;

  const DAY = {
    sky: ["#6eb7e2", "#7fc6ea", "#98d6f1", "#b7e6f6", "#d5f1f4", "#eaf6ea", "#f8efd0", "#f6e0b0"],
    sun: "#ffe07a",
    sunCore: "#fff6c8",
    sunEdge: "#f0b44a",
    cloud: "#fffdf8",
    cloudShade: "#dce8f2",
    hillFar: "#a9c490",
    hillMid: "#7daa62",
    hillTree: "#6d9458",
    grass: "#63a63e",
    grassDark: "#4b8a30",
    grassLight: "#8dcc60",
    dirt: "#d2b07a",
    dirtDark: "#a88450",
    dirtLight: "#e6cb98",
    trunk: "#6d4a30",
    trunkDark: "#4a3120",
    leaf: "#3c8634",
    leafDark: "#2a5e26",
    leafLight: "#62ae48",
    leafHi: "#b6de78",
    blossom: "#f2a0b8",
    apple: "#d24b45",
    appleHi: "#f2b0a4",
    roof: "#d15a42",
    roofDark: "#9a3b2c",
    roofLight: "#e89078",
    wall: "#f6e3c8",
    wallShade: "#e4c8a4",
    timber: "#5c3826",
    stone: "#8d867c",
    stoneLight: "#b7b0a6",
    door: "#7a4c30",
    doorLight: "#a86c42",
    knob: "#f0d078",
    glass: "#b7e4f4",
    glassHi: "#f3fbfe",
    frame: "#5c3826",
    water: "#4e9cc2",
    waterDark: "#3a7a98",
    waterHi: "#e4f7ff",
    flowerPink: "#e86d8c",
    flowerYellow: "#f2c14e",
    flowerLilac: "#8d78c8",
    flowerWhite: "#fff8f0",
    flowerCenter: "#f0d078",
    fence: "#e6c69a",
    fenceDark: "#8a6240",
    chicken: "#fffaf2",
    comb: "#e24e48",
    beak: "#f0a030",
    leg: "#e09030",
    eye: "#24180f",
    cat: "#e39a48",
    catDark: "#b87428",
    catLight: "#f6d2a4",
    nose: "#c46a58",
    smoke: "#c5d3df",
    bird: "#3c4a58",
    star: "#fff6d8",
    moon: "#f6f0d4",
    moonShade: "#e4d8b4",
    glow: "#ffd27a",
    firefly: "#dff6a4",
    vine: "#3c8634",
    buddySkin: "#e7b898",
    buddyCheek: "#f0b0a0",
    buddyHair: "#3a2a1c",
    shirt: "#f4e0c4",
    apron: "#3f8a38",
    apronLight: "#67b04c",
    pants: "#5c4030",
    boot: "#3a2618"
  };

  const NIGHT = {
    sky: ["#10182e", "#16203e", "#1c2a4e", "#243456", "#2e3c58", "#3a4454", "#3a4038", "#2c342c"],
    sun: "#ffe07a",
    sunCore: "#fff6c8",
    sunEdge: "#f0b44a",
    cloud: "#8ea0b4",
    cloudShade: "#6e8298",
    hillFar: "#3d5a48",
    hillMid: "#2f4a38",
    hillTree: "#264030",
    grass: "#2a4a30",
    grassDark: "#1c3422",
    grassLight: "#3d6844",
    dirt: "#8a6a42",
    dirtDark: "#5e442c",
    dirtLight: "#a88458",
    trunk: "#4a3424",
    trunkDark: "#2e2016",
    leaf: "#245830",
    leafDark: "#183c22",
    leafLight: "#3a7440",
    leafHi: "#4e8850",
    blossom: "#c47890",
    apple: "#a33c38",
    appleHi: "#d08078",
    roof: "#8e3e32",
    roofDark: "#5e2820",
    roofLight: "#b86858",
    wall: "#d9c4a4",
    wallShade: "#bba888",
    timber: "#3e281c",
    stone: "#6a655e",
    stoneLight: "#8d877e",
    door: "#5a3824",
    doorLight: "#7a5034",
    knob: "#e6c878",
    glass: "#ffd27a",
    glassHi: "#fff1c4",
    frame: "#3e281c",
    water: "#2e6078",
    waterDark: "#1e4054",
    waterHi: "#9ed0e4",
    flowerPink: "#c45a78",
    flowerYellow: "#c9a04a",
    flowerLilac: "#6e62a0",
    flowerWhite: "#e6ddd0",
    flowerCenter: "#e6c878",
    fence: "#b89468",
    fenceDark: "#5e4028",
    chicken: "#f0e6d4",
    comb: "#c44440",
    beak: "#d89030",
    leg: "#c08030",
    eye: "#1a120c",
    cat: "#c4843c",
    catDark: "#8a5820",
    catLight: "#e2c098",
    nose: "#a85a4c",
    smoke: "#d5dee6",
    bird: "#d0d6de",
    star: "#fff6d8",
    moon: "#f7f1d8",
    moonShade: "#e4d8b4",
    glow: "#ffd27a",
    firefly: "#dff6a4",
    vine: "#2f6a38",
    buddySkin: "#e7b898",
    buddyCheek: "#f0b0a0",
    buddyHair: "#2a1e14",
    shirt: "#e6d2b4",
    apron: "#2f6a34",
    apronLight: "#4e8a44",
    pants: "#4a3424",
    boot: "#2a1c12"
  };

  const STARS = [];
  (function seedStars() {
    let n = 42;
    const rnd = () => {
      n = (n * 16807 + 13) % 2147483647;
      return n / 2147483647;
    };
    for (let i = 0; i < 48; i++) {
      const x = Math.floor(rnd() * LW);
      const y = Math.floor(rnd() * 96);
      if (x > 60 && x < 110 && y < 52) continue;
      STARS.push({ x: x, y: y, small: rnd() > 0.35 });
    }
  })();

  let canvas;
  let ctx;
  let reduced = false;
  let raf = 0;
  let running = false;
  let started = false;

  function night() {
    return document.documentElement.dataset.theme === "night";
  }

  function colors() {
    return night() ? NIGHT : DAY;
  }

  function rect(x, y, w, h, c) {
    if (w <= 0 || h <= 0) return;
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function px(x, y, c) {
    rect(x, y, 1, 1, c);
  }

  function ellipse(cx, cy, rx, ry, color) {
    if (rx <= 0 || ry <= 0) return;
    ctx.fillStyle = color;
    const iy = Math.ceil(ry);
    for (let y = -iy; y <= iy; y++) {
      const t = (y * y) / (ry * ry);
      if (t > 1) continue;
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - t)));
      ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
    }
  }

  function circle(cx, cy, r, color) {
    ellipse(cx, cy, r, r, color);
  }

  function tri(x, baseY, h, halfW, color) {
    const hh = Math.max(1, Math.round(h));
    for (let i = 0; i < hh; i++) {
      const w = Math.max(1, Math.round(halfW * (1 - i / hh)));
      rect(x - w, baseY - i, w * 2, 1, color);
    }
  }

  function gable(peakX, peakY, baseY, left, right, fill, edge, light) {
    const span = Math.max(1, baseY - peakY);
    for (let y = Math.round(peakY); y <= baseY; y++) {
      const t = (y - peakY) / span;
      const x0 = Math.round(peakX + (left - peakX) * t);
      const x1 = Math.round(peakX + (right - peakX) * t);
      const stripe = (y - Math.round(peakY)) % 4 === 0;
      rect(x0, y, Math.max(0, x1 - x0), 1, stripe ? light : fill);
      px(x0, y, edge);
      px(x1, y, edge);
    }
  }

  function line(x0, y0, x1, y1, color) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (let n = 0; n < 400; n++) {
      px(x0, y0, color);
      px(x0 + 1, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  function blitScale(rows, x, y, map, scale, flip) {
    const s = scale || 1;
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const color = map[row[i]];
        if (!color) continue;
        const dx = flip ? row.length - 1 - i : i;
        rect(x + dx * s, y + j * s, s, s, color);
      }
    });
  }

  function drawSky(C) {
    rect(0, 0, LW, LH, C.sky[C.sky.length - 1]);
    const topH = 124;
    const n = C.sky.length;
    const h = Math.floor(topH / n);
    for (let i = 0; i < n; i++) {
      const y = i * h;
      const height = i === n - 1 ? topH - y : h;
      rect(0, y, LW, height, C.sky[i]);
    }
    for (let i = 1; i < n; i++) {
      const y = i * h;
      for (let x = 0; x < LW; x += 2) {
        px(x + (i % 2), y, C.sky[i]);
        px(x + ((i + 1) % 2), y - 1, C.sky[i - 1]);
      }
    }
  }

  function hill(base, amp, freq, phase, color) {
    for (let x = 0; x < LW; x++) {
      const y = Math.round(
        base +
          Math.sin((x + phase) * freq) * amp +
          Math.sin((x + phase) * freq * 2.1) * amp * 0.28
      );
      rect(x, y, 1, LH - y, color);
    }
  }

  function cloud(x, y, s, C) {
    circle(x + 2 * s, y + 6 * s, 6 * s, C.cloudShade);
    circle(x + 12 * s, y + 7 * s, 8 * s, C.cloudShade);
    circle(x + 22 * s, y + 6 * s, 5 * s, C.cloudShade);
    circle(x, y + 2 * s, 6 * s, C.cloud);
    circle(x + 10 * s, y, 8 * s, C.cloud);
    circle(x + 20 * s, y + 2 * s, 6 * s, C.cloud);
  }

  function drawClouds(C, ts) {
    const items = [
      { x: 8, y: 18, s: 1.05, v: 7 },
      { x: 140, y: 10, s: 1.4, v: 4.2 },
      { x: 250, y: 28, s: 0.85, v: 8 },
      { x: 320, y: 14, s: 1.15, v: 5.4 }
    ];
    const t = reduced ? 0 : ts / 1000;
    items.forEach((cl) => {
      const travel = reduced ? cl.x : ((cl.x + t * cl.v) % (LW + 80)) - 46;
      cloud(travel, cl.y, cl.s, C);
    });
  }

  function drawSun(C) {
    const cx = 336;
    const cy = 32;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      const x = cx + Math.round(Math.cos(a) * 18);
      const y = cy + Math.round(Math.sin(a) * 18);
      rect(x, y, 2, 2, C.sun);
    }
    circle(cx, cy, 13, C.sunEdge);
    circle(cx, cy, 10, C.sun);
    circle(cx - 3, cy - 3, 4, C.sunCore);
  }

  function drawMoon(C) {
    circle(78, 32, 12, C.moonShade);
    circle(78, 32, 10, C.moon);
    circle(75, 29, 7, "#fffdf4");
    px(74, 30, C.moonShade);
    px(82, 35, C.moonShade);
    rect(79, 33, 2, 2, C.moonShade);
    px(72, 36, C.moonShade);
  }

  function drawStars(C, ts) {
    STARS.forEach((s, i) => {
      const on = reduced || (Math.floor(ts / 380) + i) % 5 !== 0;
      if (!on) return;
      if (s.small) px(s.x, s.y, C.star);
      else rect(s.x, s.y, 2, 2, C.star);
    });
  }

  function drawBird(x, y, C) {
    rect(x, y, 2, 2, C.bird);
    rect(x + 2, y - 2, 2, 2, C.bird);
    rect(x + 4, y, 2, 2, C.bird);
    rect(x + 6, y - 2, 2, 2, C.bird);
    rect(x + 8, y, 2, 2, C.bird);
  }

  function drawBirds(C, ts) {
    const t = reduced ? 40 : ts / 50;
    drawBird((20 + t) % (LW + 16) - 8, 48, C);
    drawBird((180 + t * 0.7) % (LW + 16) - 8, 36, C);
  }

  function grassSpecks(C) {
    let n = 7;
    const rnd = () => {
      n = (n * 48271) % 2147483647;
      return n / 2147483647;
    };
    for (let i = 0; i < 220; i++) {
      const x = Math.floor(rnd() * LW);
      const y = 158 + Math.floor(rnd() * (LH - 158));
      px(x, y, rnd() > 0.5 ? C.grassDark : C.grassLight);
    }
  }

  function distantTree(x, base, C) {
    rect(x, base - 5, 2, 5, C.hillTree);
    tri(x + 1, base - 4, 12, 6, C.hillTree);
  }

  function roundTree(x, base, r, C, accent) {
    const trunkH = Math.round(r * 0.95);
    const trunkW = Math.max(4, Math.round(r * 0.26));
    rect(x - trunkW / 2, base - trunkH, trunkW, trunkH, C.trunk);
    rect(x - trunkW / 2, base - trunkH, 1, trunkH, C.trunkDark);
    const cy = base - trunkH - r * 0.45;
    circle(x + 1, cy + 3, r, C.leafDark);
    circle(x - r * 0.32, cy + 1, r * 0.78, C.leaf);
    circle(x + r * 0.36, cy, r * 0.7, C.leaf);
    circle(x - r * 0.05, cy - r * 0.32, r * 0.58, C.leafLight);
    circle(x - r * 0.28, cy - r * 0.42, r * 0.26, C.leafHi);
    if (accent === "apple") {
      const dots = [
        [-8, 0],
        [6, 4],
        [-1, -7],
        [10, -2],
        [-6, 6]
      ];
      dots.forEach(([dx, dy], i) => {
        px(x + dx, cy + dy, C.apple);
        if (i % 2 === 0) px(x + dx + 1, cy + dy, C.appleHi);
      });
    } else if (accent === "bloom") {
      [
        [-6, -2],
        [5, 2],
        [0, 6],
        [-2, 3],
        [7, -4],
        [-8, 4]
      ].forEach(([dx, dy]) => px(x + dx, cy + dy, C.blossom));
    }
  }

  function bush(x, y, r, C) {
    circle(x, y, r, C.leafDark);
    circle(x - 2, y - 1, Math.max(2, r - 1), C.leaf);
    circle(x - 3, y - 3, 2, C.leafHi);
    px(x + 2, y, C.blossom);
    px(x - 1, y + 1, C.flowerYellow);
  }

  function bloom(x, y, petal, C) {
    rect(x + 2, y + 2, 2, 5, C.leaf);
    rect(x, y, 6, 3, petal);
    rect(x + 2, y - 2, 2, 2, petal);
    rect(x + 2, y + 1, 2, 2, C.flowerCenter);
  }

  function tuft(x, y, C) {
    rect(x, y, 1, 3, C.grassDark);
    rect(x + 2, y + 1, 1, 3, C.grassLight);
    rect(x + 4, y, 1, 2, C.grass);
  }

  function drawWindow(x, y, C, isNight) {
    rect(x, y, 16, 13, C.frame);
    rect(x + 1, y + 1, 14, 11, isNight ? C.glow : C.glass);
    rect(x + 7, y + 1, 2, 11, C.frame);
    rect(x + 1, y + 6, 14, 2, C.frame);
    if (isNight) {
      px(x + 2, y + 2, C.glassHi);
      ctx.save();
      ctx.globalAlpha = 0.35;
      rect(x - 2, y + 1, 2, 11, C.glow);
      rect(x + 16, y + 1, 2, 11, C.glow);
      rect(x + 2, y - 2, 12, 2, C.glow);
      ctx.restore();
    } else {
      rect(x + 2, y + 2, 3, 2, C.glassHi);
    }
  }

  function drawSmoke(x, y, ts, C) {
    if (reduced) {
      rect(x, y - 8, 3, 3, C.smoke);
      rect(x + 2, y - 14, 2, 2, C.smoke);
      return;
    }
    for (let i = 0; i < 5; i++) {
      const life = ((ts / 320) + i * 0.2) % 1;
      const py = y - life * 30;
      const px0 = x + Math.round(Math.sin(life * 7 + i) * 4);
      const s = 2 + Math.floor(life * 3);
      ctx.globalAlpha = Math.max(0, 0.8 * (1 - life));
      rect(px0, py, s, s, C.smoke);
    }
    ctx.globalAlpha = 1;
  }

  function drawCottage(C, ts) {
    const isNight = night();
    const x = 62;
    const g = 176;
    rect(x, g - 7, 100, 7, C.stone);
    rect(x, g - 7, 100, 2, C.stoneLight);
    const wallTop = g - 64;
    rect(x + 6, wallTop, 88, 57, C.wall);
    rect(x + 78, wallTop, 16, 57, C.wallShade);
    const T = C.timber;
    rect(x + 6, wallTop, 88, 3, T);
    rect(x + 6, wallTop + 28, 88, 3, T);
    rect(x + 6, g - 10, 88, 3, T);
    rect(x + 6, wallTop, 3, 57, T);
    rect(x + 48, wallTop, 3, 57, T);
    rect(x + 91, wallTop, 3, 57, T);
    line(x + 10, wallTop + 26, x + 46, wallTop + 4, T);
    line(x + 52, wallTop + 4, x + 88, wallTop + 26, T);

    drawWindow(x + 14, wallTop + 8, C, isNight);
    drawWindow(x + 66, wallTop + 8, C, isNight);
    rect(x + 12, wallTop + 22, 20, 3, T);
    rect(x + 64, wallTop + 22, 20, 3, T);
    bloom(x + 12, wallTop + 16, C.flowerPink, C);
    bloom(x + 20, wallTop + 17, C.flowerYellow, C);
    bloom(x + 64, wallTop + 16, C.flowerWhite, C);
    bloom(x + 73, wallTop + 17, C.flowerLilac, C);

    const dx = x + 42;
    rect(dx, g - 34, 18, 27, C.door);
    rect(dx + 2, g - 32, 14, 23, C.doorLight);
    rect(dx + 3, g - 30, 5, 18, C.door);
    rect(dx + 12, g - 20, 2, 2, C.knob);
    rect(dx - 2, g - 8, 22, 3, C.stoneLight);

    gable(x + 50, wallTop - 34, wallTop + 6, x - 2, x + 102, C.roof, C.roofDark, C.roofLight);
    rect(x + 44, wallTop - 16, 12, 10, C.frame);
    rect(x + 46, wallTop - 14, 8, 6, isNight ? C.glow : C.glass);
    rect(x + 49, wallTop - 14, 2, 6, C.frame);

    rect(x + 18, wallTop - 26, 12, 24, C.roofDark);
    rect(x + 16, wallTop - 30, 16, 5, C.stone);
    rect(x + 18, wallTop - 28, 12, 2, C.stoneLight);
    drawSmoke(x + 22, wallTop - 32, ts, C);

    for (let i = 0; i < 16; i++) {
      const vy = g - 16 - i * 3;
      const vx = x + 8 + Math.round(Math.sin(i * 0.8) * 2);
      px(vx, vy, C.vine);
      if (i % 3 === 0) rect(vx + 1, vy, 2, 2, C.leafLight);
    }

    const lx = x + 34;
    const ly = wallTop + 32;
    rect(lx, ly, 2, 8, T);
    rect(lx - 2, ly + 7, 6, 7, isNight ? C.glow : C.knob);
    rect(lx - 1, ly + 8, 4, 5, isNight ? "#fff1c2" : "#e0b45a");
    if (isNight) {
      ctx.save();
      ctx.globalAlpha = 0.28;
      rect(lx - 6, ly + 6, 14, 12, C.glow);
      ctx.restore();
    }
  }

  function drawFence(C) {
    const railY = 168;
    const segments = [
      [8, 96],
      [156, 392]
    ];
    segments.forEach(([a, b]) => {
      rect(a, railY, b - a, 3, C.fence);
      rect(a, railY + 8, b - a, 3, C.fenceDark);
    });
    for (let x = 12; x < 390; x += 18) {
      if (x > 100 && x < 150) continue;
      rect(x, railY - 4, 4, 28, C.fenceDark);
      rect(x, railY - 4, 2, 28, C.fence);
      px(x + 1, railY - 2, C.knob);
    }
  }

  function drawYard(C) {
    for (let x = 108; x < 318; x++) {
      const top = 188 + Math.round(Math.sin(x * 0.18) * 2 + Math.sin(x * 0.05) * 2);
      rect(x, top, 1, LH - top, C.dirt);
    }
    rect(104, 174, 36, 22, C.dirt);
    rect(108, 174, 36, 2, C.dirtLight);
    let n = 19;
    const rnd = () => {
      n = (n * 48271) % 2147483647;
      return n / 2147483647;
    };
    for (let i = 0; i < 70; i++) {
      const x = 110 + Math.floor(rnd() * 200);
      const y = 192 + Math.floor(rnd() * 28);
      px(x, y, rnd() > 0.45 ? C.dirtDark : C.dirtLight);
    }
  }

  function veg(x, y, C, kind) {
    rect(x, y, 16, 7, C.dirtDark);
    rect(x, y, 16, 1, C.dirtLight);
    if (kind === 0) {
      rect(x + 3, y - 5, 2, 5, C.leaf);
      rect(x + 7, y - 7, 2, 7, C.leafDark);
      rect(x + 11, y - 4, 2, 4, C.leafLight);
    } else if (kind === 1) {
      rect(x + 7, y - 6, 2, 6, C.leaf);
      rect(x + 5, y - 9, 5, 4, C.apple);
      px(x + 6, y - 8, C.appleHi);
    } else {
      rect(x + 3, y - 8, 2, 8, "#c9a24a");
      rect(x + 7, y - 11, 2, 11, "#f0d78a");
      rect(x + 11, y - 7, 2, 7, "#a88430");
    }
  }

  function drawWell(C) {
    const x = 262;
    const y = 196;
    rect(x + 4, y - 26, 3, 24, C.trunk);
    rect(x + 20, y - 26, 3, 24, C.trunkDark);
    gable(x + 14, y - 36, y - 22, x, x + 28, C.roof, C.roofDark, C.roofLight);
    ellipse(x + 14, y - 2, 13, 6, C.stone);
    ellipse(x + 14, y - 3, 9, 4, C.waterDark);
    ellipse(x + 14, y - 4, 7, 3, C.water);
    ellipse(x + 12, y - 5, 2, 1, C.waterHi);
    rect(x + 11, y - 16, 6, 5, C.timber);
    rect(x + 13, y - 22, 1, 8, C.fence);
  }

  function drawPond(C) {
    ellipse(48, 208, 26, 9, C.grassDark);
    ellipse(48, 207, 22, 7, C.waterDark);
    ellipse(46, 206, 16, 5, C.water);
    ellipse(40, 205, 4, 1, C.waterHi);
    ellipse(58, 208, 5, 2, C.leaf);
    px(60, 207, C.flowerPink);
    rect(24, 196, 1, 10, C.leafDark);
    rect(28, 192, 1, 14, C.leaf);
    px(28, 191, C.flowerYellow);
    rect(70, 198, 1, 8, C.leafDark);
  }

  function drawFlowers(C) {
    const row = [
      [12, 186, C.flowerPink],
      [24, 190, C.flowerWhite],
      [86, 184, C.flowerYellow],
      [96, 188, C.flowerLilac],
      [150, 172, C.flowerPink],
      [330, 180, C.flowerYellow],
      [344, 186, C.flowerWhite],
      [360, 176, C.flowerPink],
      [378, 188, C.flowerLilac],
      [200, 210, C.flowerWhite],
      [214, 214, C.flowerYellow],
      [128, 206, C.flowerPink],
      [300, 208, C.flowerLilac]
    ];
    row.forEach(([x, y, c]) => bloom(x, y, c, C));
    [18, 70, 140, 230, 310, 370].forEach((x, i) => tuft(x, 214 - (i % 3), C));
  }

  const HEN_A = [
    "......rr........",
    ".....rrrr.......",
    "....wwwwwww.....",
    "...wwwwwwwww....",
    "...wwkwwwwwwo...",
    "...wwwwwwwwww...",
    "..wwwddddwwww...",
    "..wwwwwwwwwww...",
    "...wwwwwwwww....",
    "....wwwwwww.....",
    ".....yy..yy.....",
    ".....y....y....."
  ];
  const HEN_B = [
    "......rr........",
    ".....rrrr.......",
    "....wwwwwww.....",
    "...wwwwwwwww....",
    "...wwkwwwwwwo...",
    "...wwwwwwwwww...",
    "..wwwddddwwww...",
    "..wwwwwwwwwww...",
    "...wwwwwwwww....",
    "....wwwwwww.....",
    "......yy.yy.....",
    ".......y..y....."
  ];

  function drawChicken(C, ts) {
    const span = 36;
    const speed = 14;
    let pos = 24;
    let faceRight = true;
    let frame = 0;
    if (!reduced) {
      const dist = ((ts / 1000) * speed) % (span * 2);
      faceRight = dist < span;
      pos = faceRight ? dist : span * 2 - dist;
      frame = Math.floor(ts / 180) % 2;
    }
    const map = {
      w: C.chicken,
      r: C.comb,
      o: C.beak,
      y: C.leg,
      k: C.eye,
      d: C.wallShade
    };
    blitScale(frame ? HEN_B : HEN_A, Math.round(108 + pos), 196, map, 2, !faceRight);
  }

  const CAT_A = [
    ".....aa.........",
    "...aaaaaa.......",
    "..aapaaaaa......",
    "..aawbwbaa......",
    "..aaaaaaaa......",
    ".aaaaaaaaaa.....",
    ".aaannnnaaa.....",
    ".aaaaaaaaaa.....",
    "..aaaaaaaa......",
    "...aa..aa.......",
    "...aa..aa......."
  ];
  const CAT_B = [
    "aa...aa.........",
    ".aaaaaaa........",
    "..aapaaaaa......",
    "..aawbwbaa......",
    "..aaaaaaaa......",
    ".aaaaaaaaaa.....",
    ".aaannnnaaa.....",
    ".aaaaaaaaaa.....",
    "..aaaaaaaa......",
    "...aa..aa.......",
    "....a..a........"
  ];

  function drawCat(C, ts) {
    const frame = reduced ? 0 : Math.floor(ts / 420) % 2;
    const eye = night() ? C.glow : C.eye;
    const map = {
      a: C.cat,
      p: C.catLight,
      w: C.catLight,
      b: eye,
      n: C.nose
    };
    blitScale(frame ? CAT_B : CAT_A, 304, 146, map, 2, false);
  }

  function drawButterfly(C, ts) {
    if (night()) return;
    let x = 236;
    let y = 78;
    let open = true;
    if (!reduced) {
      x = 230 + Math.round(Math.sin(ts / 700) * 36);
      y = 74 + Math.round(Math.sin(ts / 480) * 12);
      open = Math.floor(ts / 160) % 2 === 0;
    }
    const wing = C.flowerLilac;
    if (open) {
      rect(x - 7, y, 6, 4, wing);
      rect(x + 3, y, 6, 4, wing);
      rect(x - 5, y + 4, 4, 3, C.flowerPink);
      rect(x + 3, y + 4, 4, 3, C.flowerPink);
      rect(x, y + 1, 2, 5, C.eye);
    } else {
      rect(x, y, 2, 7, wing);
      rect(x + 2, y + 2, 2, 4, C.flowerPink);
    }
  }

  function drawFireflies(C, ts) {
    if (!night()) return;
    const spots = [
      [40, 120],
      [180, 90],
      [220, 130],
      [300, 100],
      [350, 140],
      [120, 150]
    ];
    spots.forEach(([x, y], i) => {
      const on = reduced || (Math.floor(ts / 220) + i) % 4 !== 0;
      if (!on) return;
      const ox = reduced ? x : x + Math.round(Math.sin(ts / 500 + i) * 6);
      const oy = reduced ? y : y + Math.round(Math.cos(ts / 430 + i) * 4);
      rect(ox, oy, 2, 2, C.firefly);
      px(ox + 1, oy, "#f8ffd8");
    });
  }

  function drawDoorGlow(C) {
    if (!night()) return;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ellipse(116, 198, 22, 7, C.glow);
    ctx.restore();
  }

  function draw(ts) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const C = colors();
    ctx.globalAlpha = 1;
    drawSky(C);
    if (night()) {
      drawStars(C, ts);
      drawMoon(C);
    } else {
      drawSun(C);
      drawBirds(C, ts);
    }
    drawClouds(C, ts);
    hill(126, 8, 0.02, 20, C.hillFar);
    hill(146, 6, 0.028, 80, C.hillMid);
    hill(162, 4, 0.04, 10, C.grass);
    grassSpecks(C);
    [198, 230, 268, 312, 356, 24].forEach((x, i) => distantTree(x, 150 + (i % 3), C));
    roundTree(34, 170, 22, C, "bloom");
    roundTree(356, 176, 34, C, "apple");
    bush(18, 176, 6, C);
    bush(148, 172, 5, C);
    drawCottage(C, ts);
    drawYard(C);
    drawFence(C);
    drawWell(C);
    veg(196, 202, C, 0);
    veg(218, 206, C, 1);
    veg(240, 202, C, 2);
    drawPond(C);
    drawFlowers(C);
    drawDoorGlow(C);
    drawChicken(C, ts);
    drawCat(C, ts);
    drawButterfly(C, ts);
    drawFireflies(C, ts);
  }

  function loop(ts) {
    draw(ts || 0);
    if (!reduced && running) raf = requestAnimationFrame(loop);
  }

  function bindMotion() {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reduced = mq.matches;
      if (reduced) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        draw(0);
      } else if (started && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else if (mq.addListener) mq.addListener(apply);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    });
    return apply;
  }

  function start() {
    canvas = document.getElementById("scene");
    if (!canvas || started) return;
    started = true;
    const scale = 2;
    canvas.width = LW * scale;
    canvas.height = LH * scale;
    ctx = canvas.getContext("2d", { alpha: false });
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    bindMotion();
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    running = !reduced && !document.hidden;
    draw(0);
    if (running) raf = requestAnimationFrame(loop);
  }

  window.FarmScene = {
    start: start,
    refresh: function () {
      draw(performance.now());
    }
  };
})();
