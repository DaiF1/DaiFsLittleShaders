import "./style.css"

import renderVert from "./shaders/render.vert.js"
import renderFrag from "./shaders/render.frag.js"

import shadowVert from "../common/shadow.vert.js"
import shadowFrag from "../common/shadow.frag.js"

import { RenderGraph } from "../../renderer/render_graph";
import { RenderPass } from "../../renderer/render_pass";
import { COLOR_TARGET, DEPTH_TARGET, RenderTexture } from "../../renderer/render_texture";
import { Texture } from "../../renderer/texture.js";
import { ORTHOGRAPHIC_CAMERA, RenderCamera } from "../../renderer/render_camera.js"
import { normalize } from "../../utils.js"
import { Shader } from "../../renderer/shader.js"

let renderGraph;

export function loadScientificShading(scene, mainCamera, sunDir) {
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

    let shadowDepth = new RenderTexture(DEPTH_TARGET, [2048, 2048], "u_shadow");

    const sun = normalize(sunDir);
    const sceneSize = 40;
    const shadowCamPos = [-sun[0] * sceneSize, -sun[1] * sceneSize, -sun[2] * sceneSize];
    const up = Math.abs(sun.y) > 0.99 ? [1, 0, 0] : [0, 1, 0];

    const extent = sceneSize * 1.2;
    let shadowCamera = new RenderCamera(ORTHOGRAPHIC_CAMERA, {
        position: shadowCamPos,
        target: [0, 0, 0],
        up: up,

        near: 0.1,
        far: sceneSize * 4,
        left: -extent,
        right: extent,
        top: -extent,
        bottom: extent,
    });
    let shadowPass = new RenderPass(scene,
        new Shader(shadowVert, shadowFrag),
        {
            renderSize: [2048, 2048],
            camera: shadowCamera,
            out: {
                depth: shadowDepth,
            }
        });

    const palette = new Texture("./resources/vanilla-milkshake-1x.png", "u_palette");
    let renderPass = new RenderPass(scene,
        new Shader(renderVert, renderFrag),
        {
            camera: mainCamera,
            textures: [
                shadowDepth,
                palette,
            ],
            uniforms: [
                { name: 'u_shadowViewProj', type: 'm4', value: shadowCamera.viewProjMatrix },
            ]
        });

    renderGraph = new RenderGraph([
        shadowPass,
        renderPass,
    ]);
}

export function renderScientificShading() {
    renderGraph.render();
}
