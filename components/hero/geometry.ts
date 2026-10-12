import * as THREE from 'three';

/** Rectangle with rounded corners, centred on the origin (XY plane). */
const roundedRect = (w: number, d: number, r: number) => {
    const x = -w / 2;
    const y = -d / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    shape.lineTo(x + w, y + d - r);
    shape.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
    shape.lineTo(x + r, y + d);
    shape.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
    shape.lineTo(x, y + r);
    shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return shape;
};

interface SlabHoleOptions {
    width: number;
    depth: number;
    height: number;
    holeRadius: number;
    /** Hole centre relative to the slab centre, in the slab's own XZ plane. */
    holeOffset?: [number, number];
    corner?: number;
    bevel?: number;
}

/**
 * A slab with a round hole through it, y-up, centred on the origin. The
 * bowl that closes the hole is a separate mesh so it can be shaded on its own.
 */
export const slabWithHoleGeometry = ({
    width,
    depth,
    height,
    holeRadius,
    holeOffset = [0, 0],
    corner = 0.12,
    bevel = 0.045,
}: SlabHoleOptions) => {
    const shape = roundedRect(width - bevel * 2, depth - bevel * 2, corner);
    const hole = new THREE.Path();
    // Shape y becomes -z once the geometry is stood upright
    hole.absarc(
        holeOffset[0],
        -holeOffset[1],
        holeRadius - bevel,
        0,
        Math.PI * 2,
        true,
    );
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 4,
        curveSegments: 72,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -height / 2 + bevel, 0);
    geometry.computeVertexNormals();
    return geometry;
};

/** Height of a spherical dish's floor at distance `rho` from its centre. */
export const bowlProfile = (rimRadius: number, depth: number) => {
    const sphereRadius = (rimRadius * rimRadius + depth * depth) / (2 * depth);
    const thetaMax = Math.asin(rimRadius / sphereRadius);
    return {
        sphereRadius,
        thetaMax,
        /** Floor height relative to the rim (0 at the rim, -depth at the centre). */
        floorAt: (rho: number) => {
            const clamped = Math.min(rho, rimRadius);
            return (
                -depth +
                (sphereRadius -
                    Math.sqrt(sphereRadius * sphereRadius - clamped * clamped))
            );
        },
    };
};

/** Concave spherical dish whose rim sits at y = 0 and whose floor is at y = -depth. */
export const bowlGeometry = (rimRadius: number, depth: number) => {
    const { sphereRadius, thetaMax } = bowlProfile(rimRadius, depth);
    const geometry = new THREE.SphereGeometry(
        sphereRadius,
        96,
        40,
        0,
        Math.PI * 2,
        Math.PI - thetaMax,
        thetaMax,
    );
    geometry.translate(0, -depth + sphereRadius, 0);
    return geometry;
};

/** An open "C" ring, standing on y = 0 and rising by `depth`. */
export const cRingGeometry = (
    outer: number,
    inner: number,
    startAngle: number,
    endAngle: number,
    depth: number,
) => {
    const bevel = Math.min(0.02, depth / 3);
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outer - bevel, startAngle, endAngle, false);
    shape.absarc(0, 0, inner + bevel, endAngle, startAngle, true);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
        curveSegments: 64,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, bevel, 0);
    geometry.computeVertexNormals();
    return geometry;
};

/** A flat disc with a softly bevelled rim, base at y = 0. */
export const coinGeometry = (radius: number, height: number, bevel = 0.035) => {
    const points = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(radius - bevel, 0),
        new THREE.Vector2(radius, bevel * 0.9),
        new THREE.Vector2(radius, height - bevel * 0.9),
        new THREE.Vector2(radius - bevel, height),
        new THREE.Vector2(0, height),
    ];
    return new THREE.LatheGeometry(points, 96);
};

/** A glossy dome-topped button, base at y = 0. */
export const domeButtonGeometry = (
    radius: number,
    wall: number,
    dome: number,
) => {
    const points: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(radius, 0),
    ];
    points.push(new THREE.Vector2(radius, wall));
    const steps = 24;
    for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        const angle = (t * Math.PI) / 2;
        points.push(
            new THREE.Vector2(
                Math.cos(angle) * radius,
                wall + Math.sin(angle) * dome,
            ),
        );
    }
    return new THREE.LatheGeometry(points, 96);
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

interface Ridge {
    /** Position across the ridge lines. */
    at: number;
    width: number;
    height: number;
    /** Ripple along the ridge: frequency and phase. */
    wave?: [number, number];
    /** Fine corrugation across the ridge: frequency and relative depth. */
    bands?: [number, number];
    /** Only exists between these positions along the ridge (soft edges). */
    span?: [number, number];
}

/**
 * A field of soft dunes. Heights come from a few gaussian ridges, rippled
 * along their length. The vertex alpha fades to 0 where the surface meets the
 * ground, so the flat margin of the plane never shows as a rectangle.
 */
export const duneGeometry = (
    width: number,
    depth: number,
    ridges: Ridge[],
    segments = 150,
) => {
    const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    const position = geometry.attributes.position;
    const colors = new Float32Array(position.count * 4);

    for (let i = 0; i < position.count; i += 1) {
        const px = position.getX(i);
        const py = position.getY(i);
        const edge =
            smoothstep(-width / 2, -width / 2 + width * 0.12, px) *
            smoothstep(width / 2, width / 2 - width * 0.12, px) *
            smoothstep(-depth / 2, -depth / 2 + depth * 0.12, py) *
            smoothstep(depth / 2, depth / 2 - depth * 0.12, py);

        let h = 0;
        for (const ridge of ridges) {
            const t = (px - ridge.at) / ridge.width;
            const ripple = ridge.wave
                ? 0.82 + 0.18 * Math.cos(py * ridge.wave[0] + ridge.wave[1])
                : 1;
            const bands = ridge.bands
                ? 1 -
                  ridge.bands[1] *
                      (0.5 + 0.5 * Math.cos((px - ridge.at) * ridge.bands[0]))
                : 1;
            const span = ridge.span
                ? smoothstep(ridge.span[0] - 1.6, ridge.span[0], py) *
                  (1 - smoothstep(ridge.span[1], ridge.span[1] + 1.6, py))
                : 1;
            h += ridge.height * Math.exp(-t * t) * ripple * bands * span;
        }
        h *= edge;

        position.setZ(i, h);
        colors[i * 4] = 1;
        colors[i * 4 + 1] = 1;
        colors[i * 4 + 2] = 1;
        colors[i * 4 + 3] = smoothstep(0.0, 0.09, h);
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    return geometry;
};
