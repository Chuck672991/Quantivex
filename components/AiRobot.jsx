'use client';

// The login screen's companion bot, 2026 styling: segmented floating parts —
// a helmet head hovering free of a tapered torso, detached pebble hands, a
// slow halo instead of an antenna — pearlescent shell with iridescence, a
// glass faceplate with digital eyes that blink and glance around, and
// counter-rotating hover rings underneath. Pure primitives, no model files;
// torn down cleanly on unmount.

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AiRobot() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0.6, 9.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Quality tier (lib/perf.ts): 0 full, 1 reduced, 2 minimal
    const tier = Number(document.documentElement.dataset.perf || 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, [1.5, 1.25, 1][tier] ?? 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    /* ---- materials ---- */
    // Pearlescent shell — iridescent clearcoat reads unmistakably "new".
    const shell = new THREE.MeshPhysicalMaterial({
      color: 0xdfe7f5,
      metalness: 0.35,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      iridescence: 0.55,
      iridescenceIOR: 1.6,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x05070d,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const cyan = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 2.2,
      metalness: 0,
      roughness: 0.4,
    });
    const indigo = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 1.4,
      metalness: 0,
      roughness: 0.4,
    });

    const bot = new THREE.Group();
    bot.position.set(0.2, 0.8, 0);
    scene.add(bot);

    /* ---- head: smooth helmet floating free of the body ---- */
    const head = new THREE.Group();
    head.position.y = 1.15;
    bot.add(head);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(1.0, 48, 32), shell);
    helmet.scale.set(1, 0.82, 0.9);
    head.add(helmet);

    // glass faceplate, proud of the helmet
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.99, 48, 32), glass);
    face.scale.set(0.86, 0.62, 0.55);
    face.position.set(0, -0.02, 0.42);
    head.add(face);

    // digital eyes — soft glowing capsules on the glass
    const eyeGeo = new THREE.CapsuleGeometry(0.075, 0.16, 8, 16);
    const eyeL = new THREE.Mesh(eyeGeo, cyan);
    const eyeR = new THREE.Mesh(eyeGeo, cyan);
    const eyes = new THREE.Group();
    eyeL.position.x = -0.26;
    eyeR.position.x = 0.26;
    eyes.add(eyeL, eyeR);
    eyes.position.set(0, 0.02, 0.98);
    head.add(eyes);

    // halo — the 2026 antenna
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.022, 12, 72), cyan.clone());
    halo.position.y = 1.05;
    halo.rotation.x = Math.PI / 2.4;
    head.add(halo);

    // ear pods
    const podGeo = new THREE.SphereGeometry(0.14, 20, 20);
    const podL = new THREE.Mesh(podGeo, glass);
    podL.scale.set(0.55, 1, 1);
    podL.position.set(-1.0, -0.02, 0);
    const podR = podL.clone();
    podR.position.x = 1.0;
    head.add(podL, podR);

    /* ---- torso: sleek tapered capsule, visibly separated from the head ---- */
    const torso = new THREE.Group();
    torso.position.y = -0.55;
    bot.add(torso);

    const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 0.7, 12, 32), shell);
    chest.scale.set(1, 1, 0.82);
    torso.add(chest);

    // glowing collar in the neck gap
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 12, 48), indigo);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.78;
    torso.add(collar);

    // chest slit — a thin light line, not a bulb
    const slit = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.5, 6, 12), cyan);
    slit.rotation.z = Math.PI / 2;
    slit.position.set(0, 0.22, 0.62);
    torso.add(slit);

    /* ---- detached floating hands ---- */
    const handGeo = new THREE.SphereGeometry(0.19, 24, 24);
    const handL = new THREE.Mesh(handGeo, shell);
    handL.scale.set(0.75, 1, 0.55);
    handL.position.set(-1.35, -0.55, 0.15);
    const handR = handL.clone();
    handR.position.x = 1.35;
    bot.add(handL, handR);

    /* ---- hover rings underneath, counter-rotating ---- */
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.028, 12, 72), cyan.clone());
    ringA.rotation.x = Math.PI / 2;
    ringA.position.y = -1.35;
    scene.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.02, 12, 64), indigo.clone());
    ringB.rotation.x = Math.PI / 2;
    ringB.position.y = -1.5;
    scene.add(ringB);

    /* ---- particles ---- */
    const pGeo = new THREE.BufferGeometry();
    const pCount = 80;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.04, transparent: true, opacity: 0.5 })
    );
    scene.add(particles);

    /* ---- lights ---- */
    scene.add(new THREE.AmbientLight(0xaebadd, 1.0));
    const frontLight = new THREE.DirectionalLight(0xe8f2ff, 1.8);
    frontLight.position.set(0.5, 2, 6);
    scene.add(frontLight);
    const keyLight = new THREE.PointLight(0x22d3ee, 70, 50);
    keyLight.position.set(4.5, 3.5, 4.5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x6366f1, 85, 50);
    rimLight.position.set(-5, 1.5, -3.5);
    scene.add(rimLight);
    const underGlow = new THREE.PointLight(0x22d3ee, 25, 10);
    underGlow.position.set(0, -1.6, 1.2);
    scene.add(underGlow);

    /* ---- interaction + animation ---- */
    // The head glances toward the cursor. Tracking is relative to the CENTER
    // of the whole viewport and clamped to a gentle range, so moving the
    // mouse over the form (well to the left of the bot) makes it glance
    // that way naturally instead of snapping to a hard, frozen stare —
    // which is what the old off-canvas math produced.
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    // Reduced-motion visitors get one static, well-posed frame
    // (t = 1.5 sits between blinks and waves) and no pointer tracking.
    const reduceMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointer.y = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
    };
    if (!reduceMotion) window.addEventListener('pointermove', onPointer);

    // raf === 0 means the loop is stopped. performance.now() replaces
    // THREE.Clock, which three r183 deprecates (it logs a console warning).
    let raf = 0;
    const startedAt = performance.now();
    const draw = () => {
      const t = reduceMotion ? 1.5 : (performance.now() - startedAt) / 1000;

      // segmented float: head, torso and hands ride slightly out of phase —
      // the parts feel independently suspended
      head.position.y = 1.15 + Math.sin(t * 1.5) * 0.1;
      torso.position.y = -0.55 + Math.sin(t * 1.5 - 0.6) * 0.07;
      handL.position.y = -0.55 + Math.sin(t * 1.5 - 1.1) * 0.12;
      handR.position.y = -0.55 + Math.sin(t * 1.5 - 1.6) * 0.12;
      bot.rotation.z = Math.sin(t * 0.6) * 0.02;

      // head tracks the pointer
      head.rotation.y += (pointer.x * 0.5 - head.rotation.y) * 0.06;
      head.rotation.x += (pointer.y * 0.28 - head.rotation.x) * 0.06;

      // eyes: blink every ~3.6s, glance sideways every ~5s
      const bc = t % 3.6;
      const eyeScale = bc > 3.38 ? Math.max(0.1, Math.abs(Math.cos((bc - 3.38) / 0.22 * Math.PI))) : 1;
      eyeL.scale.y = eyeScale;
      eyeR.scale.y = eyeScale;
      const glance = Math.sin(t * 0.4) > 0.92 ? 0.12 : 0;
      eyes.position.x += (glance - eyes.position.x) * 0.08;

      // halo spin + pulse
      halo.rotation.z = t * 0.6;
      halo.material.emissiveIntensity = 1.6 + Math.sin(t * 2.4) * 0.6;

      // hover rings counter-rotate and breathe
      ringA.rotation.z = t * 0.5;
      ringB.rotation.z = -t * 0.8;
      ringA.material.emissiveIntensity = 1.4 + Math.sin(t * 1.6) * 0.5;
      ringA.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);
      ringB.scale.setScalar(1 + Math.sin(t * 1.6 + 1.2) * 0.05);

      // chest slit shimmer
      slit.material.emissiveIntensity = 1.6 + Math.sin(t * 3.1) * 0.7;

      // a hand lifts in greeting every ~7s
      const wave = t % 7;
      if (wave < 1.2) {
        handR.position.y += Math.sin((wave / 1.2) * Math.PI) * 0.55;
        handR.rotation.z = Math.sin(wave * Math.PI * 4) * 0.25;
      } else {
        handR.rotation.z *= 0.92;
      }

      particles.rotation.y = t * 0.03;
      renderer.render(scene, camera);
    };

    // Weaker tiers draw at ~30fps
    const minGap = tier >= 1 ? 30 : 0;
    let lastDraw = 0;
    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      if (minGap && now - lastDraw < minGap) return;
      lastDraw = now;
      draw();
    };
    const start = () => {
      if (!raf && !reduceMotion) animate();
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // A resize while paused (or static) still repaints, so the canvas never
    // shows a stretched or blank frame.
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!raf) draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Only spend frames while the bot is on (or just off) screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '120px' }
    );
    io.observe(mount);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="login-robot" aria-hidden="true" />;
}
