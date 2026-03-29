import "../style.css"

import { initWebGL } from "./gl";
import { Mesh } from "./renderer/mesh";
import { Scene } from "./renderer/scene";
import { SceneMesh } from "./renderer/scene_mesh";
import { loadScientificShading, renderScientificShading } from "./shadings/scientific/passes";
import { degToRad } from "./utils";

async function main() {
    initWebGL();

    const planet = new SceneMesh(await Mesh.fromOBJ("./resources/planet.obj"), [-11, -36, 0]);
    const car = new SceneMesh(await Mesh.fromOBJ("./resources/car.obj"), [8, -2, 0], [0, 0, -degToRad(30)]);
    const scene = new Scene([planet, car]);

    loadScientificShading(scene);

    let startTime = 0.0
    function renderLoop(currentTime) {
        currentTime *= 0.001;
        let deltaTime = currentTime - startTime;
        planet.rotateZ(-10 * deltaTime);

        startTime = currentTime;

        renderScientificShading();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

main();
