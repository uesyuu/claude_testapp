// ============================================================
//  Megaminx Visualizer
//  Ported from https://gist.github.com/kusano/2c2e7f075a7f55c126b96e89b7759be2
// ============================================================

const PI = Math.PI;

// --- Color definitions (12 colors for 12 faces) ---
const COLOR_DEFS = [
  { key: 'W', hex: '#ffffff', label: '白' },
  { key: 'B', hex: '#0808f8', label: '青' },
  { key: 'R', hex: '#f80808', label: '赤' },
  { key: 'G', hex: '#088008', label: '緑' },
  { key: 'P', hex: '#800880', label: '紫' },
  { key: 'Y', hex: '#ffff00', label: '黄' },
  { key: 'w', hex: '#c0c0c0', label: '銀' },
  { key: 'y', hex: '#ffffc0', label: '薄黄' },
  { key: 'p', hex: '#f88080', label: 'ピンク' },
  { key: 'g', hex: '#80f880', label: '薄緑' },
  { key: 'r', hex: '#f88008', label: '橙' },
  { key: 'b', hex: '#80c0f8', label: '水色' },
];

const COLOR_MAP = {};
COLOR_DEFS.forEach(c => { COLOR_MAP[c.key] = c.hex; });

// Solved state: each face i uses COLOR_DEFS[i].key for all 11 stickers
const SOLVED_STATE = COLOR_DEFS.map(c => c.key.repeat(11)).join('');

let state = SOLVED_STATE.split('');
let selectedColor = 'W';

// ============================================================
//  3D Geometry (from original Python script)
// ============================================================
function buildGeometry() {
  const d54 = 54 / 180 * PI;
  const L1 = (1 + Math.sin(d54)) / (2 * Math.cos(d54));
  const R = 1 / (2 * Math.cos(d54));
  const a = Math.acos(Math.sin(d54) / (1 + Math.sin(d54)));
  const R1 = R * Math.sin(d54) + L1 * Math.cos(a);
  const H1 = L1 * Math.sin(a);
  const H2 = (R1 - R) * Math.sin(d54) * Math.tan(a);
  const H = (H1 + H2) / 2;

  const V = [];
  for (let i = 0; i < 5; i++) V.push([-R * Math.cos(i * 0.4 * PI), R * Math.sin(i * 0.4 * PI), H]);
  for (let i = 0; i < 5; i++) V.push([-R1 * Math.cos(i * 0.4 * PI), R1 * Math.sin(i * 0.4 * PI), H - H2]);
  for (let i = 0; i < 5; i++) V.push([-R1 * Math.cos((i * 0.4 + 0.2) * PI), R1 * Math.sin((i * 0.4 + 0.2) * PI), -H + H2]);
  for (let i = 0; i < 5; i++) V.push([-R * Math.cos((i * 0.4 + 0.2) * PI), R * Math.sin((i * 0.4 + 0.2) * PI), -H]);

  const S = [
    [0, 1, 2, 3, 4],
    [1, 0, 5, 10, 6],
    [2, 1, 6, 11, 7],
    [3, 2, 7, 12, 8],
    [4, 3, 8, 13, 9],
    [0, 4, 9, 14, 5],
    [17, 16, 15, 19, 18],
    [16, 17, 12, 7, 11],
    [15, 16, 11, 6, 10],
    [19, 15, 10, 5, 14],
    [18, 19, 14, 9, 13],
    [17, 18, 13, 8, 12],
  ];

  return { V, S };
}

const GEO = buildGeometry();

// Sticker index patterns within a face (indices into VF array)
const STICKER_PATTERNS = [
  [15, 16, 17, 18, 19],   // 0: center pentagon
  [0, 5, 15, 14],          // 1
  [5, 6, 16, 15],          // 2
  [1, 7, 16, 6],           // 3
  [7, 8, 17, 16],          // 4
  [2, 9, 17, 8],           // 5
  [9, 10, 18, 17],         // 6
  [3, 11, 18, 10],         // 7
  [11, 12, 19, 18],        // 8
  [4, 13, 19, 12],         // 9
  [13, 14, 15, 19],        // 10
];

// Build VF (expanded vertex array) from 5 base points
function buildVF(pts5) {
  const VF = [...pts5];
  for (let i = 0; i < 5; i++) {
    VF.push([
      VF[i][0] * 0.6 + VF[(i + 1) % 5][0] * 0.4,
      VF[i][1] * 0.6 + VF[(i + 1) % 5][1] * 0.4,
      VF[i][2] !== undefined ? VF[i][2] * 0.6 + VF[(i + 1) % 5][2] * 0.4 : 0,
    ]);
    VF.push([
      VF[i][0] * 0.4 + VF[(i + 1) % 5][0] * 0.6,
      VF[i][1] * 0.4 + VF[(i + 1) % 5][1] * 0.6,
      VF[i][2] !== undefined ? VF[i][2] * 0.4 + VF[(i + 1) % 5][2] * 0.6 : 0,
    ]);
  }
  for (let i = 0; i < 5; i++) {
    VF.push([
      VF[i * 2 + 5][0] + VF[(i * 2 + 9) % 10 + 5][0] - VF[i][0],
      VF[i * 2 + 5][1] + VF[(i * 2 + 9) % 10 + 5][1] - VF[i][1],
      VF[i][2] !== undefined
        ? VF[i * 2 + 5][2] + VF[(i * 2 + 9) % 10 + 5][2] - VF[i][2]
        : 0,
    ]);
  }
  return VF;
}

// ============================================================
//  3D render (perspective view) — ported directly from Python
// ============================================================
function trans3D(x, y, z, size, scale) {
  let t = PI * 0.05;
  [x, y] = [x * Math.cos(t) + y * Math.sin(t), -x * Math.sin(t) + y * Math.cos(t)];
  t = PI * 0.2;
  [x, z] = [x * Math.cos(t) + z * Math.sin(t), -x * Math.sin(t) + z * Math.cos(t)];
  const persp = 0.1;
  [x, y] = [y * (1 + x * persp), -z * (1 + x * persp)];
  return [size / 2 + x * scale, size / 2 + y * scale];
}

function drawPoly(ctx, pts, fill, strokeColor, lineWidth) {
  if (!pts || pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function render3D(canvas) {
  const size = canvas.width;
  const scale = size * 0.27;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  const VISIBLE_FACES = [0, 2, 3, 4, 7, 11];

  for (const si of VISIBLE_FACES) {
    const faceVerts3D = GEO.S[si].map(p => GEO.V[p]);
    const VF = buildVF(faceVerts3D);

    STICKER_PATTERNS.forEach((pattern, stickerIdx) => {
      const pts2D = pattern.map(idx => trans3D(VF[idx][0], VF[idx][1], VF[idx][2], size, scale));
      const colorKey = state[si * 11 + stickerIdx];
      drawPoly(ctx, pts2D, COLOR_MAP[colorKey] || '#404040', '#000', 1.5);
    });

    // Face outline
    const outline = GEO.S[si].map(p => trans3D(GEO.V[p][0], GEO.V[p][1], GEO.V[p][2], size, scale));
    drawPoly(ctx, outline, null, '#000', 3);
  }
}

// ============================================================
//  Net (展開図) — 2D layout, two flowers of 6 faces each
// ============================================================
const NET_R = 58; // circumradius of each pentagon in the net (pixels)

// Build 2D sticker polygons for a net face
// cx,cy = center, r = circumradius, rotDeg = rotation of first vertex (degrees)
function buildFaceNet2D(cx, cy, r, rotDeg) {
  const pts5 = [];
  for (let i = 0; i < 5; i++) {
    const a = (rotDeg + i * 72) * PI / 180;
    pts5.push([cx + r * Math.cos(a), cy + r * Math.sin(a), 0]);
  }
  const VF = buildVF(pts5);
  return STICKER_PATTERNS.map(p => p.map(idx => [VF[idx][0], VF[idx][1]]));
}

// Layout: two flowers (vertical = stacked top/bottom, horizontal = side by side)
function buildNetLayout(W, H, vertical) {
  const inradius = NET_R * Math.cos(PI / 5); // R*cos(36°)
  // Adjacent pentagon centers are at distance 2*inradius (exact edge-sharing)
  // and at angles -54+72*k° (= edge midpoint directions of the center pentagon with rot=-90)
  const dist = 2 * inradius;

  const layout = [];

  const flowers = vertical ? [
    { cx: W * 0.5,  cy: H * 0.26 },  // faces 0-5  (top)
    { cx: W * 0.5,  cy: H * 0.74 },  // faces 6-11 (bottom)
  ] : [
    { cx: W * 0.25, cy: H * 0.5  },  // faces 0-5  (left)
    { cx: W * 0.75, cy: H * 0.5  },  // faces 6-11 (right)
  ];

  flowers.forEach(({ cx, cy }, fi) => {
    const base = fi * 6;
    layout[base] = { cx, cy, rot: -90 };
    for (let i = 0; i < 5; i++) {
      // Edge midpoint directions of center face (rot=-90): -54, 18, 90, 162, 234 degrees
      const centerAngleDeg = -54 + 72 * i;
      const angleRad = centerAngleDeg * PI / 180;
      layout[base + 1 + i] = {
        cx: cx + dist * Math.cos(angleRad),
        cy: cy + dist * Math.sin(angleRad),
        // Each petal's first vertex points back toward the shared edge
        rot: 90 + 72 * i,
      };
    }
  });

  return layout;
}

let netLayout = null;
let hitAreas = []; // { si, stickerIdx, poly2D }
let netVertical = false; // current layout orientation

function buildNet(canvas) {
  netVertical = window.innerWidth < 860;
  if (netVertical) {
    canvas.width  = 360;
    canvas.height = 760;
  } else {
    canvas.width  = 720;
    canvas.height = 420;
  }

  const W = canvas.width, H = canvas.height;
  netLayout = buildNetLayout(W, H, netVertical);
  hitAreas = [];

  for (let si = 0; si < 12; si++) {
    const { cx, cy, rot } = netLayout[si];
    const stickers2D = buildFaceNet2D(cx, cy, NET_R, rot);
    stickers2D.forEach((poly2D, stickerIdx) => {
      hitAreas.push({ si, stickerIdx, poly2D });
    });
  }

  redrawNet(canvas);
}

function redrawNet(canvas) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f3460';
  ctx.fillRect(0, 0, W, H);

  // Divider line between two groups
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (netVertical) {
    ctx.moveTo(20,    H / 2);
    ctx.lineTo(W - 20, H / 2);
  } else {
    ctx.moveTo(W / 2, 20);
    ctx.lineTo(W / 2, H - 20);
  }
  ctx.stroke();

  // Labels for two groups
  ctx.fillStyle = 'rgba(168,216,234,0.6)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  if (netVertical) {
    ctx.fillText('上半分 (面0-5)',  W * 0.5, 16);
    ctx.fillText('下半分 (面6-11)', W * 0.5, H / 2 + 16);
  } else {
    ctx.fillText('上半分 (面0-5)',  W * 0.25, 16);
    ctx.fillText('下半分 (面6-11)', W * 0.75, 16);
  }

  for (let si = 0; si < 12; si++) {
    const { cx, cy, rot } = netLayout[si];
    const stickers2D = buildFaceNet2D(cx, cy, NET_R, rot);

    stickers2D.forEach((poly2D, stickerIdx) => {
      const colorKey = state[si * 11 + stickerIdx];
      drawPoly(ctx, poly2D, COLOR_MAP[colorKey] || '#404040', '#111', 1.2);
    });

    // Face outline
    const outline = [];
    for (let i = 0; i < 5; i++) {
      const a = (rot + i * 72) * PI / 180;
      outline.push([cx + NET_R * Math.cos(a), cy + NET_R * Math.sin(a)]);
    }
    drawPoly(ctx, outline, null, 'rgba(255,255,255,0.5)', 2);

    // Face label with color swatch
    const faceColor = COLOR_DEFS[si] || COLOR_DEFS[0];
    ctx.fillStyle = faceColor.hex;
    ctx.beginPath();
    ctx.arc(cx, cy - 6, 5, 0, 2 * PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`F${si}`, cx, cy + 8);
  }
}

// Point-in-polygon (ray casting)
function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function setupNetClick(netCanvas, previewCanvas) {
  netCanvas.addEventListener('click', e => {
    const rect = netCanvas.getBoundingClientRect();
    const scaleX = netCanvas.width / rect.width;
    const scaleY = netCanvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;

    // Iterate in reverse so top-drawn polygons win
    for (let i = hitAreas.length - 1; i >= 0; i--) {
      const { si, stickerIdx, poly2D } = hitAreas[i];
      if (pointInPolygon(px, py, poly2D)) {
        state[si * 11 + stickerIdx] = selectedColor;
        redrawNet(netCanvas);
        render3D(previewCanvas);
        break;
      }
    }
  });

  // Hover cursor
  netCanvas.addEventListener('mousemove', e => {
    const rect = netCanvas.getBoundingClientRect();
    const scaleX = netCanvas.width / rect.width;
    const scaleY = netCanvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    let hit = false;
    for (let i = hitAreas.length - 1; i >= 0; i--) {
      if (pointInPolygon(px, py, hitAreas[i].poly2D)) { hit = true; break; }
    }
    netCanvas.style.cursor = hit ? 'pointer' : 'default';
  });
}

// ============================================================
//  Color Palette UI
// ============================================================
function isColorDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function setupPalette() {
  const container = document.getElementById('palette');
  COLOR_DEFS.forEach(c => {
    const btn = document.createElement('div');
    btn.className = 'color-btn' + (c.key === selectedColor ? ' selected' : '');
    btn.style.background = c.hex;
    btn.style.color = isColorDark(c.hex) ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)';
    btn.title = `${c.label} (${c.key})`;
    btn.dataset.key = c.key;
    btn.textContent = c.label;

    btn.addEventListener('click', () => {
      selectedColor = c.key;
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    container.appendChild(btn);
  });
}

// ============================================================
//  Main
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const netCanvas = document.getElementById('net-canvas');
  const previewCanvas = document.getElementById('preview-canvas');

  setupPalette();
  buildNet(netCanvas);
  render3D(previewCanvas);
  setupNetClick(netCanvas, previewCanvas);

  document.getElementById('btn-solved').addEventListener('click', () => {
    state = SOLVED_STATE.split('');
    redrawNet(netCanvas);
    render3D(previewCanvas);
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    state = Array(132).fill(' ');
    redrawNet(netCanvas);
    render3D(previewCanvas);
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'megaminx.png';
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
  });

  // Rebuild net when crossing the mobile/desktop breakpoint
  let lastVertical = netVertical;
  window.addEventListener('resize', () => {
    const nowVertical = window.innerWidth < 860;
    if (nowVertical !== lastVertical) {
      lastVertical = nowVertical;
      buildNet(netCanvas);
    }
  });
});
