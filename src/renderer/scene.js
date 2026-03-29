import { Mesh } from "./mesh";
import { SceneMesh } from "./scene_mesh";
import { degToRad } from "../utils";

export class Scene
{
    constructor(objects) {
        this.objects = objects;
    }

    render(program) {
        for (let obj of this.objects)
            obj.draw(program);
    }

    static fromGLTF() {
        let mesh = new Mesh();
        let obj = new SceneMesh(mesh, [-150, 0, -360], [degToRad(190), degToRad(40), degToRad(30)], [1, 1, 1]);
        return new Scene([obj]);
    }

    static getPostProcessPlane() {
    }
};
