import { gl } from "../gl";
import { m4 } from "./m4";

export class SceneMesh
{
    constructor(mesh, position, rotation, scale) {
        this.mesh = mesh;

        this.matrix = m4.translation(position[0], position[1], position[2]);
        this.matrix = m4.xRotate(this.matrix, rotation[0]);
        this.matrix = m4.yRotate(this.matrix, rotation[1]);
        this.matrix = m4.zRotate(this.matrix, rotation[2]);
        this.matrix = m4.scale(this.matrix, scale[0], scale[1], scale[2]);
    }

    draw(program) {
        let matrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
        gl.uniformMatrix4fv(matrixLocation, false, this.matrix);

        this.mesh.draw(program);
    }
};
