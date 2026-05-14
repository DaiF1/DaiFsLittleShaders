export function degToRad(d) {
    return d * Math.PI / 180;
}

export function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export function vecLerp(u, v, t) {
    return [lerp(u[0], v[0], t), lerp(u[1], v[1], t), lerp(u[2], v[2], t)];
}

export function magnitude(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function normalize(v) {
    const mag = magnitude(v);
    return [v[0] / mag, v[1] / mag, v[2] / mag];
}
