import { gl } from "./gl";

let globalID = 0;

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


export class Shader
{
    constructor(vertex, fragment) {
        this.id = globalID++;

        this.program = this.compileShader(vertex, fragment);
    }

    compileShader(vertex, fragment) {
        let vertexShader = createShader(gl.VERTEX_SHADER, vertex);
        let fragmentShader = createShader(gl.FRAGMENT_SHADER, fragment);

        return createProgram(vertexShader, fragmentShader);
    }
};
