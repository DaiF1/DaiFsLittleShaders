import { gl } from "./gl";
import { degToRad } from "../utils";
import { m4 } from "./m4";

export class SceneMesh
{
    constructor(mesh, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
        this.mesh = mesh;

        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.positionMat = m4.translation(position[0], position[1], position[2]);
        this.rotationMat = m4.xRotation(rotation[0]);
        this.rotationMat = m4.yRotate(this.rotationMat, rotation[1]);
        this.rotationMat = m4.zRotate(this.rotationMat, rotation[2]);
        this.scaleMat = m4.scaling(scale[0], scale[1], scale[2]);

        this.computeMatrix();
    }

    computeMatrix() {
        this.matrix = m4.multiply(this.positionMat, m4.multiply(this.scaleMat, this.rotationMat));
    }

    draw(program) {
        let matrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
        gl.uniformMatrix4fv(matrixLocation, false, this.matrix);

        this.mesh.draw(program);
    }

    rotateX(deg) {
        this.rotationMat = m4.xRotate(this.rotationMat, degToRad(deg));
        this.computeMatrix();
    }

    setRotationX(deg) {
        this.rotation[0] = degToRad(deg);;
        this.rotationMat = m4.xRotation(this.rotation[0]);
        this.rotationMat = m4.yRotate(this.rotationMat, this.rotation[1]);
        this.rotationMat = m4.zRotate(this.rotationMat, this.rotation[2]);
        this.computeMatrix();
    }

    rotateY(deg) {
        this.rotationMat = m4.yRotate(this.rotationMat, degToRad(deg));
        this.computeMatrix();
    }

    setRotationY(deg) {
        this.rotation[1] = degToRad(deg);;
        this.rotationMat = m4.xRotation(this.rotation[0]);
        this.rotationMat = m4.yRotate(this.rotationMat, this.rotation[1]);
        this.rotationMat = m4.zRotate(this.rotationMat, this.rotation[2]);
        this.computeMatrix();
    }

    rotateZ(deg) {
        this.rotationMat = m4.zRotate(this.rotationMat, degToRad(deg));
        this.computeMatrix();
    }

    setRotationZ(deg) {
        this.rotation[2] = degToRad(deg);;
        this.rotationMat = m4.xRotation(this.rotation[0]);
        this.rotationMat = m4.yRotate(this.rotationMat, this.rotation[1]);
        this.rotationMat = m4.zRotate(this.rotationMat, this.rotation[2]);
        this.computeMatrix();
    }
};
