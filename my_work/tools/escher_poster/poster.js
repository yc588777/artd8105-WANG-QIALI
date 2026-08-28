/* ARTD8105 — 4:5 bat–crane poster. file://  |  no modules  */
(function () {
  "use strict";

  var PATHS = window.ESCHER_PATHS;
  var PREVIEW_W = 800;
  var PREVIEW_H = 1000;
  var EXPORT_W = 2400;
  var EXPORT_H = 3000;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPt(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function smoothstep(e0, e1, x) {
    var t = clamp((x - e0) / (e1 - e0 || 1), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function todayStamp() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "." + m + "." + day;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(ix, iy, seed) {
    var n = (Math.imul(ix | 0, 374761393) + Math.imul(iy | 0, 668265263) + Math.imul(seed | 0, 2147483647)) | 0;
    return mulberry32(n)();
  }
  function valueNoise(x, y, seed) {
    var x0 = Math.floor(x), y0 = Math.floor(y);
    var fx = x - x0, fy = y - y0;
    var sx = fx * fx * (3 - 2 * fx);
    var sy = fy * fy * (3 - 2 * fy);
    var v00 = hash2(x0, y0, seed), v10 = hash2(x0 + 1, y0, seed);
    var v01 = hash2(x0, y0 + 1, seed), v11 = hash2(x0 + 1, y0 + 1, seed);
    return lerp(lerp(v00, v10, sx), lerp(v01, v11, sx), sy);
  }

  function centroid(pts) {
    var x = 0, y = 0, i;
    for (i = 0; i < pts.length; i++) { x += pts[i][0]; y += pts[i][1]; }
    return [x / pts.length, y / pts.length];
  }
  function lerpPts(a, b, t) {
    var n = a.length, out = new Array(n), i;
    for (i = 0; i < n; i++) out[i] = lerpPt(a[i], b[i], t);
    return out;
  }
  function arcLength(pts, closed) {
    var n = pts.length, s = [0], i, d, last = 0;
    for (i = 1; i < n; i++) {
      d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      last += d;
      s.push(last);
    }
    if (closed && n > 1) {
      last += Math.hypot(pts[0][0] - pts[n - 1][0], pts[0][1] - pts[n - 1][1]);
      s.push(last);
    }
    return s;
  }
  function resampleClosed(pts, n) {
    if (!pts || pts.length < 2) return pts || [];
    var s = arcLength(pts, true);
    var total = s[s.length - 1] || 1;
    var src = pts.concat([pts[0]]);
    var out = [], i, t, k, u;
    k = 0;
    for (i = 0; i < n; i++) {
      t = (i / n) * total;
      while (k < s.length - 2 && s[k + 1] < t) k++;
      u = (t - s[k]) / (s[k + 1] - s[k] || 1);
      out.push(lerpPt(src[k], src[k + 1], u));
    }
    return out;
  }
  function outwardNormal(pts, i, cen) {
    var n = pts.length;
    var a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    var nx = -(b[1] - a[1]), ny = b[0] - a[0];
    var len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    var vx = pts[i][0] - cen[0], vy = pts[i][1] - cen[1];
    if (nx * vx + ny * vy < 0) { nx = -nx; ny = -ny; }
    return [nx, ny];
  }

  function morphOutline(t, p, col, row) {
    var pts = lerpPts(PATHS.bat, PATHS.crane, t);
    var cen = centroid(pts);
    var n = pts.length;
    var i, pt, nrm, r, saw, flame, hook, amp, jx;
    var freqSaw = 4.5 + p.featherLayers * 0.85;
    var freqFlame = 6;
    for (i = 0; i < n; i++) {
      pt = pts[i];
      nrm = outwardNormal(pts, i, cen);
      r = Math.hypot(pt[0] - cen[0], pt[1] - cen[1]);
      saw = Math.sin((i / n) * Math.PI * 2 * freqSaw) * p.wingShape * (0.2 + 0.8 * t);
      flame = Math.sin((i / n) * Math.PI * 2 * freqFlame + 0.4) * (1 - p.wingShape) * (1 - t);
      hook = 0;
      if (p.ruyiCurves > 0 && t < 0.9) {
        var top = clamp((-pt[1] - 0.06) / 0.22, 0, 1);
        var side = smoothstep(0.16, 0.44, Math.abs(pt[0]));
        hook = Math.sin(pt[0] * 16 + i * 0.08) * top * side * p.ruyiCurves * (1 - t);
      }
      amp = (saw * 0.034 + flame * 0.026 + hook * 0.038) * (0.35 + r);
      jx = 0;
      if (p.printTexture > 0) {
        jx = (hash2(i + col * 19, row * 31 + (p.seed | 0), p.seed | 0) - 0.5) * 2 * p.printTexture * 0.011;
      }
      pts[i] = [pt[0] + nrm[0] * (amp + jx), pt[1] + nrm[1] * (amp + jx)];
    }
    return pts;
  }

  function ribbon(outline, cen, i0, i1, a0, a1) {
    var n = outline.length;
    var span = (i1 - i0 + n) % n;
    if (span < 4) span = 4;
    var out = [], k, i, p;
    for (k = 0; k <= span; k++) {
      i = (i0 + k) % n;
      out.push(lerpPt(outline[i], cen, a0));
    }
    for (k = span; k >= 0; k--) {
      i = (i0 + k) % n;
      out.push(lerpPt(outline[i], cen, a1));
    }
    return out;
  }

  function ellipsePts(cx, cy, rx, ry, n) {
    var pts = [], i, a;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return pts;
  }

  function neckLine(outline, t) {
    var beak = outline[0], i, p;
    for (i = 0; i < outline.length; i++) if (outline[i][0] < beak[0]) beak = outline[i];
    var c = centroid(outline);
    var mid = lerpPt(beak, c, 0.42 + 0.1 * t);
    var pts = [];
    for (i = 0; i <= 10; i++) {
      var u = i / 10;
      p = [
        lerp(beak[0], mid[0], u) + Math.sin(u * Math.PI) * 0.04 * t,
        lerp(beak[1], mid[1], u) + Math.sin(u * Math.PI * 1.6) * 0.03 * t
      ];
      pts.push(p);
    }
    return pts;
  }

  function innerCuts(outline, t, p) {
    var cuts = [];
    var cen = centroid(outline);
    var layers = Math.max(1, Math.round(p.featherLayers));
    var i, L, amt0, amt1, k;
    var n = outline.length;
    var spans = [
      [Math.round(n * 0.00), Math.round(n * 0.16)],
      [Math.round(n * 0.68), Math.round(n * 0.90)],
      [Math.round(n * 0.42), Math.round(n * 0.58)]
    ];
    var craneW = t * t;
    var batW = (1 - t) * (1 - t);

    if (batW > 0.04) {
      for (i = 0; i < PATHS.batHoles.length; i++) {
        cuts.push({ pts: PATHS.batHoles[i], alpha: batW * (i < 8 ? 1 : 0.75) });
      }
    }
    if (PATHS.craneHoles && PATHS.craneHoles[0] && craneW > 0.04) {
      cuts.push({ pts: PATHS.craneHoles[0], alpha: craneW });
    }

    var eyeHost = outline.reduce(function (a, pt) { return pt[0] < a[0] ? pt : a; });
    var eye = lerpPt(eyeHost, cen, 0.18);
    cuts.push({
      pts: ellipsePts(eye[0], eye[1] - 0.012, 0.016 + 0.004 * t, 0.014 + 0.003 * t, 12),
      alpha: 0.25 + 0.75 * t
    });

    for (L = 0; L < layers; L++) {
      amt0 = 0.055 + L * (0.038 + p.wingShape * 0.012);
      amt1 = amt0 + 0.014 + (1 - p.wingShape) * 0.006;
      for (k = 0; k < spans.length; k++) {
        if (k === 2 && t > 0.65) continue;
        var a0 = spans[k][0] + L * 2;
        var a1 = spans[k][1] - L * 2;
        cuts.push({
          pts: ribbon(outline, cen, a0, a1, amt0, amt1),
          alpha: lerp(0.12, 0.92, t) * (k === 2 ? (1 - t) : 1)
        });
      }
    }

    if (t > 0.25) {
      cuts.push({ pts: ribbon(outline, cen, Math.round(n * 0.22), Math.round(n * 0.34), 0.12, 0.16), alpha: (t - 0.25) / 0.75 });
    }
    return cuts;
  }

  function pathPoly(ctx, pts, close) {
    if (!pts || pts.length < 2) return;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (close) ctx.closePath();
  }

  function drawFigure(ctx, x, y, size, t, fill, ground, p, col, row, strokeW) {
    var outline = morphOutline(t, p, col, row);
    var cuts = innerCuts(outline, t, p);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.beginPath();
    pathPoly(ctx, outline, true);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    pathPoly(ctx, outline, true);
    ctx.clip();
    var i, c;
    for (i = 0; i < cuts.length; i++) {
      c = cuts[i];
      if (c.alpha < 0.05) continue;
      ctx.globalAlpha = clamp(c.alpha, 0, 1);
      ctx.beginPath();
      pathPoly(ctx, c.pts, true);
      ctx.fillStyle = ground;
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    if (p.outline && strokeW > 0) {
      ctx.beginPath();
      pathPoly(ctx, outline, true);
      ctx.strokeStyle = ground;
      ctx.lineWidth = strokeW / size;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    if (t > 0.4) {
      var neck = neckLine(outline, t);
      ctx.globalAlpha = (t - 0.4) / 0.6 * 0.85;
      ctx.beginPath();
      pathPoly(ctx, neck, false);
      ctx.strokeStyle = ground;
      ctx.lineWidth = 0.012;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function shapeT(yN, p) {
    var a = p.transitionPos - p.transitionWidth * 0.5;
    var b = p.transitionPos + p.transitionWidth * 0.5;
    var hard = yN < p.transitionPos ? 0 : 1;
    var soft = smoothstep(a, b, yN);
    return lerp(hard, soft, p.morphRatio);
  }

  function occupancyAt(yN, p) {
    var d = Math.abs(yN - p.transitionPos);
    var near = 1 - smoothstep(p.transitionWidth * 0.22, 0.58, d);
    var count = yN < p.transitionPos ? p.batCount : p.craneCount;
    var countFac = clamp(count / 36, 0.18, 2.1);
    var base = 0.10 + p.density * 0.5;
    return clamp((base * 0.28 + near * (0.35 + p.density * 0.72)) * countFac, 0.045, 1);
  }

  var noiseCanvas = null;
  var noiseSeed = null;
  function getNoisePattern(seed) {
    if (noiseCanvas && noiseSeed === seed) return noiseCanvas;
    var n = 192, c = document.createElement("canvas");
    c.width = c.height = n;
    var g = c.getContext("2d");
    var img = g.createImageData(n, n);
    var d = img.data, i, x, y, v, s;
    for (y = 0; y < n; y++) {
      for (x = 0; x < n; x++) {
        v = valueNoise(x / 18, y / 18, seed) * 0.55
          + valueNoise(x / 7, y / 7, seed + 17) * 0.3
          + valueNoise(x / 3, y / 3, seed + 41) * 0.15;
        s = Math.floor(v * 255);
        i = (y * n + x) * 4;
        d[i] = d[i + 1] = d[i + 2] = s;
        d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    noiseCanvas = c;
    noiseSeed = seed;
    return c;
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function drawTexture(ctx, w, h, p, paper, ink) {
    if (p.printTexture < 0.02) return;
    var tile = getNoisePattern(p.seed | 0);
    ctx.save();
    ctx.globalAlpha = p.printTexture * 0.22;
    ctx.globalCompositeOperation = "multiply";
    var pat = ctx.createPattern(tile, "repeat");
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = p.printTexture * 0.12;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    var rng = mulberry32((p.seed | 0) ^ 0xA5A5);
    var blot = Math.round(40 + p.printTexture * 90);
    var i, x, y, r;
    ctx.save();
    ctx.globalAlpha = p.printTexture * 0.07;
    ctx.fillStyle = ink;
    for (i = 0; i < blot; i++) {
      x = rng() * w;
      y = rng() * h;
      r = (0.4 + rng() * 2.2) * (w / 800);
      ctx.beginPath();
      ctx.ellipse(x, y, r * (0.7 + rng()), r * (0.5 + rng()), rng() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function wrapText(ctx, text, maxW) {
    var words = String(text || "").split(/\s+/), lines = [], line = "", i, test;
    if (!words[0]) return [""];
    for (i = 0; i < words.length; i++) {
      test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawType(ctx, W, H, typeH, p, paper, ink) {
    var y0 = H - typeH;
    ctx.fillStyle = ink;
    ctx.fillRect(0, y0, W, typeH);
    var pad = W * (p.typePad / 100);
    var align = p.typeAlign;
    var x = align === "left" ? pad : align === "right" ? W - pad : W / 2;
    ctx.textAlign = align === "left" ? "left" : align === "right" ? "right" : "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = paper;
    var tracking = p.typeTracking * (W / 800);
    try { ctx.letterSpacing = tracking + "px"; } catch (e) {}
    var titlePx = W * (p.titleSize / 100);
    var subPx = W * (p.subSize / 100);
    var bodyPx = W * (p.bodySize / 100);
    var datePx = bodyPx * 0.95;
    var leading = p.typeLeading;
    var y = y0 + typeH * 0.14;
    ctx.font = "600 " + titlePx + "px 'Songti SC','STSong','SimSun','Noto Serif SC',serif";
    ctx.fillText(p.titleZh || "", x, y);
    y += titlePx * leading * 0.95;
    ctx.font = "italic " + subPx + "px Palatino,Palatino Linotype,Georgia,'Times New Roman',serif";
    ctx.fillText(p.subtitleEn || "", x, y);
    y += subPx * leading * 1.05;
    ctx.font = "400 " + bodyPx + "px Georgia,'Songti SC','SimSun',serif";
    ctx.fillText(p.author || "", x, y);
    y += bodyPx * leading * 1.15;
    var lines = wrapText(ctx, p.description || "", W - pad * 2);
    var i;
    for (i = 0; i < lines.length && i < 4; i++) {
      ctx.fillText(lines[i], x, y);
      y += bodyPx * leading;
    }
    ctx.font = "italic " + datePx + "px Palatino,Georgia,'Times New Roman',serif";
    ctx.textBaseline = "bottom";
    ctx.fillText(p.date || todayStamp(), x, H - typeH * 0.12);
    try { ctx.letterSpacing = "0px"; } catch (e) {}
  }

  function drawPoster(ctx, W, H, p) {
    var paper = p.invert ? p.ink : p.paper;
    var ink = p.invert ? p.paper : p.ink;
    var typeH = H * (p.typeBlock / 100);
    var artH = H - typeH;
    var artW = W;

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    var split = clamp(p.transitionPos, 0.12, 0.88) * artH;
    var band = Math.max(8, p.transitionWidth * artH);
    var grd = ctx.createLinearGradient(0, split - band * 0.35, 0, split + band * 0.45);
    grd.addColorStop(0, paper);
    grd.addColorStop(0.45, paper);
    grd.addColorStop(1, ink);
    ctx.fillStyle = grd;
    ctx.fillRect(0, split - band * 0.35, W, artH - (split - band * 0.35) + 2);
    ctx.fillStyle = ink;
    ctx.fillRect(0, split + band * 0.45, W, artH);

    var cols = clamp(Math.round(5 + p.density * 11), 5, 16);
    var rows = clamp(Math.round(9 + p.density * 15), 8, 26);
    var pitchX = (artW / cols) * p.spacing;
    var pitchY = (artH / rows) * p.spacing;
    var gridW = (cols - 0.5) * pitchX;
    var gridH = rows * pitchY;
    var originX = (artW - gridW) / 2;
    var originY = (artH - gridH) / 2 + pitchY * 0.15;
    var figSize = p.scale * Math.min(pitchX, pitchY) * 0.92;
    var strokeW = p.outlineW * (W / 800);

    var row, col, x, y, yN, t, occ, live, fill, ground, sizeJ, t2, x2, y2;
    for (row = 0; row < rows; row++) {
      y = originY + (row + 0.5) * pitchY;
      if (y < -pitchY || y > artH + pitchY * 0.2) continue;
      yN = clamp(y / artH, 0, 1);
      t = shapeT(yN, p);
      occ = occupancyAt(yN, p);
      for (col = 0; col < cols; col++) {
        x = originX + (col + 0.5 + (row % 2) * 0.5) * pitchX;
        if (x < -pitchX * 0.2 || x > artW + pitchX * 0.2) continue;
        live = hash2(col + 3, row + 11, p.seed | 0) < occ;
        if (!live) {
          if (!(row === 0 && col === Math.floor(cols / 2))) {
            if (!(row === rows - 1 && col === Math.floor(cols / 2))) continue;
          }
        }
        fill = t < 0.5 ? ink : paper;
        ground = t < 0.5 ? paper : ink;
        sizeJ = figSize * (0.92 + hash2(col, row, (p.seed | 0) + 99) * 0.16);
        drawFigure(ctx, x, y, sizeJ, t, fill, ground, p, col, row, strokeW);

        if (p.interlace > 0.04 && occ > 0.28) {
          x2 = x + pitchX * 0.48 * p.interlace;
          y2 = y + pitchY * 0.40 * p.interlace;
          if (y2 < artH - 4 && x2 < artW - 4) {
            t2 = clamp(1 - t + (0.5 - t) * 0.15, 0, 1);
            t2 = lerp(t, t2, p.interlace);
            fill = t2 < 0.5 ? ink : paper;
            ground = t2 < 0.5 ? paper : ink;
            drawFigure(ctx, x2, y2, sizeJ * 0.92, t2, fill, ground, p, col + 50, row + 50, strokeW);
          }
        }
      }
    }

    drawTexture(ctx, W, H, p, paper, ink);
    ctx.fillStyle = ink;
    ctx.fillRect(0, artH - 1, W, typeH + 2);
    drawType(ctx, W, H, typeH, p, paper, ink);
  }

  var DEFAULTS = {
    seed: 8105,
    paper: "#f3ead8",
    ink: "#14110e",
    invert: false,
    batCount: 28,
    craneCount: 28,
    density: 0.62,
    scale: 1.08,
    spacing: 1.0,
    transitionPos: 0.46,
    transitionWidth: 0.32,
    morphRatio: 0.88,
    wingShape: 0.45,
    featherLayers: 5,
    ruyiCurves: 0.7,
    interlace: 0.75,
    outline: false,
    outlineW: 0.7,
    printTexture: 0.42,
    titleZh: "福鹤",
    subtitleEn: "Fu He",
    author: "汪俏黎 / WANG QIALI",
    description: "Paper-cut tessellation. Edit this description.",
    date: todayStamp(),
    titleSize: 5.4,
    subSize: 2.15,
    bodySize: 1.45,
    typeTracking: 0.6,
    typeLeading: 1.35,
    typeBlock: 18.5,
    typeAlign: "center",
    typePad: 7
  };

  var PARAM_KEYS = Object.keys(DEFAULTS);
  var BOOL_KEYS = { invert: 1, outline: 1 };
  var params = {};
  var preview, raf = 0, dirty = true;

  function copyDefaults() {
    var o = {}, k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    return o;
  }

  function el(id) { return document.getElementById(id); }

  function readUI() {
    var k, node, v;
    for (k = 0; k < PARAM_KEYS.length; k++) {
      node = el(PARAM_KEYS[k]);
      if (!node) continue;
      if (BOOL_KEYS[PARAM_KEYS[k]]) params[PARAM_KEYS[k]] = !!node.checked;
      else if (node.type === "range" || node.type === "number") {
        v = parseFloat(node.value);
        params[PARAM_KEYS[k]] = isNaN(v) ? DEFAULTS[PARAM_KEYS[k]] : v;
      } else params[PARAM_KEYS[k]] = node.value;
    }
    if (!String(params.date || "").trim()) params.date = todayStamp();
    updateValLabels();
  }

  function writeUI() {
    var k, node;
    for (k = 0; k < PARAM_KEYS.length; k++) {
      node = el(PARAM_KEYS[k]);
      if (!node) continue;
      if (BOOL_KEYS[PARAM_KEYS[k]]) node.checked = !!params[PARAM_KEYS[k]];
      else node.value = params[PARAM_KEYS[k]];
    }
    updateValLabels();
  }

  function updateValLabels() {
    var nodes = document.querySelectorAll("[data-for]");
    var i, id, node, v;
    for (i = 0; i < nodes.length; i++) {
      id = nodes[i].getAttribute("data-for");
      node = el(id);
      if (!node) continue;
      v = node.type === "checkbox" ? (node.checked ? "on" : "off") : node.value;
      nodes[i].textContent = v;
    }
  }

  function schedule() {
    dirty = true;
    if (!raf) raf = requestAnimationFrame(redraw);
  }

  function redraw() {
    raf = 0;
    if (!dirty) return;
    dirty = false;
    readUI();
    var ctx = preview.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, preview.width, preview.height);
    drawPoster(ctx, preview.width, preview.height, params);
  }

  function exportPNG() {
    readUI();
    var c = document.createElement("canvas");
    c.width = EXPORT_W;
    c.height = EXPORT_H;
    var ctx = c.getContext("2d");
    drawPoster(ctx, EXPORT_W, EXPORT_H, params);
    var status = el("exportStatus");
    if (status) status.textContent = "Exporting " + EXPORT_W + "×" + EXPORT_H + "…";
    c.toBlob(function (blob) {
      if (!blob) {
        if (status) status.textContent = "Export failed.";
        return;
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "wang-qiali-fuhe-poster.png";
      a.click();
      URL.revokeObjectURL(a.href);
      if (status) status.textContent = "Saved " + EXPORT_W + "×" + EXPORT_H + " PNG.";
    }, "image/png");
  }

  function exportJSON() {
    readUI();
    var blob = new Blob([JSON.stringify(params, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wang-qiali-fuhe-params.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJSONFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var k;
        params = copyDefaults();
        for (k in data) if (PARAM_KEYS.indexOf(k) >= 0) params[k] = data[k];
        writeUI();
        schedule();
      } catch (err) {
        var status = el("exportStatus");
        if (status) status.textContent = "JSON could not be read.";
      }
    };
    reader.readAsText(file);
  }

  function randomize() {
    var rng = Math.random;
    params = copyDefaults();
    params.seed = 1 + Math.floor(rng() * 99998);
    params.density = 0.35 + rng() * 0.55;
    params.spacing = 0.82 + rng() * 0.4;
    params.scale = 0.85 + rng() * 0.5;
    params.transitionPos = 0.34 + rng() * 0.28;
    params.transitionWidth = 0.18 + rng() * 0.28;
    params.morphRatio = 0.45 + rng() * 0.55;
    params.wingShape = rng();
    params.featherLayers = 2 + Math.floor(rng() * 8);
    params.ruyiCurves = rng();
    params.interlace = rng();
    params.batCount = 10 + Math.floor(rng() * 50);
    params.craneCount = 10 + Math.floor(rng() * 50);
    params.printTexture = 0.15 + rng() * 0.6;
    writeUI();
    noiseCanvas = null;
    schedule();
  }

  function reset() {
    params = copyDefaults();
    writeUI();
    noiseCanvas = null;
    schedule();
  }

  function on(id, type, fn) {
    var n = el(id);
    if (n) n.addEventListener(type, fn);
  }

  function bind() {
    var form = el("panel");
    if (form) {
      form.addEventListener("input", function (e) {
        if (e.target && e.target.id === "seed") noiseCanvas = null;
        schedule();
      });
      form.addEventListener("change", function () { schedule(); });
    }
    on("reset", "click", reset);
    on("randomize", "click", randomize);
    on("exportPng", "click", exportPNG);
    on("exportJson", "click", exportJSON);
    on("importBtn", "click", function () { el("importJson").click(); });
    on("importJson", "change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) importJSONFile(f);
      e.target.value = "";
    });
    on("hidePanel", "click", function () {
      document.body.classList.add("panel-off");
    });
    on("showPanel", "click", function () {
      document.body.classList.remove("panel-off");
    });
    on("fullscreen", "click", function () {
      var stage = el("stage");
      if (!stage) return;
      if (!document.fullscreenElement) {
        if (stage.requestFullscreen) stage.requestFullscreen();
        else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
      } else if (document.exitFullscreen) document.exitFullscreen();
    });
    document.addEventListener("fullscreenchange", function () {
      schedule();
    });
  }

  function init() {
    if (!PATHS || !PATHS.bat || !PATHS.crane) {
      document.body.innerHTML = "<p style='padding:2em'>paths.js failed to load. Keep index.html, paths.js and poster.js in the same folder.</p>";
      return;
    }
    preview = el("poster");
    params = copyDefaults();
    bind();
    if (!preview) return;
    preview.width = PREVIEW_W;
    preview.height = PREVIEW_H;
    writeUI();
    schedule();
  }

  window.FuHePoster = { drawPoster: drawPoster, defaults: DEFAULTS, exportSize: [EXPORT_W, EXPORT_H] };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
