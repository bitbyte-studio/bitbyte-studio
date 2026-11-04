import {
  AmbientLight,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
  type Object3D,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const CORAL = 0xfd625d;
const WHITE = 0xffffff;
const SIZE = 1;
const DEPTH = 0.4;
const GAP = 0.15;
const RADIUS = 0.13;
const OUTLINE_STROKE = 0.13;

type LogoHandle = {
  dispose: () => void;
  /** False when WebGL is unavailable and nothing was drawn on the canvas. */
  ready: boolean;
};

function createCoralMaterial(emissiveIntensity = 0.34) {
  return new MeshStandardMaterial({
    color: CORAL,
    emissive: new Color(CORAL),
    emissiveIntensity,
    metalness: 0.12,
    roughness: 0.3,
  });
}

function createSolidBox(color: number, emissiveIntensity = 0.18) {
  const geometry = new RoundedBoxGeometry(SIZE, SIZE, DEPTH, 5, RADIUS);
  const material = new MeshStandardMaterial({
    color,
    emissive: new Color(color),
    emissiveIntensity,
    metalness: 0.12,
    roughness: 0.3,
  });
  return new Mesh(geometry, material);
}

/** Rounded rectangle path helper (clockwise). */
function addRoundedRect(
  target: Shape | Path,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  target.moveTo(x + r, y);
  target.lineTo(x + width - r, y);
  target.quadraticCurveTo(x + width, y, x + width, y + r);
  target.lineTo(x + width, y + height - r);
  target.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  target.lineTo(x + r, y + height);
  target.quadraticCurveTo(x, y + height, x, y + height - r);
  target.lineTo(x, y + r);
  target.quadraticCurveTo(x, y, x + r, y);
}

/**
 * Hollow coral cell: solid coral frame, transparent center
 * (same reading as the SVG stroke outlines in the brand mark).
 */
function createOutlineBox() {
  const half = SIZE / 2;
  const shape = new Shape();
  addRoundedRect(shape, -half, -half, SIZE, SIZE, RADIUS);

  const hole = new Path();
  const inset = OUTLINE_STROKE;
  const innerSize = SIZE - inset * 2;
  addRoundedRect(hole, -half + inset, -half + inset, innerSize, innerSize, Math.max(0.04, RADIUS - inset * 0.65));
  shape.holes.push(hole);

  const geometry = new ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geometry.center();

  return new Mesh(geometry, createCoralMaterial(0.38));
}

function buildLogoGroup() {
  const logo = new Group();

  // Brand mark:
  // coral bit (bottom-left)
  // + byte: left hollow coral frames, right solid white cells
  const colBit = -(SIZE * 1.5 + GAP * 1.5);
  const colOutline = -(SIZE * 0.5 + GAP * 0.5);
  const colSolid = SIZE * 0.5 + GAP * 0.5;
  const rowBottom = 0;
  const rowTop = SIZE + GAP;

  const bit = createSolidBox(CORAL, 0.34);
  bit.position.set(colBit, rowBottom, 0);
  logo.add(bit);

  const outlineBottom = createOutlineBox();
  outlineBottom.position.set(colOutline, rowBottom, 0);
  logo.add(outlineBottom);

  const outlineTop = createOutlineBox();
  outlineTop.position.set(colOutline, rowTop, 0);
  logo.add(outlineTop);

  const whiteBottom = createSolidBox(WHITE, 0.05);
  whiteBottom.position.set(colSolid, rowBottom, 0);
  logo.add(whiteBottom);

  const whiteTop = createSolidBox(WHITE, 0.05);
  whiteTop.position.set(colSolid, rowTop, 0);
  logo.add(whiteTop);

  logo.position.x = -(colBit + colSolid) / 2;
  logo.position.y = -rowTop / 2;

  const pieces = [bit, outlineBottom, outlineTop, whiteBottom, whiteTop];
  pieces.forEach((piece, index) => {
    piece.userData.baseY = piece.position.y;
    piece.userData.delay = index * 0.09;
    piece.scale.setScalar(0.001);
    piece.position.y += 0.55;
  });

  logo.userData.pieces = pieces;
  return logo;
}

export function mountLogo3D(
  canvas: HTMLCanvasElement,
  visibilityTarget: Element = canvas,
  /** Called when the WebGL context is lost and the logo stops rendering. */
  onLost?: () => void,
): LogoHandle {
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.08, 7.4);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return { dispose: () => {}, ready: false };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  scene.add(new AmbientLight(0xffffff, 0.85));
  const key = new DirectionalLight(0xffffff, 1.15);
  key.position.set(2.6, 3.4, 4.2);
  const rim = new DirectionalLight(CORAL, 0.4);
  rim.position.set(-3, 1.4, 2);
  scene.add(key, rim);

  const logo = buildLogoGroup();
  scene.add(logo);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animationId = 0;
  const start = performance.now();
  let disposed = false;
  let visible = true;

  const resize = () => {
    const width = canvas.clientWidth || 256;
    const height = canvas.clientHeight || 160;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (reduceMotion && !disposed) animate(performance.now());
  };

  const animate = (now: number) => {
    if (disposed || !visible) return;
    animationId = requestAnimationFrame(animate);

    // With reduced motion, render the assembled logo once and keep it still.
    const elapsed = reduceMotion ? 10 : (now - start) / 1000;
    const pieces = logo.userData.pieces as Object3D[];

    pieces.forEach((piece) => {
      const local = Math.max(0, elapsed - (piece.userData.delay as number));
      const t = Math.min(1, local / 0.55);
      const eased = 1 - (1 - t) ** 3;
      piece.scale.setScalar(Math.max(0.001, eased));
      piece.position.y =
        (piece.userData.baseY as number) +
        (1 - eased) * 0.55 +
        Math.sin(elapsed * 1.4 + (piece.userData.delay as number) * 7) * 0.028;
    });

    logo.rotation.y = reduceMotion ? 0 : Math.sin(elapsed * 0.48) * 0.18;
    logo.rotation.x = reduceMotion ? 0 : Math.sin(elapsed * 0.3) * 0.06;
    renderer.render(scene, camera);

    if (reduceMotion) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible && !disposed && !reduceMotion) {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(animate);
    }
  });
  observer.observe(visibilityTarget);

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  };

  // The browser can drop the GL context (GPU reset, too many contexts). Stop drawing and let the page show the SVG logo again.
  const onContextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(animationId);
    animationId = 0;
    disposed = true;
    onLost?.();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  resize();
  window.addEventListener('resize', onResize);
  animationId = requestAnimationFrame(animate);

  return {
    ready: true,
    dispose: () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(animationId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });

      renderer.dispose();
    },
  };
}
