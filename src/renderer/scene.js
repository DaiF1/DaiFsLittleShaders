import { gl } from "./gl";
import { Mesh } from "./mesh";
import { SceneMesh } from "./scene_mesh";

const MAX_LIGHT_COUNT = 10;

export class Scene
{
    constructor(objects, lights = {}) {
        this.objects = objects ?? [];
        this.directionalLights = lights.directional ?? [];
        this.pointLights = lights.point ?? [];
    }

    render(shader) {
        const program = shader.program;

        const dirLightCount = Math.min(MAX_LIGHT_COUNT, this.directionalLights.length);
        const dirLightCountLoc = gl.getUniformLocation(program, "u_dirLightCount");
        if (dirLightCountLoc != null)
            gl.uniform1i(dirLightCountLoc, dirLightCount);

        for (let i = 0; i < dirLightCount; i++) {
            const dirLoc = gl.getUniformLocation(program, `u_dirLights[${i}].direction`);
            const colorLoc = gl.getUniformLocation(program, `u_dirLights[${i}].color`);
            const intensityLoc = gl.getUniformLocation(program, `u_dirLights[${i}].intensity`);

            const light = this.directionalLights[i];
            gl.uniform3fv(dirLoc, light.direction);
            gl.uniform3fv(colorLoc, light.color);
            gl.uniform1f(intensityLoc, light.intensity);
        }

        const pointLightCount = Math.min(MAX_LIGHT_COUNT, this.pointLights.length);
        const pointLightCountLoc = gl.getUniformLocation(program, "u_pointLightCount");
        if (pointLightCountLoc != null)
            gl.uniform1i(pointLightCountLoc, pointLightCount);

        for (let i = 0; i < pointLightCount; i++) {
            const posLoc = gl.getUniformLocation(program, `u_pointLights[${i}].position`);
            const colorLoc = gl.getUniformLocation(program, `u_pointLights[${i}].color`);
            const intensityLoc = gl.getUniformLocation(program, `u_pointLights[${i}].intensity`);

            const light = this.pointLights[i];
            gl.uniform3fv(posLoc, light.position);
            gl.uniform3fv(colorLoc, light.color);
            gl.uniform1f(intensityLoc, light.intensity);
        }

        for (let obj of this.objects)
            obj.draw(shader);
    }

    static getPostProcessPlane() {
        const plane = new Mesh([
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0,  1.0, 0.0,
            -1.0,  1.0, 0.0,
             1.0, -1.0, 0.0,
             1.0,  1.0, 0.0,
        ],
        [],
        [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ]);
        return new Scene([new SceneMesh(plane)]);
    }
};
