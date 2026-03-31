import { gl } from "./gl";

function bindUniform(location, type, value) {
    switch (type) {
        case 'm4':
            gl.uniformMatrix4fv(location, false, value);
            break;
    }
}

export class RenderPass
{
    constructor(scene, shader, params) {
        this.scene = scene;
        this.camera = params.camera ?? null;

        this.shader = shader;

        this.out = params.out;
        this.camera = params.camera ?? null;

        this.renderWidth = params.renderSize ? params.renderSize[0] : null;
        this.renderHeight = params.renderSize ? params.renderSize[1] : null;

        this.textures = params.textures ?? [];
        this.uniforms = params.uniforms ?? [];
    }

    run(screenResized) {
        gl.enable(gl.CULL_FACE); // TODO: add an option for backface, frontface, both
        gl.enable(gl.DEPTH_TEST); // TODO: add an option for depth test

        gl.useProgram(this.shader.program);

        if (this.camera != null) {
            if (screenResized)
                this.camera.recalculateMatrix();
            this.camera.bindUniforms(this.shader.program);
        }

        for (let id in this.textures) {
            const tex = this.textures[id];
            tex.bind(this.shader.program, id);
        }

        for (let u of this.uniforms) {
            const loc = gl.getUniformLocation(this.shader.program, u.name);
            bindUniform(loc, u.type, u.value);
        }

        this.scene.render(this.shader);
    }
};
