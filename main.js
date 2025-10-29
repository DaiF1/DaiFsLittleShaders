import { resizeCanvasToDisplaySize, buildProgramsFromArray, setUniforms, setBufferAttribs, createBufferInfo } from './utils.js'
import { m3, m4 } from './matrices.js'
import { parseOBJ } from './obj_parser.js'

import './style.css'

function createDepthBuffer(gl) {
    // color texture
    const targetTexture = gl.createTexture();
    const depthTextureSize = 512;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        depthTextureSize, depthTextureSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // depth texture
    const depthTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
        depthTextureSize, depthTextureSize, 0, gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // bind textures to framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);


    var result = {
        frameBuffer: fb,
        depth: depthTexture,
    }

    return result;
}

function createFrameBufferInfo(gl, width, height) {
    // color texture

    const targetTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // depth texture
    const depthTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
        width, height, 0, gl.DEPTH_COMPONENT,
        gl.UNSIGNED_INT, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // bind textures to framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);


    var result = {
        frameBuffer: fb,
        texture: targetTexture,
        depth: depthTexture,
        width: width,
        height: height,
    }

    return result;
}

function createTexture(gl, path, activeTex, filter) {
    var texture = gl.createTexture();
    gl.activeTexture(activeTex);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    var image = new Image();
    image.src = path;
    image.addEventListener("load", () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        if ((image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    })
}

async function main() {
    // Debug panel
    var debug_box = document.querySelector("#debug-box");
    var debug_panel = document.querySelector("#debug");
    const lock_display = document.getElementById("lock-status");

    debug_box.addEventListener("click", () => {
        if (debug_box.checked)
            debug_panel.style.visibility = "visible";
        else
            debug_panel.style.visibility = "hidden";
    })

    // Debug sliders
    var sliders = {};

    function setupSlider(id, value) {
        var slider = document.querySelector(id);
        console.log(slider);
        slider.oninput = function() {
            sliders[value] = this.value;
        }
    }

    // WebGL setup
    var canvas = document.querySelector('#c')
    var gl = canvas.getContext("webgl")

    if (!gl) {
        console.log("ERROR: Failed to initialize webgl")
        return;
    }

    const ext = gl.getExtension("WEBGL_depth_texture");
    if (!ext)
        return alert("Unable to load depth texture");

    var programs = {
        default: {vertex: "default-vertex",     fragment: "default-fragment"},
        gooch:   {vertex: "default-vertex",     fragment: "gooch-fragment"},
        comics:  {vertex: "default-vertex",     fragment: "comics-fragment"},
        drawing:  {vertex: "default-vertex",     fragment: "drawing-fragment"},

        postp_default: {vertex: "default-vertex-postp",     fragment: "default-fragment-postp"},
        postp_gooch:   {vertex: "default-vertex-postp",     fragment: "outline-fragment-postp"},
        postp_comics:  {vertex: "default-vertex-postp",     fragment: "outline-fragment-postp"},
        postp_drawing:  {vertex: "default-vertex-postp",     fragment: "outline-fragment-postp"},
    }

    buildProgramsFromArray(gl, programs);

    var currProgram = "default";

    var shaderSelector = document.querySelector("#shader-select");
    shaderSelector.addEventListener("change", () => {
        currProgram = shaderSelector.value;
        refreshAttr(currProgram);
    });

    function refreshAttr(program) {
        setBufferAttribs(gl, program, treeBuffer);
        setUniforms(gl, program, staticUniforms);
    }

    // load obj
    var response = await fetch('resources/tree.obj');
    var text = await response.text();
    var d = parseOBJ(text);

    var treeBuffer = createBufferInfo(gl, d);

    response = await fetch('resources/ground.obj');
    text = await response.text();
    d = parseOBJ(text);

    var groundBuffer = createBufferInfo(gl, d);

    var lightDir = m4.normalize([0.5, 0.7, -1]);

    var staticUniforms = {
        u_reverseLightDir: {data: lightDir,      type: "vec3"},
        u_texture:         {data: 2,             type: "int1"},
        u_shadowTexture:   {data: 0,             type: "int1"},
        u_textureHash:     {data: 4,             type: "int1"},
    }

    var changingUniforms = {
        u_world:           {data: m4.identity(), type: "mat4"},
        u_worldViewMatrix: {data: m4.identity(), type: "mat4"},
        u_cameraView:      {data: m4.identity(), type: "mat4"},
        u_shadowMatrix:    {data: m4.identity(), type: "mat4"},
        u_time:            {data: 0.0,           type: "float1"},
    }

    var postprodUniforms = {
        u_width:         {data: gl.canvas.clientWidth,  type: "float1"},
        u_height:        {data: gl.canvas.clientHeight, type: "float1"},
        u_depthTexture:  {data: 0,                      type: "int1"},
        u_screenTexture: {data: 1,                      type: "int1"},
    }

    setBufferAttribs(gl, currProgram, treeBuffer)
    setUniforms(gl, currProgram, staticUniforms);

    function radToDeg(r) {
        return r * 180 / Math.PI;
    }

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    var objects = [
        {
            bufferInfo: treeBuffer,
            translation: [0, 0, -23],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: treeBuffer,
            translation: [0, 0, 25],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: treeBuffer,
            translation: [10, 0, 20],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: treeBuffer,
            translation: [-11, 0, -22],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: treeBuffer,
            translation: [23, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: treeBuffer,
            translation: [-22, 0, -1],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            bufferInfo: groundBuffer,
            translation: [0, -4, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [3, 1, 3],
        },
    ]

    sliders.cameraX = 0;
    sliders.cameraY = 10;
    sliders.cameraZ = 0;
    var cameraVertRot = 0;
    var cameraHozRot = 0;
    var movDelta = 0.01;
    var ctrl = true;

    setupSlider("#camera-x", "cameraX");
    setupSlider("#camera-y", "cameraY");
    setupSlider("#camera-z", "cameraZ");

    addEventListener("keydown", (event) => {
        if (!event.ctrlKey) return;
        ctrl = !ctrl;
        lock_display.innerText = `(currently ${ctrl ? "unlocked" : "locked"})`;
    });

    addEventListener("mousemove", (event) => {
        if (!ctrl) return;

        cameraHozRot -= event.movementX * movDelta;
        cameraVertRot = Math.max(Math.min(cameraVertRot - event.movementY * movDelta, degToRad(60)), degToRad(-50));
    });

    createTexture(gl, "./resources/palette.png", gl.TEXTURE2, gl.LINEAR);
    createTexture(gl, "./resources/hash.png", gl.TEXTURE4, gl.NEAREST);
    var fbInfo = createFrameBufferInfo(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
    var depthBuffer = createDepthBuffer(gl);

    // draw function written that way to allow redraw on event later
    function drawObjects(projMatrix, cameraMatrix, shadowMatrix) {
        var viewMatrix = m4.inverse(cameraMatrix);
        var viewProjMatrix = m4.multiply(projMatrix, viewMatrix)

        for (let i = 0; i < objects.length; i++) {
            var translation = objects[i].translation;
            var rotation = objects[i].rotation;
            var scale = objects[i].scale;

            var worldMatrix = m4.identity();
            worldMatrix = m4.translate(worldMatrix, translation[0], translation[1], translation[2]);
            worldMatrix = m4.xRotate(worldMatrix, rotation[0]);
            worldMatrix = m4.yRotate(worldMatrix, rotation[1]);
            worldMatrix = m4.zRotate(worldMatrix, rotation[2]);
            worldMatrix = m4.scale(worldMatrix, scale[0], scale[1], scale[2]);

            var worldViewMatrix = m4.multiply(viewProjMatrix, worldMatrix);
            worldMatrix = m4.inverse(worldMatrix);
            worldMatrix = m4.transpose(worldMatrix);

            changingUniforms["u_worldViewMatrix"]["data"] = worldViewMatrix;
            changingUniforms["u_world"]["data"] = worldMatrix;
            changingUniforms["u_cameraView"]["data"] = cameraMatrix;
            changingUniforms["u_shadowMatrix"]["data"] = shadowMatrix;
            changingUniforms["u_time"]["data"] = delta;

            setBufferAttribs(gl, currProgram, objects[i].bufferInfo)
            setUniforms(gl, currProgram, changingUniforms);

            // draw

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.drawArrays(gl.TRIANGLES, 0, objects[i].bufferInfo.numElements);
        }
    }

    var delta = 0.0;

    function drawScene() {
        delta += 0.03;
 
        // Depth texture pass
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, depthBuffer.frameBuffer);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, depthBuffer.depth);
            refreshAttr(currProgram);

            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, 512, 512);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            var shadowWorldMatrix = m4.lookAt(
                [0, 5, 0],
                lightDir,
                [0, 1, 0]
            )
            var shadowProjMatrix = m4.perspective(degToRad(120),
                gl.canvas.clientWidth / gl.canvas.clientHeight,
                0.1, 200);

            drawObjects(shadowProjMatrix, shadowWorldMatrix, m4.identity());

            // Render pass
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbInfo.frameBuffer);
            refreshAttr(currProgram);

            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, fbInfo.width, fbInfo.height);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            var fov = degToRad(60);
            var zNear = 1;
            var zFar = 200;
            const aspect = fbInfo.width / fbInfo.height;
            var cameraMatrix = m4.yRotation(cameraHozRot);
            cameraMatrix = m4.xRotate(cameraMatrix, cameraVertRot);
            cameraMatrix = m4.translate(cameraMatrix, sliders.cameraX, sliders.cameraY, sliders.cameraZ);
            var projMatrix = m4.perspective(fov, aspect, zNear, zFar);

            var shadowMatrix = m4.translation(0.5, 0.5, 0.5);
            shadowMatrix = m4.scale(shadowMatrix, 0.5, 0.5, 0.5);
            shadowMatrix = m4.multiply(shadowMatrix, shadowProjMatrix);
            shadowMatrix = m4.multiply(shadowMatrix,
                m4.inverse(shadowWorldMatrix));

            drawObjects(projMatrix, cameraMatrix, shadowMatrix);
        }

        // Post-processing pass
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, fbInfo.depth);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, fbInfo.texture);

            // Setup canvas
            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            var buffers = {
                position: [-1,-1,0, 1,-1,0, -1,1,0, -1,1,0, 1,-1,0, 1,1,0],
                texcoord: [0,0, 1,0, 0,1, 0,1, 1,0, 1,1],
            }
            var bInfo = createBufferInfo(gl, buffers);

            setUniforms(gl, "postp_" + currProgram, postprodUniforms);
            setBufferAttribs(gl, "postp_" + currProgram, bInfo);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    drawScene()
    setInterval(drawScene, 33);
}

main() 
