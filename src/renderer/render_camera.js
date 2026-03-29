import { gl } from "../gl";
import { degToRad } from "../utils";
import { m4 } from "./m4";

export const PERSPECTIVE_CAMERA = "perspective"
export const ORTHOGRAPHIC_CAMERA = "orthographic"

export class RenderCamera
{
    constructor(type, params = {}) {
        this.type = type
        if (type === PERSPECTIVE_CAMERA) {
            this.fov = params.fov ? degToRad(params.fov) : degToRad(30);
            this.near = params.near ?? 1;
            this.far = params.far ?? 2000;

            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            this.projMatrix = m4.perspective(this.fov, aspect, this.near, this.far);
        }
        else if (type === ORTHOGRAPHIC_CAMERA) {
            // TODO
        }

        this.position = params.position ?? [35, 0, 0];
        this.target = params.target ?? [0, 0, 0];
        this.up = params.up ?? [0, 1, 0];

        this.cameraMatrix = m4.lookAt(this.position, this.target, this.up);
        this.viewMatrix = m4.inverse(this.cameraMatrix);
    }

    bindUniforms(program) {
        let viewUniformLoc = gl.getUniformLocation(program, "u_viewMatrix");
        gl.uniformMatrix4fv(viewUniformLoc, false, this.viewMatrix);

        let projectionUniformLoc = gl.getUniformLocation(program, "u_projectionMatrix");
        gl.uniformMatrix4fv(projectionUniformLoc, false, this.projMatrix);
    }
};
