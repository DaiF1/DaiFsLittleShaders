import { gl } from "./gl";

function bindUniform(location, type, value) {
    switch (type) {
        case 'm4':
            gl.uniformMatrix4fv(location, false, value);
            break;
        case 't':
            gl.uniform1i(location, value);
            break;
        case 'f':
            gl.uniform1f(location, value);
            break;
        default:
            console.error(`Type not supported: ${type}`);
    }
}

function stringToCullFace(s) {
    switch (s) {
        case "front":
            return gl.FRONT;
        case "back":
            return gl.BACK;
        case "double":
            return gl.FRONT_AND_BACK;
    }
}

export class RenderPass
{
    static lastId = 0;

    constructor(scene, shader, params) {
        this.id = RenderPass.lastId++;

        this.scene = scene;
        this.camera = params.camera ?? null;

        this.shader = shader;

        this.out = params.out;
        this.camera = params.camera ?? null;

        this.renderWidth = params.renderSize ? params.renderSize[0] : null;
        this.renderHeight = params.renderSize ? params.renderSize[1] : null;

        this.uniforms = params.uniforms ?? [];

        this.cullface = params.cullface ?? "back";
    }

    run(screenResized, elapsedTime) {
        if (this.cullface !== "none") {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(stringToCullFace(this.cullface));
        } else
            gl.disable(gl.CULL_FACE);

        gl.enable(gl.DEPTH_TEST); // TODO: add an option for depth test

        gl.useProgram(this.shader.program);

        if (this.camera != null) {
            if (screenResized)
                this.camera.recalculateMatrix();
            this.camera.bindUniforms(this.shader.program);
        }

        let textureID = 0;
        for (let u of this.uniforms) {
            let value = u.value;
            if (u.type === 't') {
                const currId = textureID++;
                u.value.bind(currId);
                value = currId;
            }

            const loc = gl.getUniformLocation(this.shader.program, u.name);
            bindUniform(loc, u.type, value);
        }

        const loc = gl.getUniformLocation(this.shader.program, "u_time");
        bindUniform(loc, "f", elapsedTime);

        this.scene.render(this.shader);
    }
};
