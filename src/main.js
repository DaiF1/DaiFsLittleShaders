import "../style.css"

import { initWebGL } from "./renderer/gl";
import { Mesh } from "./renderer/mesh";
import { PERSPECTIVE_CAMERA, RenderCamera } from "./renderer/render_camera";
import { Scene } from "./renderer/scene";
import { SceneMesh } from "./renderer/scene_mesh";
import { initUI } from "./ui";
import { degToRad } from "./utils/math";

// Shadings
import { loadPBRShading, renderPBRShading } from "./shadings/pbr/passes";
import { loadScientificShading, renderScientificShading } from "./shadings/scientific/passes";
import { loadHanddrawnShading, renderHanddrawnShading } from "./shadings/handdrawn/passes";

async function main() {
    initWebGL();

    // Scene Setup
    const planet = new SceneMesh(await Mesh.fromOBJ("./resources/planet.obj"), [-11, -36, 0]);
    const car = new SceneMesh(await Mesh.fromOBJ("./resources/car.obj"), [8, -1.5, 0], [0, 0, -degToRad(29)]);

    const sunDir = [-2, 5, -6];
    const scene = new Scene([car, planet], {
        directional: [
            { direction: sunDir, color: [1, 0.8, 0.6], intensity: 1 },
        ],
        point: [
            { position: [9.6, -3, 0.78], color: [1, 0, 0], intensity: 0.3 },
            { position: [9.6, -3, -0.78], color: [1, 0, 0], intensity: 0.3 },
            { position: [5.3, -0.5, 0.7], color: [1, 1, 0], intensity: 0.7 },
            { position: [5.3, -0.5, -0.7], color: [1, 1, 0], intensity: 0.7 },
        ],
    });

    // Shaders setup
    const shadingFunctions = {
        "pbr": { load: loadPBRShading, render: renderPBRShading },
        "scientific": { load: loadScientificShading, render: renderScientificShading },
        "handdrawn": { load: loadHanddrawnShading, render: renderHanddrawnShading },
    }
    let currentShading = "pbr";
    document.body.classList = currentShading;

    let camIndex = 0;
    const camPos = [
        [30, 0, 0],
        [25, 0, 15],
        [45, 30, 55],
        [10, 0, 0],
    ];
    const camTarget = [
        [0, 0, 0],
        [0, 1, 0],
        [-5, 0, 0],
        [0, 2, 0],
    ];
    const mainCamera = new RenderCamera(PERSPECTIVE_CAMERA, {
        position: camPos[camIndex],
    });

    initUI({
        cameraCallback: () => {
            camIndex = (camIndex + 1) % camPos.length;
            const pos = camPos[camIndex];
            const target = camTarget[camIndex];
            mainCamera.moveCamera(pos, target);
        },
        shadingCallback: (newShading) => {
            currentShading = newShading;
            shadingFunctions[currentShading].load(scene, mainCamera, sunDir);
            document.body.classList = newShading;
        },
    });

    // Drawing scene
    shadingFunctions[currentShading].load(scene, mainCamera, sunDir);

    let startTime = 0.0
    let elapsedTime = 0.0;
    function renderLoop(currentTime) {
        currentTime *= 0.001;
        let dt = currentTime - startTime;
        elapsedTime += dt;

        planet.rotateZ(-10 * dt);
        mainCamera.update(dt);

        startTime = currentTime;

        shadingFunctions[currentShading].render(elapsedTime);
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

main();
