import { gl } from "../gl";
import { parseOBJ } from "../utils";

export class Mesh
{
    constructor(vertices, normals, uvs) {
        this.vertices = vertices;
        this.normals = normals;
        this.uvs = uvs;

        this.programCache = {};
    }

    createVAO(program) {
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        let posAttribLocation = gl.getAttribLocation(program, "a_position");
        let posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(posAttribLocation);
        gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);

        return vao;
    }

    draw(program) {
        let vao = this.programCache[program];
        if (vao == null) {
            vao = this.createVAO(program);
            this.programCache[program] = vao;
        }
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    static async fromOBJ(file) {
        const text = await (await fetch(file)).text();
        const data = parseOBJ(text);
        return new Mesh(data.position, data.normal, data.texcoord);
    }
};
