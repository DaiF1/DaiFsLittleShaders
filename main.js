import { resizeCanvasToDisplaySize, buildProgramsFromArray, setUniforms, setBufferAttribs, createBufferInfo } from './utils.js'
import { m4 } from './matrices.js'
import { parseOBJ } from './obj_parser.js'

import './style.css'

function createFrameBufferInfo(gl, activeTex, width, height) {
    // create to render to
    const targetTexture = gl.createTexture();
    gl.activeTexture(activeTex);
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border,
        format, type, data);

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);

    var result = {
        frameBuffer: fb,
        texture: targetTexture,
        width: width,
        height: height,
    }

    return result;
}

function createTexture(gl, path, redraw) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    var image = new Image();
    image.src = path;
    image.addEventListener("load", () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        redraw();
    })
}

async function main() {
    // WebGL setup
    var canvas = document.querySelector('#c')
    var gl = canvas.getContext("webgl")

    if (!gl) {
        console.log("ERROR: Failed to initialize webgl")
    }

    var programs = {
        depth:   {vertex: "vertex-depth", fragment: "fragment-depth"},

        default: {vertex: "default-vertex",     fragment: "default-fragment"},
        gooch:   {vertex: "default-vertex",     fragment: "gooch-fragment"},
        comics:  {vertex: "default-vertex",     fragment: "comics-fragment"},

        postp_default: {vertex: "default-vertex-postp",     fragment: "default-fragment-postp"},
        postp_gooch:   {vertex: "default-vertex-postp",     fragment: "outline-fragment-postp"},
        postp_comics:  {vertex: "default-vertex-postp",     fragment: "outline-fragment-postp"},
    }

    buildProgramsFromArray(gl, programs);

    var currProgram = "default";

    var shaderSelector = document.querySelector("#shader-select");
    shaderSelector.addEventListener("change", () => {
        currProgram = shaderSelector.value;
        refreshAttr(currProgram);
        drawScene();
    });

    function refreshAttr(program) {
        setBufferAttribs(gl, program, bufferInfo);
        setUniforms(gl, program, staticUniforms);
    }

    // load obj
    const response = await fetch('resources/tree.obj');
    var text = await response.text();
    const d = parseOBJ(text);

    var bufferInfo = createBufferInfo(gl, d);

    var staticUniforms = {
        u_reverseLightDir: {data: m4.normalize([0.5, 0.7, -1]), type: "vec3"},
        u_texture:         {data: 0,             type: "int1"},
    }

    var changingUniforms = {
        u_world:           {data: m4.identity(), type: "mat4"},
        u_worldViewMatrix: {data: m4.identity(), type: "mat4"},
    }

    var postprodUniforms = {
        u_width:         {data: gl.canvas.clientWidth,  type: "float1"},
        u_height:        {data: gl.canvas.clientHeight, type: "float1"},
        u_depthTexture:  {data: 1,                      type: "int1"},
        u_screenTexture: {data: 2,                      type: "int1"},
    }

    setBufferAttribs(gl, currProgram, bufferInfo)
    setUniforms(gl, currProgram, staticUniforms);

    function radToDeg(r) {
        return r * 180 / Math.PI;
    }

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    var objects = [
        {
            translation: [0, 0, -23],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            translation: [0, 0, 25],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            translation: [10, 0, 20],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            translation: [-11, 0, -22],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            translation: [23, 0, 0],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
        {
            translation: [-22, 0, -1],
            rotation: [degToRad(0), degToRad(0), degToRad(0)],
            scale: [2, 2, 2],
        },
    ]

    var cameraVertRot = 0;
    var cameraHozRot = 0;
    var delta = 0.01;
    var ctrl = false;

    addEventListener("keydown", (event) => {
        ctrl = event.ctrlKey;
    });

    addEventListener("keyup", (event) => {
        ctrl = event.ctrlKey;
    });

    addEventListener("mousemove", (event) => {
        if (!ctrl) return;

        cameraHozRot += event.movementX * delta;
        cameraVertRot = Math.max(Math.min(cameraVertRot - event.movementY * delta, degToRad(60)), degToRad(-50));

        drawScene();
    });

    createTexture(gl, "./resources/palette.png", drawScene);
    var fbInfo = createFrameBufferInfo(gl, gl.TEXTURE1, gl.canvas.clientWidth, gl.canvas.clientHeight);
    var sbInfo = createFrameBufferInfo(gl, gl.TEXTURE2, gl.canvas.clientWidth, gl.canvas.clientHeight);

    // draw function written that way to allow redraw on event later
    function drawObjects(aspect) {
        var fov = degToRad(60);
        var zNear = 1;
        var zFar = 2000;
        var cameraMatrix = m4.yRotation(cameraHozRot);
        cameraMatrix = m4.xRotate(cameraMatrix, cameraVertRot);
        cameraMatrix = m4.translate(cameraMatrix, 0, 10, 0)

        var viewMatrix = m4.inverse(cameraMatrix);
        var projMatrix = m4.perspective(fov, aspect, zNear, zFar);
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

            changingUniforms["u_worldViewMatrix"]["data"] = worldViewMatrix;
            changingUniforms["u_world"]["data"] = worldMatrix;

            setBufferAttribs(gl, currProgram, bufferInfo)
            setUniforms(gl, currProgram, changingUniforms);

            // draw

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
        }
    }

    function drawScene() {
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbInfo.frameBuffer);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, fbInfo.texture);
            var prog = currProgram;
            currProgram = "depth"
            refreshAttr(currProgram);

            // Setup canvas
            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, fbInfo.width, fbInfo.height);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            const aspect = fbInfo.width / fbInfo.height;
            drawObjects(aspect);

            currProgram = prog;
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, sbInfo.frameBuffer);
            refreshAttr(currProgram);

            // Setup canvas
            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, sbInfo.width, sbInfo.height);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            const aspect = sbInfo.width / sbInfo.height;
            drawObjects(aspect);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, fbInfo.texture);

            // Setup canvas
            resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
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

    drawScene();
}

main() 