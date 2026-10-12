/**
 * Accent helpers. Each project carries an "r, g, b" accent used for glows and
 * borders; small text needs a lighter tint of it to stay legible on the dark
 * page (the raw indigo is only ~3.9:1 against the ink-950 surface).
 */
export const rgb = (accent: string, alpha?: number) =>
    alpha === undefined ? `rgb(${accent})` : `rgba(${accent}, ${alpha})`;

/** Text colour: the accent mixed toward white. */
export const ink = (accent: string) =>
    `color-mix(in srgb, rgb(${accent}) 62%, white)`;
