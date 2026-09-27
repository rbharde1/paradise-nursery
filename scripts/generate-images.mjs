/**
 * Generates the plant thumbnails and the landing-page background as SVG files.
 * Run with: npm run images
 *
 * Artwork is generated locally instead of linking to stock photos so the
 * deployed site never shows a broken thumbnail and has no external image
 * dependencies.
 *
 * Each plant declares a silhouette `style` plus a `variant` number. The variant
 * changes leaf counts, sizes and angles, so two plants that share a style still
 * read as different plants.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');
// The landing-page background lives in src/assets so Vite rewrites its URL in
// App.css and it keeps working when the site is served from a sub-path.
const assetDir = join(root, 'src', 'assets');
mkdirSync(outDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const pot = (potA, potB, shape) => {
  const body =
    shape === 'tall'
      ? 'M144 262 h112 l-10 116 a14 14 0 0 1 -14 12 h-50 a14 14 0 0 1 -14 -12 z'
      : shape === 'bowl'
        ? 'M132 268 h136 l-22 74 a16 16 0 0 1 -16 12 h-44 a16 16 0 0 1 -16 -12 z'
        : 'M138 268 h124 l-16 104 a14 14 0 0 1 -14 12 h-64 a14 14 0 0 1 -14 -12 z';
  const rimW = shape === 'bowl' ? 152 : shape === 'tall' ? 132 : 144;
  const rimX = 200 - rimW / 2;

  return `
  <defs>
    <linearGradient id="pot" x1="138" y1="268" x2="262" y2="384" gradientUnits="userSpaceOnUse">
      <stop stop-color="${potA}"/><stop offset="1" stop-color="${potB}"/>
    </linearGradient>
  </defs>
  <path d="${body}" fill="url(#pot)"/>
  <rect x="${rimX}" y="250" width="${rimW}" height="26" rx="10" fill="${potB}"/>
  <rect x="${rimX}" y="250" width="${rimW}" height="10" rx="5" fill="#ffffff" opacity="0.18"/>`;
};

const leaf = (cx, cy, rx, ry, rot, fill) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${fill}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;

const stem = (x1, y1, x2, y2, color) =>
  `<path d="M${x1} ${y1} Q ${((x1 + x2) / 2).toFixed(1)} ${((y1 + y2) / 2 - 20).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/>`;

const styles = {
  // Tall sword-shaped blades: snake plant, ZZ plant, cast iron, dracaena
  upright(c, v) {
    const count = [6, 7, 5, 8][v % 4];
    const spread = [26, 34, 20, 30][v % 4];
    const base = [96, 112, 132, 88][v % 4];

    return Array.from({ length: count }, (_, i) => {
      const a = -spread + (i * (spread * 2)) / (count - 1);
      const h = base + ((i + v) % 3) * 22;
      return `<path d="M200 262 q ${(a * 1.6).toFixed(1)} -${h} ${(a * 2.2).toFixed(1)} -${(h * 1.45).toFixed(1)} q ${8 + ((i + v) % 2) * 5} ${(h * 0.3).toFixed(1)} ${(-a * 0.6 + 10).toFixed(1)} ${(h * 1.2).toFixed(1)} z" fill="${i % 2 ? c.mid : c.dark}"/>`;
    }).join('\n  ');
  },

  // Vines spilling over the rim: pothos, philodendron
  trailing(c, v) {
    const drop = [74, 104][v % 2];
    const reach = [104, 88][v % 2];
    const size = [24, 19][v % 2];

    const vine = (s) => {
      let out = `<path d="M200 258 q ${70 * s} -64 ${reach * s} 10 q ${18 * s} 44 ${-10 * s} ${drop}" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      const pts = [
        [200 + 40 * s, 226],
        [200 + (reach - 26) * s, 208],
        [200 + reach * s, 236],
        [200 + (reach + 6) * s, 282],
        [200 + (reach - 8) * s, 244 + drop * 0.72],
      ];
      pts.forEach(([x, y], i) => {
        out += '\n  ' + leaf(x, y, size, size * 0.72, 20 * s + i * 12, i % 2 ? c.mid : c.light);
      });
      return out;
    };

    return vine(1) + '\n  ' + vine(-1) + '\n  ' + leaf(200, 214, size + 2, size * 0.78, 0, c.dark);
  },

  // Big glossy leaves: monstera, rubber plant, fiddle leaf fig, peace lily
  broad(c, v) {
    const layouts = [
      // wide and low — monstera
      [[142, 214, 50, 36, -34], [258, 214, 50, 36, 34], [168, 156, 45, 33, -16], [236, 154, 45, 33, 18], [200, 114, 42, 34, 0]],
      // tall and narrow — fiddle leaf fig
      [[160, 210, 38, 30, -20], [242, 206, 38, 30, 22], [176, 148, 36, 30, -10], [228, 142, 36, 30, 12], [202, 92, 38, 34, 0], [200, 178, 30, 24, 0]],
      // compact rosette — rubber plant
      [[150, 224, 44, 30, -40], [250, 224, 44, 30, 40], [166, 168, 42, 30, -18], [236, 166, 42, 30, 20], [200, 138, 40, 30, 0]],
      // airy and upright — peace lily
      [[156, 200, 34, 44, -24], [244, 200, 34, 44, 24], [180, 146, 32, 42, -12], [222, 144, 32, 42, 14], [201, 108, 32, 44, 0]],
    ];
    const specs = layouts[v % layouts.length].map((s, i) => [...s, i % 2 ? c.mid : c.dark]);
    specs[specs.length - 1][5] = c.light;

    const stems = specs.map(([x, y]) => stem(200, 262, x, y, c.dark)).join('\n  ');
    const blades = specs.map((s) => leaf(...s)).join('\n  ');
    const veins = specs
      .map(([x, y, , ry, r]) => `<path d="M${x} ${(y - ry * 0.7).toFixed(1)} L${x} ${(y + ry * 0.7).toFixed(1)}" stroke="#0c2f1d" stroke-width="2" opacity="0.28" transform="rotate(${r} ${x} ${y})"/>`)
      .join('\n  ');

    return `${stems}\n  ${blades}\n  ${veins}`;
  },

  // Dense mound of small leaves: fern, jade, chinese evergreen
  bushy(c, v) {
    const count = [26, 20, 32][v % 3];
    const rx = [22, 17, 26][v % 3];
    const squash = [0.62, 0.8, 0.5][v % 3];
    const leaves = [];

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 54 + ((i + v) % 4) * 16;
      const x = 200 + Math.cos(a) * r;
      const y = 196 + Math.sin(a) * r * squash;
      leaves.push(leaf(x, y, rx, rx * 0.5, (a * 180) / Math.PI, [c.dark, c.mid, c.light][i % 3]));
    }

    return leaves.join('\n  ') + `\n  <ellipse cx="200" cy="200" rx="46" ry="30" fill="${c.dark}"/>`;
  },

  // Rosette of pointed leaves: aloe vera, spider plant
  spiky(c, v) {
    const count = [8, 11][v % 2];
    const spread = [62, 78][v % 2];
    const base = [118, 96][v % 2];
    const width = [12, 8][v % 2];

    return Array.from({ length: count }, (_, i) => {
      const a = -spread + (i * (spread * 2)) / (count - 1);
      const len = base + ((i + v) % 3) * 20;
      const rad = ((a - 90) * Math.PI) / 180;
      const x = 200 + Math.cos(rad) * len;
      const y = 258 + Math.sin(rad) * len;
      return `<path d="M${200 - width} 264 L${x.toFixed(1)} ${y.toFixed(1)} L${200 + width} 264 z" fill="${i % 2 ? c.mid : c.dark}"/>`;
    }).join('\n  ');
  },

  // Arching fronds: palms, bird of paradise
  palm(c, v) {
    const count = [6, 5, 7][v % 3];
    const spread = [56, 68, 48][v % 3];
    const base = [128, 146, 112][v % 3];
    const leafLen = [26, 32, 20][v % 3];

    const frond = (a, len, fill) => {
      const rad = ((a - 90) * Math.PI) / 180;
      const tipX = 200 + Math.cos(rad) * len;
      const tipY = 258 + Math.sin(rad) * len;
      let out = `<path d="M200 258 Q ${((200 + tipX) / 2 + 14).toFixed(1)} ${((258 + tipY) / 2 - 10).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}" stroke="${c.dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      for (let t = 0.3; t <= 0.95; t += 0.16) {
        const px = 200 + (tipX - 200) * t;
        const py = 258 + (tipY - 258) * t;
        out += '\n  ' + leaf(px, py, leafLen, leafLen * 0.3, a + 62, fill) + '\n  ' + leaf(px, py, leafLen, leafLen * 0.3, a - 62, fill);
      }
      return out;
    };

    return Array.from({ length: count }, (_, i) => {
      const a = -spread + (i * (spread * 2)) / (count - 1);
      return frond(a, base + ((i + v) % 3) * 18, i % 2 ? c.mid : c.light);
    }).join('\n  ');
  },
};

// [name, style, variant, colors, potA, potB, potShape]
const plants = [
  ['snake-plant', 'upright', 0, { dark: '#1f5b3a', mid: '#2f7a4c', light: '#8fbf6a' }, '#c9744a', '#a85a36', 'tall'],
  ['spider-plant', 'spiky', 1, { dark: '#3f8a4f', mid: '#6fb069', light: '#b9d98d' }, '#d8d2c6', '#b4ac9c', 'standard'],
  ['peace-lily', 'broad', 3, { dark: '#1d5136', mid: '#2e7047', light: '#4f9160' }, '#e2e5e8', '#b9bfc6', 'standard'],
  ['boston-fern', 'bushy', 2, { dark: '#2a6b3c', mid: '#4b9053', light: '#7fba6b' }, '#b98a5e', '#946b44', 'bowl'],
  ['rubber-plant', 'broad', 2, { dark: '#15402c', mid: '#24603d', light: '#3d7c4e' }, '#5f6b74', '#454f57', 'standard'],
  ['aloe-vera', 'spiky', 0, { dark: '#4f8a5c', mid: '#79ac74', light: '#a6cb92' }, '#d99a63', '#b8763f', 'bowl'],
  ['zz-plant', 'upright', 1, { dark: '#174a30', mid: '#256b40', light: '#398950' }, '#2f3a42', '#1e262c', 'standard'],
  ['pothos', 'trailing', 0, { dark: '#2d6b3f', mid: '#57975a', light: '#9cc47a' }, '#c9a06b', '#a37a48', 'standard'],
  ['cast-iron-plant', 'upright', 2, { dark: '#1b4f34', mid: '#2b6b42', light: '#3f8752' }, '#8d8f93', '#6a6d72', 'tall'],
  ['jade-plant', 'bushy', 1, { dark: '#3d7a4a', mid: '#63a05e', light: '#9ac57f' }, '#e0c9a6', '#bfa47c', 'bowl'],
  ['chinese-evergreen', 'bushy', 0, { dark: '#2b6440', mid: '#4f8d5a', light: '#c3d9a8' }, '#b2564f', '#8e3f3a', 'standard'],
  ['philodendron', 'trailing', 1, { dark: '#225c3a', mid: '#3d8049', light: '#74ac68' }, '#7e6a58', '#5d4d3f', 'standard'],
  ['monstera', 'broad', 0, { dark: '#194f33', mid: '#2a6d42', light: '#3f8a52' }, '#d8cbb8', '#b3a288', 'standard'],
  ['fiddle-leaf-fig', 'broad', 1, { dark: '#1c5535', mid: '#2d7244', light: '#478f57' }, '#e6ded2', '#c2b6a5', 'tall'],
  ['bird-of-paradise', 'palm', 1, { dark: '#1e5a38', mid: '#2f7846', light: '#57a05d' }, '#d2743f', '#ab5629', 'tall'],
  ['majesty-palm', 'palm', 0, { dark: '#276b3f', mid: '#448c4e', light: '#79b56c' }, '#c2b49c', '#9c8e76', 'standard'],
  ['dracaena', 'upright', 3, { dark: '#1f5738', mid: '#347044', light: '#9c4b46' }, '#6d7b84', '#4d5960', 'tall'],
  ['parlor-palm', 'palm', 2, { dark: '#2c6e42', mid: '#4d9256', light: '#86bd74' }, '#cfd6cd', '#a8b1a7', 'bowl'],
];

for (const [name, style, variant, colors, potA, potB, potShape] of plants) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">
  <rect width="400" height="400" fill="#f3f8f1"/>
  <circle cx="200" cy="196" r="150" fill="#e4f0e2"/>
  ${styles[style](colors, variant)}
  ${pot(potA, potB, potShape)}
</svg>`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
}

// Landing-page background: a soft canopy of leaves over layered hills.
const canopy = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 137) % 1600;
  const y = ((i * 91) % 240) - 40;
  const r = 18 + ((i * 37) % 44);
  const rot = (i * 53) % 180;
  const op = (0.18 + (i % 5) * 0.07).toFixed(2);
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * 0.52).toFixed(1)}" fill="#0f3b26" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`;
}).join('\n  ');

writeFileSync(
  join(assetDir, 'hero-bg.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d3b2a"/><stop offset="0.55" stop-color="#1d6b45"/><stop offset="1" stop-color="#3f9c62"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#d7f2c9" stop-opacity="0.45"/><stop offset="1" stop-color="#d7f2c9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  ${canopy}
  <path d="M0 720 Q 400 620 800 700 T 1600 660 L1600 900 L0 900 Z" fill="#0c3421" opacity="0.72"/>
  <path d="M0 800 Q 380 730 760 790 T 1600 760 L1600 900 L0 900 Z" fill="#082518" opacity="0.85"/>
</svg>`
);

console.log(`Generated ${plants.length} plant thumbnails + hero background`);
