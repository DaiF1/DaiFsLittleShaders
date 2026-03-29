import { initResizeObserver } from "./resize";

export let gl = null;

export function initWebGL() {
    let canvas = document.getElementById("c");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl = canvas.getContext("webgl2");
    gl.viewport(0, 0, canvas.width, canvas.height);

    if (!gl) {
        console.error("Does not support webgl2");
        return;
    }

    initResizeObserver(canvas);
}


