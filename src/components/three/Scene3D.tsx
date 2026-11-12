"use client";

import { animated, useSpring } from "@react-spring/three";
import { Float, MeshDistortMaterial, MeshPortalMaterial, PerformanceMonitor, Text, useCursor } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { flatFragment, haloFragment, passUv, worldFragment } from "./shaders";
import type { Panel3D, Shape3D } from "./types";

const FOV = 35;
const CARD_W = 2.6;
const CARD_H = 3.5;
const CARD_R = 0.2;
const HALO_PAD = 1.8;
const FONT_BOLD = "/fonts/inter-latin-600-normal.woff";
const FONT_REGULAR = "/fonts/inter-latin-400-normal.woff";

export interface Palette {
  /** Base colour of every card's world. */
  base: string;
  text: string;
  muted: string;
}

interface SceneProps {
  panels: Panel3D[];
  /** Scroll position in cards: 0 = first card in front, 1.5 = halfway between the second and third. */
  progress: RefObject<number>;
  active: number;
  /** Index of the card whose section is open (its portal fills the screen), or null. */
  open: number | null;
  palette: Palette;
  reducedMotion: boolean;
  /** Stop rendering while the stage is off screen. */
  paused: boolean;
  /** Portal effect off (the default on Android phones): flat cards with no portal, no floating shapes and no noise in the shaders. */
  lite: boolean;
  onSelect: (index: number) => void;
  onOpen: (index: number) => void;
}

/** The WebGL part of the 3D view: a ring of portal cards that turns with the page scroll. */
/**
 * Render quality for a performance factor (0 = struggling, 1 = frames to spare): the canvas pixel ratio and the size
 * of each portal's render target. The lite scene has no portals and a lower ceiling.
 */
function qualityFor(factor: number, lite: boolean) {
  const max = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, lite ? 1.25 : 1.5);
  const min = Math.min(0.75, max);
  return { dpr: Math.round((min + (max - min) * factor) * 20) / 20, portal: factor < 0.3 ? 128 : factor < 0.7 ? 256 : 512 };
}

export default function Scene3D({ paused, ...props }: SceneProps) {
  const { lite } = props;
  // Starts in the middle and follows the measured frame rate: drei's monitor raises the factor while the device keeps
  // up and lowers it while frames drop. A device that keeps flip-flopping settles on the lowest quality.
  const [factor, setFactor] = useState(0.5);
  const quality = qualityFor(factor, lite);
  return (
    <Canvas
      flat
      dpr={quality.dpr}
      data-dpr={quality.dpr}
      frameloop={paused ? "never" : "always"}
      camera={{ fov: FOV, position: [0, 0, 10], near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: !lite, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      {/* Anything that suspends in here (a card's text waiting for its font) must stop at this boundary: left to bubble,
          it suspends the page around the canvas, which hides the whole track for a moment and loses the scroll position. */}
      <PerformanceMonitor factor={0.5} flipflops={4} onChange={({ factor }) => setFactor(factor)} onFallback={() => setFactor(0)} />
      <Suspense fallback={null}>
        <Ring {...props} portalResolution={quality.portal} />
      </Suspense>
    </Canvas>
  );
}

/** Camera distance and ring offset for the current stage size: the card sits right of the caption on wide stages, above it on tall ones. */
function useLayout() {
  const size = useThree((state) => state.size);
  return useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const wide = aspect >= 1.15;
    const visibleH = Math.max(CARD_H / (wide ? 0.62 : 0.5), CARD_W / ((wide ? 0.3 : 0.72) * aspect));
    const distance = visibleH / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    return { distance, x: wide ? visibleH * aspect * 0.19 : 0, y: wide ? 0 : visibleH * 0.14 };
  }, [size.width, size.height]);
}

function Ring({ panels, progress, active, open, palette, reducedMotion, lite, portalResolution, onSelect, onOpen }: Omit<SceneProps, "paused"> & { portalResolution: number }) {
  const count = panels.length;
  const step = (Math.PI * 2) / count;
  // Cards meet edge to edge at CARD_W / (2 tan(π/n)); the extra leaves a gap between them.
  const radius = CARD_W / (2 * Math.tan(Math.PI / count)) + 0.75;
  const layout = useLayout();
  const camera = useThree((state) => state.camera);
  const target = useRef(0);
  const [spring, api] = useSpring(() => ({ rot: -progress.current * step, config: { mass: 1, tension: 150, friction: 28 } }));

  useFrame((state) => {
    const next = -progress.current * step;
    if (next !== target.current) {
      target.current = next;
      void api.start({ rot: next, immediate: reducedMotion });
    }
    // A little parallax from the pointer; the portals' depth makes it read as a real window.
    const px = reducedMotion ? 0 : state.pointer.x * 0.35;
    const py = reducedMotion ? 0 : state.pointer.y * 0.2;
    camera.position.x += (px - camera.position.x) * 0.06;
    camera.position.y += (py - camera.position.y) * 0.06;
    camera.position.z = layout.distance;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group position={[layout.x, layout.y, -radius]}>
      <animated.group rotation-y={spring.rot}>
        {panels.map((panel, i) => (
          <Card
            key={panel.key}
            panel={panel}
            angle={i * step}
            radius={radius}
            ringRotation={spring.rot}
            active={active === i}
            open={open === i}
            palette={palette}
            reducedMotion={reducedMotion}
            lite={lite}
            portalResolution={portalResolution}
            onClick={() => (active === i ? onOpen(i) : onSelect(i))}
          />
        ))}
      </animated.group>
    </group>
  );
}

function roundedRect(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ShapeGeometry(shape, 10);
  // ShapeGeometry's UVs are the raw coordinates; the pointer position needs 0..1.
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) uv.setXY(i, (position.getX(i) - x) / width, (position.getY(i) - y) / height);
  return geometry;
}

interface CardProps {
  panel: Panel3D;
  angle: number;
  radius: number;
  ringRotation: { get: () => number };
  active: boolean;
  open: boolean;
  palette: Palette;
  reducedMotion: boolean;
  lite: boolean;
  portalResolution: number;
  onClick: () => void;
}

function Card({ panel, angle, radius, ringRotation, active, open, palette, reducedMotion, lite, portalResolution, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const group = useRef<THREE.Group>(null);
  const portal = useRef<{ blend: number } | null>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(() => roundedRect(CARD_W, CARD_H, CARD_R), []);

  const world = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: passUv,
        fragmentShader: lite ? flatFragment : worldFragment,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uBase: { value: new THREE.Color() },
          uTint: { value: new THREE.Color() },
        },
      }),
    [lite],
  );
  const halo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: passUv,
        fragmentShader: haloFragment,
        transparent: true,
        depthWrite: false,
        defines: lite ? { LITE: "" } : {},
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uActive: { value: 0 },
          uColor: { value: new THREE.Color() },
          uSize: { value: new THREE.Vector2(CARD_W + HALO_PAD, CARD_H + HALO_PAD) },
          uCard: { value: new THREE.Vector2(CARD_W, CARD_H) },
          uRadius: { value: CARD_R },
        },
      }),
    [lite],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      world.dispose();
      halo.dispose();
    },
    [geometry, world, halo],
  );
  useEffect(() => {
    world.uniforms.uBase.value.set(palette.base);
    world.uniforms.uTint.value.set(panel.tint);
    halo.uniforms.uColor.value.set(panel.tint);
  }, [world, halo, palette.base, panel.tint]);

  const spring = useSpring({
    hover: hovered ? 1 : 0,
    focus: active ? 1 : 0,
    scale: hovered ? 1.05 : active ? 1 : 0.88,
    blend: open ? 1 : 0,
    immediate: reducedMotion,
    config: (key) => (key === "scale" ? { mass: 1, tension: 260, friction: 16 } : { mass: 1, tension: 140, friction: 24 }),
  });

  useFrame((state) => {
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const hover = spring.hover.get();
    world.uniforms.uTime.value = time;
    world.uniforms.uHover.value = hover;
    world.uniforms.uPointer.value.lerp(pointer.current, 0.12);
    halo.uniforms.uTime.value = time;
    halo.uniforms.uHover.value = hover;
    halo.uniforms.uActive.value = spring.focus.get();
    if (portal.current) portal.current.blend = spring.blend.get();
    // Cards turned away from the camera (the far side of the ring, or edge-on at the sides) are hidden, so their portals stop rendering.
    if (group.current) {
      group.current.getWorldPosition(worldPosition);
      toCamera.copy(state.camera.position).sub(worldPosition).normalize();
      const facing = Math.sin(angle + ringRotation.get()) * toCamera.x + Math.cos(angle + ringRotation.get()) * toCamera.z;
      group.current.visible = open || facing > 0.2;
    }
  });

  const onMove = (event: ThreeEvent<PointerEvent>) => {
    if (event.uv) pointer.current.copy(event.uv);
  };

  const textX = -CARD_W / 2 + 0.26;
  const textW = CARD_W - 0.52;
  /** The card's text: inside the portal's world, or (lite) straight on the card's face. The card shows at once; the text joins when its glyphs are ready. */
  const text = (flat: boolean) => {
    const z = flat ? 0.01 : -0.05;
    return (
      <Suspense fallback={null}>
        <Text font={FONT_BOLD} position={[CARD_W / 2 - 0.1, -CARD_H / 2 + 0.05, flat ? 0.005 : -1.6]} fontSize={flat ? 1.5 : 2.1} anchorX="right" anchorY="bottom" color={panel.tint} fillOpacity={0.1}>
          {panel.index}
        </Text>
        <Text font={FONT_BOLD} position={[textX, CARD_H / 2 - 0.3, z]} fontSize={0.105} letterSpacing={0.12} anchorX="left" anchorY="top" color={panel.tint}>
          {[panel.index, panel.eyebrow.toUpperCase()].filter(Boolean).join(" — ")}
        </Text>
        <Text font={FONT_BOLD} position={[textX, CARD_H / 2 - 0.56, z]} fontSize={0.36} letterSpacing={-0.03} lineHeight={1.02} maxWidth={textW} anchorX="left" anchorY="top" color={palette.text}>
          {panel.nav}
        </Text>
        <Text font={FONT_REGULAR} position={[textX, -CARD_H / 2 + 0.3, z]} fontSize={0.118} lineHeight={1.75} maxWidth={textW} anchorX="left" anchorY="bottom" color={palette.muted}>
          {panel.lines.join("\n")}
        </Text>
      </Suspense>
    );
  };
  return (
    <group ref={group} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation-y={angle}>
      <animated.group scale={spring.scale}>
        <mesh position-z={-0.02} material={halo}>
          <planeGeometry args={[CARD_W + HALO_PAD, CARD_H + HALO_PAD]} />
        </mesh>
        <mesh
          geometry={geometry}
          {...(lite ? { material: world } : {})}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
            pointer.current.set(0.5, 0.5);
          }}
          onPointerMove={onMove}
        >
          {!lite && (
            <MeshPortalMaterial
              ref={(material) => {
                portal.current = material as unknown as { blend: number } | null;
              }}
              blur={0}
              resolution={portalResolution}
            >
              <ambientLight intensity={1.4} />
              <directionalLight position={[3, 4, 5]} intensity={2.2} />
              <pointLight position={[-2, -1, 1]} intensity={12} color={panel.tint} />
              <mesh position-z={-9} material={world}>
                <planeGeometry args={[60, 60]} />
              </mesh>
              <Shapes shape={panel.shape} tint={panel.tint} hover={spring.hover} still={reducedMotion} />
              {text(false)}
            </MeshPortalMaterial>
          )}
        </mesh>
        {lite && text(true)}
      </animated.group>
    </group>
  );
}

const SHAPE_SPOTS: [x: number, y: number, z: number, scale: number][] = [
  // Kept in the middle band, clear of the title above and the lines below.
  [0.6, 0.45, -2.6, 0.5],
  [-0.7, 0.2, -3.4, 0.26],
  [1.3, 1.1, -3.8, 0.24],
  [-0.1, 0.95, -4.6, 0.3],
];

function ShapeGeometry({ shape }: { shape: Shape3D }) {
  switch (shape) {
    case "ico":
      return <icosahedronGeometry args={[1, 8]} />;
    case "rings":
      return <torusGeometry args={[0.8, 0.26, 24, 64]} />;
    case "boxes":
      return <boxGeometry args={[1.25, 1.25, 1.25, 12, 12, 12]} />;
    case "octa":
      return <octahedronGeometry args={[1.05, 6]} />;
    case "knot":
      return <torusKnotGeometry args={[0.68, 0.24, 128, 24]} />;
    case "spheres":
      return <sphereGeometry args={[0.95, 48, 48]} />;
  }
}

/** Floating shapes deep inside the portal. Their vertex shader distorts more while the card is hovered. */
function Shapes({ shape, tint, hover, still }: { shape: Shape3D; tint: string; hover: { get: () => number }; still: boolean }) {
  const materials = useRef<({ distort: number } | null)[]>([]);
  useFrame(() => {
    const distort = 0.18 + 0.42 * hover.get();
    for (const material of materials.current) if (material) material.distort = distort;
  });
  return (
    <>
      {SHAPE_SPOTS.map(([x, y, z, scale], i) => (
        <Float key={i} speed={still ? 0 : 1.2 + i * 0.3} rotationIntensity={0.9} floatIntensity={0.5}>
          <mesh position={[x, y, z]} scale={scale} rotation={[i * 0.7, i * 1.3, 0]}>
            <ShapeGeometry shape={shape} />
            <MeshDistortMaterial
              ref={(material) => {
                materials.current[i] = material as unknown as { distort: number } | null;
              }}
              color={tint}
              roughness={0.25}
              metalness={0.15}
              speed={still ? 0 : 2.2}
              distort={0.18}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}
