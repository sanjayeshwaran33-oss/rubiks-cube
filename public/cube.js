import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Scene ────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3.5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.08;
orbitControls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
orbitControls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const d1 = new THREE.DirectionalLight(0xffffff, 0.8); d1.position.set(5, 10, 7); scene.add(d1);
const d2 = new THREE.DirectionalLight(0x8888ff, 0.3); d2.position.set(-5, -3, -5); scene.add(d2);

// ── Colors ───────────────────────────────────────────────
const C = { R: 0xb71234, O: 0xff5800, W: 0xffffff, Y: 0xffd500, G: 0x009b48, B: 0x0046ad, I: 0x1a1a1a };
const GAP = 1.0;

function createCubie(x, y, z) {
  const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95).toNonIndexed();
  const fc = [
    x === 1 ? C.R : C.I, x === -1 ? C.O : C.I,
    y === 1 ? C.W : C.I, y === -1 ? C.Y : C.I,
    z === 1 ? C.G : C.I, z === -1 ? C.B : C.I
  ];
  const colors = [];
  const c = new THREE.Color();
  for (let f = 0; f < 6; f++) { c.setHex(fc[f]); for (let v = 0; v < 6; v++) colors.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.05 }));
  mesh.position.set(x * GAP, y * GAP, z * GAP);
  mesh.userData.isCubie = true;
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.95, 0.95, 0.95));
  mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 })));
  return mesh;
}

// ── Build ────────────────────────────────────────────────
const allCubies = [];
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

function buildCube() {
  while (cubeGroup.children.length) { const ch = cubeGroup.children[0]; cubeGroup.remove(ch); ch.geometry?.dispose(); ch.material?.dispose(); }
  allCubies.length = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const cb = createCubie(x, y, z);
        cubeGroup.add(cb);
        allCubies.push(cb);
      }
}
buildCube();

// ── Layer Rotation ───────────────────────────────────────
let isAnimating = false;

function getCubiesInLayer(axis, val) {
  return allCubies.filter(cb => {
    const wp = new THREE.Vector3();
    cb.getWorldPosition(wp);
    cubeGroup.worldToLocal(wp);
    const v = axis === 'x' ? wp.x : axis === 'y' ? wp.y : wp.z;
    return Math.abs(v - val * GAP) < 0.4;
  });
}

function rotateLayer(axis, val, angle, dur = 300) {
  return new Promise(resolve => {
    if (isAnimating) { resolve(); return; }
    isAnimating = true;
    const cubies = getCubiesInLayer(axis, val);
    if (!cubies.length) { isAnimating = false; resolve(); return; }

    const pivot = new THREE.Group();
    cubeGroup.add(pivot);
    cubies.forEach(cb => { cubeGroup.remove(cb); pivot.add(cb); });

    const ra = new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0);
    const t0 = performance.now();
    const sq = pivot.quaternion.clone();
    const eq = new THREE.Quaternion().setFromAxisAngle(ra, angle).multiply(sq);

    function tick(now) {
      const t = Math.min((now - t0) / dur, 1);
      pivot.quaternion.slerpQuaternions(sq, eq, 1 - Math.pow(1 - t, 3));
      if (t < 1) { requestAnimationFrame(tick); return; }

      pivot.quaternion.copy(eq);
      pivot.updateMatrixWorld(true);
      cubies.forEach(cb => {
        const wp = new THREE.Vector3(), wq = new THREE.Quaternion();
        cb.getWorldPosition(wp); cb.getWorldQuaternion(wq);
        pivot.remove(cb); cubeGroup.add(cb);
        cubeGroup.worldToLocal(wp);
        wp.x = Math.round(wp.x / GAP) * GAP;
        wp.y = Math.round(wp.y / GAP) * GAP;
        wp.z = Math.round(wp.z / GAP) * GAP;
        cb.position.copy(wp); cb.quaternion.copy(wq);
      });
      cubeGroup.remove(pivot);
      isAnimating = false;

      // Track moves for timer
      if (typeof window.rubiksMoveCount === 'number') window.rubiksMoveCount++;
      resolve();
    }
    requestAnimationFrame(tick);
  });
}

// ── Mouse Interaction ────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false, dragStart = new THREE.Vector2(), clickedCubie = null;
let clickedFaceNormal = new THREE.Vector3();

function gmp(e) {
  const r = renderer.domElement.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  return new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
}

function snap(v) {
  const a = Math.abs(v.x), b = Math.abs(v.y), c = Math.abs(v.z);
  if (a >= b && a >= c) v.set(Math.sign(v.x), 0, 0);
  else if (b >= a && b >= c) v.set(0, Math.sign(v.y), 0);
  else v.set(0, 0, Math.sign(v.z));
}

function onDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  if (isAnimating) return;
  const pos = gmp(e);
  mouse.copy(pos);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(allCubies, false);
  if (hits.length > 0) {
    isDragging = true;
    dragStart.copy(pos);
    clickedCubie = hits[0].object;
    clickedFaceNormal.copy(hits[0].face.normal);
    clickedFaceNormal.transformDirection(clickedCubie.matrixWorld);
    snap(clickedFaceNormal);
    orbitControls.enabled = false;
  }
}

function onUp(e) {
  if (!isDragging || !clickedCubie) { isDragging = false; clickedCubie = null; orbitControls.enabled = true; return; }
  const pos = gmp(e.changedTouches ? e.changedTouches[0] : e);
  const dd = new THREE.Vector2().subVectors(pos, dragStart);
  if (dd.length() < 0.03) { isDragging = false; clickedCubie = null; orbitControls.enabled = true; return; }

  const wp = new THREE.Vector3();
  clickedCubie.getWorldPosition(wp);
  cubeGroup.worldToLocal(wp);
  const lx = Math.round(wp.x / GAP), ly = Math.round(wp.y / GAP), lz = Math.round(wp.z / GAP);
  const fn = clickedFaceNormal;
  let ax, lv, dir;

  if (Math.abs(dd.x) > Math.abs(dd.y)) {
    ax = 'y'; lv = ly;
    dir = dd.x > 0 ? 1 : -1;
    if (Math.abs(fn.y) > 0.5 && fn.y < 0) dir *= -1;
    else if (Math.abs(fn.z) > 0.5 && fn.z < 0) dir *= -1;
    else if (Math.abs(fn.x) > 0.5 && fn.x < 0) dir *= -1;
  } else {
    if (Math.abs(fn.y) > 0.5) { ax = 'z'; lv = lz; dir = dd.y > 0 ? -1 : 1; if (fn.y < 0) dir *= -1; }
    else if (Math.abs(fn.z) > 0.5) { ax = 'x'; lv = lx; dir = dd.y > 0 ? -1 : 1; if (fn.z < 0) dir *= -1; }
    else { ax = 'z'; lv = lz; dir = dd.y > 0 ? -1 : 1; if (fn.x > 0) dir *= -1; }
  }

  rotateLayer(ax, lv, dir * Math.PI / 2);
  isDragging = false; clickedCubie = null; orbitControls.enabled = true;
}

renderer.domElement.addEventListener('mousedown', onDown);
renderer.domElement.addEventListener('mouseup', onUp);
renderer.domElement.addEventListener('touchstart', e => { e.preventDefault(); onDown(e.touches[0]); }, { passive: false });
renderer.domElement.addEventListener('touchend', e => { e.preventDefault(); onUp(e); }, { passive: false });
renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

// ── Keyboard ─────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (isAnimating) return;
  const k = e.key.toLowerCase();
  const a = e.shiftKey ? Math.PI / 2 : -Math.PI / 2;
  const map = { u: ['y', 1], d: ['y', -1], r: ['x', 1], l: ['x', -1], f: ['z', 1], b: ['z', -1], m: ['x', 0], e: ['y', 0] };
  if (map[k]) rotateLayer(map[k][0], map[k][1], a);
});

// ── Scramble & Reset ─────────────────────────────────────
async function scramble() {
  const axes = ['x', 'y', 'z'], layers = [-1, 0, 1], dirs = [-1, 1];
  for (let i = 0; i < 20; i++) {
    await rotateLayer(
      axes[Math.floor(Math.random() * 3)],
      layers[Math.floor(Math.random() * 3)],
      dirs[Math.floor(Math.random() * 2)] * Math.PI / 2, 80
    );
  }
}

document.getElementById('btn-scramble').addEventListener('click', scramble);
document.getElementById('btn-reset').addEventListener('click', () => {
  if (isAnimating) return;
  buildCube();
});

// ── Resize & Render ──────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

(function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
})();
