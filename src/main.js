import "../style.css"

import { initWebGL } from "./gl";
import { Scene } from "./renderer/scene";
import { loadScientificShading, renderScientificShading } from "./shadings/scientific/passes";

initWebGL();

const scene = Scene.fromGLTF("");

loadScientificShading(scene);

function renderLoop() {
    renderScientificShading();
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
