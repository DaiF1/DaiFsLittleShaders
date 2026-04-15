import "./style.css"

import renderVert from "./shaders/render.vert.js"
import renderFrag from "./shaders/render.frag.js"

import outlineVert from "./shaders/outline.vert.js"
import outlineFrag from "./shaders/outline.frag.js"

import shadowVert from "../common/shadow.vert.js"
import shadowFrag from "../common/shadow.frag.js"

import { RenderGraph } from "../../renderer/render_graph";
import { RenderPass } from "../../renderer/render_pass";
import { COLOR_TARGET, DEPTH_TARGET, RenderTexture } from "../../renderer/render_texture";
import { Texture } from "../../renderer/texture.js";
import { ORTHOGRAPHIC_CAMERA, RenderCamera } from "../../renderer/render_camera.js"
import { normalize } from "../../utils.js"
import { Shader } from "../../renderer/shader.js"
import { Scene } from "../../renderer/scene.js"

let renderGraph;

export function loadScientificShading(scene, mainCamera, sunDir) {
    const depthTextureSize = 2048;
    const shadowDepth = new RenderTexture(DEPTH_TARGET, {
        size: [depthTextureSize, depthTextureSize], 
        compareMode: true,
        filter: "linear",
    });

    const sun = normalize(sunDir);
    const sceneSize = 40;
    const shadowCamPos = [sun[0] * sceneSize, sun[1] * sceneSize, sun[2] * sceneSize];
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
            renderSize: [depthTextureSize, depthTextureSize],
            camera: shadowCamera,
            out: {
                depth: shadowDepth,
            },
            cullface: "front",
        });

    const palette = new Texture("./resources/vanilla-milkshake-1x.png");
    const renderImage = new RenderTexture(COLOR_TARGET);
    const renderNormal = new RenderTexture(COLOR_TARGET, { wrap: 'clamp' });
    const renderDepth = new RenderTexture(DEPTH_TARGET, { wrap: 'clamp' });

    let renderPass = new RenderPass(scene,
        new Shader(renderVert, renderFrag),
        {
            camera: mainCamera,
            uniforms: [
                { name: 'u_shadow', type: 't', value: shadowDepth },
                { name: 'u_palette', type: 't', value: palette },
                { name: 'u_shadowViewProj', type: 'm4', value: shadowCamera.viewProjMatrix },
            ],
            out: {
                colors: [renderImage, renderNormal],
                depth: renderDepth,
            },
        });

    let outlinePass = new RenderPass(Scene.getPostProcessPlane(),
        new Shader(outlineVert, outlineFrag),
        {
            camera: mainCamera,
            uniforms: [
                { name: "u_color", type: 't', value: renderImage },
                { name: "u_normal", type: 't', value: renderNormal },
                { name: "u_depth", type: 't', value: renderDepth },
            ]
        });

    renderGraph = new RenderGraph([
        shadowPass,
        renderPass,
        outlinePass,
    ]);
}

export function renderScientificShading() {
    renderGraph.render();
}
