import { gl } from "../gl";

export class Mesh
{
    constructor(vertices, normals, uvs) {
        this.vertices = [
          // left column front
            0,   0,  0,
           30,   0,  0,
            0, 150,  0,
            0, 150,  0,
           30,   0,  0,
           30, 150,  0,

          // top rung front
           30,   0,  0,
          100,   0,  0,
           30,  30,  0,
           30,  30,  0,
          100,   0,  0,
          100,  30,  0,

          // middle rung front
           30,  60,  0,
           67,  60,  0,
           30,  90,  0,
           30,  90,  0,
           67,  60,  0,
           67,  90,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   30,  30,
          30,   60,  30,
          30,   30,   0,
          30,   60,  30,
          30,   60,   0,

          // top of middle rung
          30,   60,   0,
          30,   60,  30,
          67,   60,  30,
          30,   60,   0,
          67,   60,  30,
          67,   60,   0,

          // right of middle rung
          67,   60,   0,
          67,   60,  30,
          67,   90,  30,
          67,   60,   0,
          67,   90,  30,
          67,   90,   0,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,   90,  30,
          30,  150,  30,
          30,   90,   0,
          30,  150,  30,
          30,  150,   0,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,
        ];
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
};
