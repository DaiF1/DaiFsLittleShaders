import "./style.css"

import renderVert from "./shaders/render.vert.js"
import renderFrag from "./shaders/render.frag.js"

import shadowVert from "../common/shadow.vert.js"
import shadowFrag from "../common/shadow.frag.js"

import { RenderGraph } from "../../renderer/render_graph";
import { RenderPass } from "../../renderer/render_pass";
import { DEPTH_TARGET, RenderTexture } from "../../renderer/render_texture";
import { Texture } from "../../renderer/texture.js";
import { ORTHOGRAPHIC_CAMERA, RenderCamera } from "../../renderer/render_camera.js"
import { normalize } from "../../utils/math.js"
import { Shader } from "../../renderer/shader.js"

let renderGraph = null;

export function loadPBRShading(scene, mainCamera, sunDir) {
    if (renderGraph != null)
        return;

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
    const roughness = new Texture("./resources/roughness.png");
    const metallic = new Texture("./resources/metallic.png");

    const diffuse = new Texture("./resources/ibl/grasslands_sunset/ibl_irradiance_cube.dds");
    const specular = new Texture("./resources/ibl/grasslands_sunset/ibl_specular_cube.dds");
    const brdf_lookup = new Texture("./resources/ibl/grasslands_sunset/brdf_look_up_table.dds");

    let renderPass = new RenderPass(scene,
        new Shader(renderVert, renderFrag),
        {
            camera: mainCamera,
            uniforms: [
                { name: 'u_shadow', type: 't', value: shadowDepth },
                { name: 'u_palette', type: 't', value: palette },
                { name: 'u_roughness', type: 't', value: roughness },
                { name: 'u_metallic', type: 't', value: metallic },
                { name: 'u_diffuse', type: 't', value: diffuse },
                { name: 'u_specular', type: 't', value: specular },
                { name: 'u_brdf', type: 't', value: brdf_lookup },
                { name: 'u_shadowViewProj', type: 'm4', value: shadowCamera.viewProjMatrix },
            ],
        });

    renderGraph = new RenderGraph([
        shadowPass,
        renderPass,
    ]);
}

export function renderPBRShading() {
    renderGraph.render();
}
