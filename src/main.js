import "../style.css"

import { initWebGL } from "./renderer/gl";
import { Mesh } from "./renderer/mesh";
import { PERSPECTIVE_CAMERA, RenderCamera } from "./renderer/render_camera";
import { Scene } from "./renderer/scene";
import { SceneMesh } from "./renderer/scene_mesh";
import { loadScientificShading, renderScientificShading } from "./shadings/scientific/passes";
import { initUI } from "./ui";
import { degToRad } from "./utils";

async function main() {
    initWebGL();
    const planet = new SceneMesh(await Mesh.fromOBJ("./resources/planet.obj"), [-11, -36, 0]);
    const car = new SceneMesh(await Mesh.fromOBJ("./resources/car.obj"), [8, -1.5, 0], [0, 0, -degToRad(29)]);
    const scene = new Scene([planet, car]);

    const mainCamera = new RenderCamera(PERSPECTIVE_CAMERA);

    loadScientificShading(scene, mainCamera);

    let useFarCam = false;
    initUI({
        cameraCallback: () => {
            useFarCam = !useFarCam;
            const pos = useFarCam ? [45, 30, 55] : [35, 0, 0];
            const target = useFarCam ? [-5, 0, 0] : [0, 0, 0];
            mainCamera.moveCamera(pos, target);
        }
    });

    let startTime = 0.0
    function renderLoop(currentTime) {
        currentTime *= 0.001;
        let dt = currentTime - startTime;

        planet.rotateZ(-10 * dt);
        mainCamera.update(dt);

        startTime = currentTime;

        renderScientificShading();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

main();
