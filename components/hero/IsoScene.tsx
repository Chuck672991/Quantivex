'use client';

import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { PerfLevel } from '@/lib/perf';
import {
    memo,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    type ReactNode,
} from 'react';
import * as THREE from 'three';
import {
    bowlGeometry,
    bowlProfile,
    cRingGeometry,
    coinGeometry,
    domeButtonGeometry,
    duneGeometry,
    slabWithHoleGeometry,
} from './geometry';

/*
  Isometric composition after the hero reference: low matte slabs on a 2:1
  isometric grid, a dial, a bowl with a glossy sphere, stepped plates, metal
  coins, an orange button and rolling dunes.

  Layout is expressed on the isometric axes: `a` runs to the lower right of the
  screen and `b` to the upper right (world x = a, world z = -b).
*/

const iso = (a: number, y: number, b: number): [number, number, number] => [
    a,
    y,
    -b,
];

// Slab footprints (a × b) and heights
const SLAB = 2.6;
const A_TOP = 0.55;
const B_TOP = 0.62;
const WALL_H = 2.1;
const WALL_A = 2.6;
const WALL_B = 1.4;
const WALL_CENTER_A = 3.0;
const BOWL_RIM = 1.12;
const BOWL_DEPTH = 0.32;
const SPHERE_R = 0.46;

// Where slab A's top centre lands inside the canvas, as a fraction of its size
const ANCHOR_WIDE = { x: 0.45, y: 0.46, unitsAcross: 10.6 };
const ANCHOR_NARROW = { x: 0.43, y: 0.54, unitsAcross: 7.6 };

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutBack = (t: number) => {
    const c1 = 1.5;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

/** Cost of the scene per performance tier (lib/perf.ts). */
const QUALITY: Record<
    PerfLevel,
    {
        dpr: [number, number];
        shadowMap: number;
        envRes: number;
        duneSegments: number;
        /** Gentle idle drift, rendered at 30fps. Off where every frame counts. */
        idle: boolean;
    }
> = {
    0: {
        dpr: [1, 1.5],
        shadowMap: 1024,
        envRes: 128,
        duneSegments: 110,
        idle: true,
    },
    1: {
        dpr: [1, 1.25],
        shadowMap: 512,
        envRes: 64,
        duneSegments: 80,
        idle: false,
    },
    2: {
        dpr: [1, 1],
        shadowMap: 512,
        envRes: 64,
        duneSegments: 56,
        idle: false,
    },
};

interface SceneProps {
    /** Preloader has lifted: start the intro. */
    ready: boolean;
    /** Skip the intro and every idle motion. */
    reduceMotion: boolean;
    level: PerfLevel;
}

// ─── Camera ──────────────────────────────────────────────────────────────

/** Frames slab A at its anchor point; written as a plain function so the camera is configured in one place. */
const frameCamera = (
    camera: THREE.OrthographicCamera,
    width: number,
    height: number,
) => {
    const narrow = width < 640;
    const anchor = narrow ? ANCHOR_NARROW : ANCHOR_WIDE;
    const zoom = width / anchor.unitsAcross;

    const right = new THREE.Vector3(0.7071, 0, -0.7071);
    const up = new THREE.Vector3(-0.3536, 0.866, -0.3536);
    const toCamera = new THREE.Vector3(0.6124, 0.5, 0.6124);

    // Slab A sits left of / above the canvas centre, so the look-at
    // point is to its right and below it
    const target = new THREE.Vector3(0, A_TOP, 0)
        .addScaledVector(right, ((0.5 - anchor.x) * width) / zoom)
        .addScaledVector(up, -((0.5 - anchor.y) * height) / zoom);

    camera.position.copy(target).addScaledVector(toCamera, 40);
    camera.zoom = zoom;
    camera.near = 0.1;
    camera.far = 120;
    camera.lookAt(target);
    camera.updateProjectionMatrix();
};

const CameraRig = () => {
    const camera = useThree((state) => state.camera);
    const size = useThree((state) => state.size);

    useLayoutEffect(() => {
        frameCamera(
            camera as THREE.OrthographicCamera,
            size.width,
            size.height,
        );
    }, [camera, size.width, size.height]);

    return null;
};

// ─── Intro animation ─────────────────────────────────────────────────────

interface RevealProps {
    at: [number, number, number];
    delay?: number;
    /** `grow` extrudes up from the ground; `pop` scales about its own centre. */
    mode?: 'grow' | 'pop';
    ready: boolean;
    reduceMotion: boolean;
    children: ReactNode;
}

const Reveal = ({
    at,
    delay = 0,
    mode = 'grow',
    ready,
    reduceMotion,
    children,
}: RevealProps) => {
    const group = useRef<THREE.Group>(null);
    const startedAt = useRef<number | null>(null);

    useFrame((state) => {
        const g = group.current;
        if (!g) return;

        if (reduceMotion) {
            g.visible = true;
            g.scale.setScalar(1);
            return;
        }
        if (!ready) {
            g.visible = false;
            return;
        }

        // Wall-clock time, so the intro lasts the same on slow devices
        startedAt.current ??= state.clock.elapsedTime;
        const elapsed = state.clock.elapsedTime - startedAt.current;
        const t = THREE.MathUtils.clamp((elapsed - delay) / 0.95, 0, 1);
        g.visible = t > 0;
        // The canvas renders on demand: keep requesting frames until this finishes
        if (t < 1) state.invalidate();

        if (mode === 'grow') {
            const e = easeOutCubic(t);
            g.scale.set(0.97 + 0.03 * e, Math.max(e, 0.0001), 0.97 + 0.03 * e);
        } else {
            g.scale.setScalar(Math.max(easeOutBack(t), 0.0001));
        }
    });

    return (
        <group ref={group} position={at} visible={false}>
            {children}
        </group>
    );
};

// ─── Scene ───────────────────────────────────────────────────────────────

const Scene = memo(function Scene({ ready, reduceMotion, level }: SceneProps) {
    const invalidate = useThree((state) => state.invalidate);
    const domElement = useThree((state) => state.gl.domElement);
    const quality = QUALITY[level];
    const root = useRef<THREE.Group>(null);
    const sphere = useRef<THREE.Group>(null);
    const pearl = useRef<THREE.Group>(null);
    const button = useRef<THREE.Group>(null);

    const bowl = useMemo(() => bowlProfile(BOWL_RIM, BOWL_DEPTH), []);

    const geometries = useMemo(
        () => ({
            slabB: slabWithHoleGeometry({
                width: SLAB,
                depth: SLAB,
                height: B_TOP,
                holeRadius: BOWL_RIM,
                holeOffset: [-0.08, 0.32],
            }),
            bowl: bowlGeometry(BOWL_RIM, BOWL_DEPTH),
            dialRing: cRingGeometry(0.98, 0.66, 0.35, Math.PI * 2 - 0.9, 0.13),
            dialCore: coinGeometry(0.46, 0.14, 0.03),
            dialPlate: coinGeometry(1.1, 0.045, 0.02),
            coin: coinGeometry(0.5, 0.1),
            button: domeButtonGeometry(0.46, 0.05, 0.1),
            seat: coinGeometry(0.56, 0.03, 0.012),
            dunes: duneGeometry(
                14,
                14,
                [
                    {
                        at: 2.4,
                        width: 1.15,
                        height: 1.25,
                        wave: [0.5, 0.4],
                        bands: [9, 0.1],
                    },
                    {
                        at: -0.2,
                        width: 0.85,
                        height: 0.62,
                        wave: [0.7, 2.2],
                        bands: [11, 0.12],
                        span: [-3, 4],
                    },
                    {
                        at: -2.6,
                        width: 0.7,
                        height: 0.5,
                        wave: [0.6, 1.0],
                        span: [-6, -2.2],
                    },
                ],
                quality.duneSegments,
            ),
        }),
        [quality.duneSegments],
    );

    const materials = useMemo(
        () => ({
            clay: new THREE.MeshStandardMaterial({
                color: '#F7F9FC',
                roughness: 0.95,
                metalness: 0,
                envMapIntensity: 0.6,
            }),
            groove: new THREE.MeshStandardMaterial({
                color: '#DCE2EB',
                roughness: 0.96,
                envMapIntensity: 0.4,
            }),
            metal: new THREE.MeshStandardMaterial({
                color: '#EEF1F6',
                roughness: 0.42,
                metalness: 0.9,
                envMapIntensity: 2.4,
            }),
            sphere: new THREE.MeshPhysicalMaterial({
                color: '#7791F6',
                roughness: 0.14,
                metalness: 0,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                envMapIntensity: 1,
            }),
            pearl: new THREE.MeshPhysicalMaterial({
                color: '#FFFFFF',
                roughness: 0.16,
                clearcoat: 1,
                clearcoatRoughness: 0.12,
                envMapIntensity: 0.8,
            }),
            orange: new THREE.MeshPhysicalMaterial({
                color: '#F59E4B',
                roughness: 0.24,
                clearcoat: 0.8,
                clearcoatRoughness: 0.16,
                envMapIntensity: 0.9,
            }),
            dunes: new THREE.MeshStandardMaterial({
                color: '#C9D1DE',
                roughness: 0.96,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                envMapIntensity: 0.35,
            }),
        }),
        [],
    );

    // The canvas renders on demand. Frames are requested by: the intro (Reveal),
    // pointer movement, the parallax easing out, resizes (R3F) and, on capable
    // devices, a 30fps idle drift. A still scene costs nothing.
    useEffect(() => {
        invalidate();
    }, [ready, invalidate]);

    useEffect(() => {
        if (reduceMotion) return;
        const request = () => invalidate();
        domElement.addEventListener('pointermove', request, { passive: true });
        return () => domElement.removeEventListener('pointermove', request);
    }, [domElement, invalidate, reduceMotion]);

    useEffect(() => {
        if (reduceMotion || !ready || !quality.idle) return;
        const id = window.setInterval(() => invalidate(), 1000 / 30);
        return () => window.clearInterval(id);
    }, [reduceMotion, ready, quality.idle, invalidate]);

    // Pointer parallax and idle drift
    useFrame((state, delta) => {
        if (reduceMotion) return;
        const g = root.current;
        if (g) {
            const targetY = state.pointer.x * 0.05;
            const targetX = -state.pointer.y * 0.018;
            g.rotation.y = THREE.MathUtils.damp(
                g.rotation.y,
                targetY,
                3,
                delta,
            );
            g.rotation.x = THREE.MathUtils.damp(
                g.rotation.x,
                targetX,
                3,
                delta,
            );
            // still easing toward the pointer: ask for the next frame
            if (
                Math.abs(g.rotation.y - targetY) > 0.0004 ||
                Math.abs(g.rotation.x - targetX) > 0.0004
            ) {
                state.invalidate();
            }
        }
        if (!quality.idle) return;
        const t = state.clock.elapsedTime;
        if (sphere.current)
            sphere.current.position.y = Math.sin(t * 0.9) * 0.018;
        if (pearl.current)
            pearl.current.position.y = Math.sin(t * 1.1 + 1) * 0.025;
        if (button.current)
            button.current.position.y = Math.sin(t * 1.3) * 0.012;
    });

    // Sphere rests in the bowl, off to one side
    const bowlCentre = { a: 2.65 - 0.08, b: -0.32 };
    const sphereOffset = { a: 0.58, b: 0.12 };
    const sphereRho = Math.hypot(sphereOffset.a, sphereOffset.b);
    const sphereY = B_TOP + bowl.floorAt(sphereRho) + SPHERE_R * 0.96;

    const reveal = { ready, reduceMotion };
    const wallCentres = [2.25, 3.65, 5.05, 6.45];
    const slatHeights = [0.5, 0.62, 0.74, 0.86, 0.98];

    return (
        <group ref={root}>
            {/* Slab A: the dial */}
            <Reveal at={iso(0, 0, 0)} delay={0} {...reveal}>
                <RoundedBox
                    args={[SLAB, A_TOP, SLAB]}
                    radius={0.06}
                    smoothness={5}
                    position={[0, A_TOP / 2, 0]}
                    material={materials.clay}
                    castShadow
                    receiveShadow
                />
                <group position={[0, A_TOP, 0]}>
                    <mesh
                        geometry={geometries.dialPlate}
                        material={materials.groove}
                        receiveShadow
                    />
                    <mesh
                        geometry={geometries.dialRing}
                        material={materials.clay}
                        position={[0, 0.03, 0]}
                        rotation={[0, 0.3, 0]}
                        castShadow
                        receiveShadow
                    />
                    <mesh
                        geometry={geometries.dialCore}
                        material={materials.clay}
                        position={[0, 0.03, 0]}
                        castShadow
                        receiveShadow
                    />
                </group>
            </Reveal>

            <Reveal
                at={iso(-0.93, A_TOP + 0.2, 0.93)}
                delay={1.0}
                mode="pop"
                {...reveal}
            >
                <group ref={pearl}>
                    <mesh material={materials.pearl} castShadow>
                        <sphereGeometry args={[0.1, 32, 24]} />
                    </mesh>
                </group>
            </Reveal>

            {/* Slab B: the bowl and the sphere */}
            <Reveal at={iso(2.65, 0, 0)} delay={0.1} {...reveal}>
                <mesh
                    geometry={geometries.slabB}
                    material={materials.clay}
                    position={[0, B_TOP / 2, 0]}
                    castShadow
                    receiveShadow
                />
                <mesh
                    geometry={geometries.bowl}
                    material={materials.clay}
                    position={[-0.08, B_TOP, 0.32]}
                    receiveShadow
                />
            </Reveal>

            <Reveal
                at={iso(
                    bowlCentre.a + sphereOffset.a,
                    sphereY,
                    bowlCentre.b + sphereOffset.b,
                )}
                delay={0.85}
                mode="pop"
                {...reveal}
            >
                <group ref={sphere}>
                    <mesh material={materials.sphere} castShadow>
                        <sphereGeometry args={[SPHERE_R, 64, 48]} />
                    </mesh>
                </group>
            </Reveal>

            {/* Stepped plates */}
            {slatHeights.map((height, i) => (
                <Reveal
                    key={i}
                    at={iso(3.6, 0, -3.0 + i * 0.24)}
                    delay={0.3 + i * 0.05}
                    {...reveal}
                >
                    <RoundedBox
                        args={[1.5, height, 0.07]}
                        radius={0.025}
                        smoothness={3}
                        position={[0, height / 2, 0]}
                        material={materials.clay}
                        castShadow
                        receiveShadow
                    />
                </Reveal>
            ))}

            {/* Block C with a coin */}
            <Reveal at={iso(3.55, 0, -3.95)} delay={0.35} {...reveal}>
                <RoundedBox
                    args={[1.5, 1.0, 1.5]}
                    radius={0.06}
                    smoothness={5}
                    position={[0, 0.5, 0]}
                    material={materials.clay}
                    castShadow
                    receiveShadow
                />
            </Reveal>
            <Reveal
                at={iso(3.55, 1.0, -3.95)}
                delay={0.95}
                mode="pop"
                {...reveal}
            >
                <mesh
                    geometry={geometries.coin}
                    material={materials.metal}
                    castShadow
                />
            </Reveal>

            {/* The wall: modular blocks running up and to the right */}
            {wallCentres.map((b, i) => (
                <Reveal
                    key={b}
                    at={iso(WALL_CENTER_A, 0, b)}
                    delay={0.4 + i * 0.1}
                    {...reveal}
                >
                    <RoundedBox
                        args={[WALL_A, WALL_H, WALL_B - 0.04]}
                        radius={0.06}
                        smoothness={5}
                        position={[0, WALL_H / 2, 0]}
                        material={materials.clay}
                        castShadow
                        receiveShadow
                    />
                </Reveal>
            ))}
            <Reveal
                at={iso(WALL_CENTER_A, WALL_H, wallCentres[0])}
                delay={1.05}
                mode="pop"
                {...reveal}
            >
                <mesh
                    geometry={geometries.coin}
                    material={materials.metal}
                    castShadow
                />
            </Reveal>
            <Reveal
                at={iso(WALL_CENTER_A, WALL_H, wallCentres[1])}
                delay={1.2}
                mode="pop"
                {...reveal}
            >
                <mesh
                    geometry={geometries.seat}
                    material={materials.groove}
                    receiveShadow
                />
                <group ref={button} position={[0, 0.03, 0]}>
                    <mesh
                        geometry={geometries.button}
                        material={materials.orange}
                        castShadow
                    />
                </group>
            </Reveal>

            {/* Dunes */}
            <Reveal at={iso(6.2, 0, -3.2)} delay={0.2} mode="pop" {...reveal}>
                <mesh
                    geometry={geometries.dunes}
                    material={materials.dunes}
                    receiveShadow
                />
            </Reveal>

            {/* Soft shadow catcher: the page background shows through */}
            <mesh rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[80, 80]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
        </group>
    );
});

// ─── Canvas ──────────────────────────────────────────────────────────────

interface IsoSceneProps extends SceneProps {
    /** Render loop on/off (off-screen, hidden tab). */
    active: boolean;
    onCreated?: () => void;
}

const IsoScene = ({
    ready,
    reduceMotion,
    level,
    active,
    onCreated,
}: IsoSceneProps) => (
    <Canvas
        // shadow-map size is fixed at creation, so a tier change rebuilds the canvas
        key={`tier-${level}`}
        orthographic
        shadows
        flat
        dpr={QUALITY[level].dpr}
        frameloop={active ? 'demand' : 'never'}
        // Measure the layout box, not getBoundingClientRect: the scroll opening
        // scales this canvas's ancestors (down to 1/8), and a scaled measurement
        // sizes the canvas to that small box and only corrects itself on a later
        // scroll, cutting off the right of the scene. Layout size never changes
        // with a transform, and nothing here needs a re-measure on scroll.
        resize={{ offsetSize: true, scroll: false }}
        gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        }}
        camera={{ position: [10, 8, 10], zoom: 90 }}
        onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            onCreated?.();
        }}
        className="!absolute inset-0"
    >
        <CameraRig />

        <hemisphereLight args={['#ffffff', '#d5deeb', 0.5]} />
        <directionalLight
            position={[-7, 11, 8]}
            intensity={1.9}
            castShadow
            shadow-mapSize={[
                QUALITY[level].shadowMap,
                QUALITY[level].shadowMap,
            ]}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={16}
            shadow-camera-bottom={-16}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-bias={-0.0004}
            shadow-normalBias={0.03}
            shadow-radius={5}
        />
        <directionalLight
            position={[9, 6, 3]}
            intensity={0.85}
            color="#e4ecff"
        />

        <Environment
            resolution={QUALITY[level].envRes}
            environmentIntensity={0.7}
        >
            <color attach="background" args={['#aab5c8']} />
            <Lightformer
                form="rect"
                intensity={1.6}
                position={[0, 7, 0]}
                rotation-x={Math.PI / 2}
                scale={[14, 14, 1]}
            />
            <Lightformer
                form="rect"
                intensity={1.1}
                position={[-7, 3, 6]}
                rotation-y={Math.PI / 3}
                scale={[9, 6, 1]}
            />
            <Lightformer
                form="rect"
                intensity={0.6}
                color="#cfdcff"
                position={[7, 2, -3]}
                rotation-y={-Math.PI / 2.4}
                scale={[8, 5, 1]}
            />
        </Environment>

        <Scene ready={ready} reduceMotion={reduceMotion} level={level} />
    </Canvas>
);

export default IsoScene;
