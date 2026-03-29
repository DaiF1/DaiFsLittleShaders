import { gl } from "./gl";

function createShader(type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
        return shader;

    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success)
        return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export class RenderPass
{
    constructor(scene, shader, params) {
        this.scene = scene;
        this.camera = params.camera ?? null;

        this.program = this.compileShader(shader.vertex, shader.fragment);

        this.in = params.in ?? [];
        this.out = params.out ?? [];
        this.camera = params.camera ?? null;

        this.textures = params.textures ?? [];
    }

    compileShader(vertex, fragment) {
        let vertexShader = createShader(gl.VERTEX_SHADER, vertex);
        let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragment);

        return createProgram(vertexShader, fragmentShader);
    }

    run(screenResized) {
        gl.enable(gl.CULL_FACE); // TODO: add an option for backface, frontface, both
        gl.enable(gl.DEPTH_TEST); // TODO: add an option for depth test

        gl.useProgram(this.program);

        if (this.camera != null) {
            if (screenResized)
                this.camera.recalculateMatrix();
            this.camera.bindUniforms(this.program);
        }

        for (let id in this.textures) {
            const tex = this.textures[id];
            tex.bind(this.program, id);
        }

        this.scene.render(this.program);
    }
};
