'use client';

import { Environment, Float, MeshTransmissionMaterial, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Per-slab configuration ────────────────────────────────────────────────
interface SlabConfig {
    label: string;
    sublabel: string;
    y: number;
    delay: number;
    speed: number;
    rotZ: number;
    rotX: number;
}

const SLABS: SlabConfig[] = [
    {
        label: 'FRONTEND',
        sublabel: 'React · Next.js · React Native',
        y: 0.84,
        delay: 0,
        speed: 1.3,
        rotZ: -0.04,
        rotX: 0.05,
    },
    {
        label: 'BACKEND',
        sublabel: 'Node.js · Fastify · GraphQL',
        y: 0.02,
        delay: 1.1,
        speed: 1.6,
        rotZ: 0.02,
        rotX: -0.03,
    },
    {
        label: 'DATABASE',
        sublabel: 'MongoDB · PostgreSQL · Firebase',
        y: -0.80,
        delay: 2.2,
        speed: 1.4,
        rotZ: 0.035,
        rotX: 0.02,
    },
];

// ─── Glass slab with glowing edges + text ──────────────────────────────────
function GlassSlab({ label, sublabel, y, delay, speed, rotZ, rotX }: SlabConfig) {
    return (
        <Float
            speed={speed}
            rotationIntensity={0.12}
            floatIntensity={0.38}
            floatingRange={[-0.04, 0.04]}
        >
            <group position={[0, y, 0]} rotation={[rotX, 0, rotZ]}>

                {/* ── Main glass body ── */}
                <mesh>
                    <boxGeometry args={[2.75, 0.48, 0.13]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={0.02}
                        samples={10}
                        thickness={0.05}
                        roughness={0.04}
                        ior={1.5}
                        chromaticAberration={0.012}
                        anisotropy={0.12}
                        distortion={0.025}
                        distortionScale={0.12}
                        temporalDistortion={0.05}
                        color={new THREE.Color('#7a9440')}
                        transmission={0.88}
                        opacity={1}
                    />
                </mesh>

                {/* ── Top olive-green glow edge ── */}
                <mesh position={[0, 0.247, 0]}>
                    <boxGeometry args={[2.77, 0.008, 0.155]} />
                    <meshBasicMaterial
                        color="#a8cf74"
                        opacity={0.65}
                        transparent
                    />
                </mesh>

                {/* ── Bottom warm-gold glow edge ── */}
                <mesh position={[0, -0.247, 0]}>
                    <boxGeometry args={[2.77, 0.008, 0.155]} />
                    <meshBasicMaterial
                        color="#c8a040"
                        opacity={0.3}
                        transparent
                    />
                </mesh>

                {/* ── Label (floating just in front of face) ── */}
                <Text
                    position={[0, 0.09, 0.09]}
                    fontSize={0.115}
                    color="#f8f8f2"
                    letterSpacing={0.2}
                    anchorX="center"
                    anchorY="middle"
                // uses Roboto SDF (bundled with drei) — no remote fetch needed
                >
                    {label}
                </Text>

                {/* ── Sub-label ── */}
                <Text
                    position={[0, -0.1, 0.09]}
                    fontSize={0.062}
                    color="#d9e7b8"
                    letterSpacing={0.07}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.85}
                >
                    {sublabel}
                </Text>
            </group>
        </Float>
    );
}

// ─── Scene: lighting + mouse-parallax group ─────────────────────────────────
function Scene() {
    const groupRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    // Global mouse tracking for parallax tilt
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    // Smooth lerp toward mouse position every frame
    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            mouseRef.current.x * 0.22,
            0.045,
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            -mouseRef.current.y * 0.12,
            0.045,
        );
    });

    return (
        <>
            {/* ── Lighting ── */}
            <ambientLight intensity={0.55} color="#dff0c0" />

            {/* Key light: upper-right, warm olive */}
            <directionalLight
                position={[5, 7, 4]}
                intensity={1.6}
                color="#c4e68a"
            />

            {/* Fill light: left, warm amber/gold */}
            <pointLight
                position={[-4, 2, 3]}
                intensity={1.1}
                color="#d4a340"
            />

            {/* Rim light: from behind, deep olive */}
            <pointLight
                position={[3, -4, -3]}
                intensity={0.45}
                color="#4a6020"
            />

            {/* Environment for reflections/refractions */}
            <Environment preset="city" />

            {/* ── All slabs inside mouse-reactive group ── */}
            <group ref={groupRef}>
                {SLABS.map((slab) => (
                    <GlassSlab key={slab.label} {...slab} />
                ))}
            </group>
        </>
    );
}

// ─── Exported canvas wrapper ────────────────────────────────────────────────
export default function DevMonolith() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5.4], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
    );
}
