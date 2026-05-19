import { gl } from "./gl";
import { degToRad, vecLerp } from "../utils/math";
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
            this.left = params.left ?? -100;
            this.right = params.right ?? 100;
            this.bottom = params.left ?? 100;
            this.top = params.right ?? -100;
            this.far = params.far ?? -400;
            this.near = params.near ?? 400;
            this.projMatrix = m4.orthographic(this.left, this.right,
                this.bottom, this.top,
                this.near, this.far
            );
        }

        this.position = params.position ?? [35, 0, 0];
        this.target = params.target ?? [0, 0, 0];
        this.up = params.up ?? [0, 1, 0];

        this.cameraMatrix = m4.lookAt(this.position, this.target, this.up);
        this.viewMatrix = m4.inverse(this.cameraMatrix);

        this.needsUpdate = false;
    }

    bindUniforms(program) {
        let viewUniformLoc = gl.getUniformLocation(program, "u_viewMatrix");
        if (viewUniformLoc != null)
            gl.uniformMatrix4fv(viewUniformLoc, false, this.viewMatrix);

        let projectionUniformLoc = gl.getUniformLocation(program, "u_projectionMatrix");
        if (projectionUniformLoc != null)
            gl.uniformMatrix4fv(projectionUniformLoc, false, this.projMatrix);

        let positionUniformLoc = gl.getUniformLocation(program, "u_cameraPosition");
        if (positionUniformLoc != null)
            gl.uniform3fv(positionUniformLoc, this.position);

        let nearUniformLoc = gl.getUniformLocation(program, "u_near");
        if (nearUniformLoc != null)
            gl.uniform1f(nearUniformLoc, this.near);

        let farUniformLoc = gl.getUniformLocation(program, "u_far");
        if (farUniformLoc != null)
            gl.uniform1f(farUniformLoc, this.far);

        let viewportUniformLoc = gl.getUniformLocation(program, "u_viewportSize");
        if (viewportUniformLoc != null)
            gl.uniform2fv(viewportUniformLoc, [gl.canvas.width, gl.canvas.height]);
    }

    moveCamera(newPosition, newTarget) {
        this.startPosition = this.position;
        this.targetPosition = newPosition;
        this.startTarget = this.target;
        this.targetTarget = newTarget;

        this.needsUpdate = true;
        this.timeElapsed = 0.0;
    }

    update(dt) {
        if (!this.needsUpdate)
            return;

        this.timeElapsed += dt;
        if (this.timeElapsed >= 1.0)
            this.timeElapsed = 1.0;

        this.position = vecLerp(this.startPosition, this.targetPosition, this.timeElapsed);
        this.target = vecLerp(this.startTarget, this.targetTarget, this.timeElapsed);

        this.cameraMatrix = m4.lookAt(this.position, this.target, this.up);
        this.viewMatrix = m4.inverse(this.cameraMatrix);

        if (this.timeElapsed >= 1.0)
            this.needsUpdate = false;
    }

    recalculateMatrix() {
        if (this.type === PERSPECTIVE_CAMERA) {
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            this.projMatrix = m4.perspective(this.fov, aspect, this.near, this.far);
        }
        else if (this.type === ORTHOGRAPHIC_CAMERA) {
            // TODO
        }
    }

    get viewProjMatrix() {
        return m4.multiply(this.projMatrix, this.viewMatrix);
    }
};
