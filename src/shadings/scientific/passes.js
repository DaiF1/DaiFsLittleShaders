import "./style.css"

import { PERSPECTIVE_CAMERA, RenderCamera } from "../../renderer/render_camera";
import { RenderGraph } from "../../renderer/render_graph";
import { RenderPass } from "../../renderer/render_pass";
import { COLOR_TARGET, DEPTH_TARGET, RenderTarget } from "../../renderer/render_target";
import { Scene } from "../../renderer/scene";

import renderVert from "./shaders/render.vert.js"
import renderFrag from "./shaders/render.frag.js"
import { Texture } from "../../renderer/texture.js";

let renderGraph;

export function loadScientificShading(scene, mainCamera) {
    /*
    let color = new RenderTarget(COLOR_TARGET);
    let shadow = new RenderTarget(DEPTH_TARGET);

    let shadowCamera = new RenderCamera();
    let renderCamera = new RenderCamera();

    let shadowPass = new RenderPass(scene,
        {
            vertex: "",
            fragment: "",
        },
        {
            camera: shadowCamera,
            out: [shadow],
        });
    let renderPass = new RenderPass(scene,
        {
            vertex: "",
            fragment: "",
        },
        {
            camera: renderCamera,
            in: [shadow],
            out: [color],
        });
    let outlinePass = new RenderPass(Scene.getPostProcessPlane(), 
        {
            vertex: "",
            fragment: "",
        },
        {
            in: [color],
            uniforms: [
                { name: "thickness", type: "f" }
            ]
        });

    renderGraph = new RenderGraph([
        shadowPass, renderPass, outlinePass
    ]);
    */

    const palette = new Texture("./resources/vanilla-milkshake-1x.png", "u_palette");
    let renderPass = new RenderPass(scene,
        {
            vertex: renderVert,
            fragment: renderFrag,
        },
        {
            camera: mainCamera,
            textures: [
                palette,
            ],
        });

    renderGraph = new RenderGraph([
        renderPass
    ]);
}

export function renderScientificShading() {
    renderGraph.render();
}
