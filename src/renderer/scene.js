import { Mesh } from "./mesh";
import { SceneMesh } from "./scene_mesh";

export class Scene
{
    constructor(objects) {
        this.objects = objects;
    }

    render(program) {
        for (let obj of this.objects)
            obj.draw(program);
    }

    static getPostProcessPlane() {
    }
};
