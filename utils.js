function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width  !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
        return shader;

    var shaderType = "vertex"
    if (type === gl.FRAGMENT_SHADER)
        shaderType = "fragment"
    console.log(source)
    console.log(shaderType, gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success)
        return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

var shaders = {};
var programs = {};

function buildProgramsFromArray(gl, array) {
    Object.keys(array).forEach((name) => {
        if (!shaders[array[name]["vertex"]]) {
            var source = document.querySelector("#" + array[name]["vertex"]).text;
            shaders[array[name]["vertex"]] = createShader(gl, gl.VERTEX_SHADER, source);
        }

        if (!shaders[array[name]["fragment"]]) {
            var source = document.querySelector("#" + array[name]["fragment"]).text;
            shaders[array[name]["fragment"]] = createShader(gl, gl.FRAGMENT_SHADER, source);
        }

        programs[name] = createProgram(gl, shaders[array[name]["vertex"]], shaders[array[name]["fragment"]]);
    })
}

function useProgram(gl, program) {
    gl.useProgram(getProgram(program));
}

function getProgram(program) {
    return programs[program];
}

var attribLocations = {};

function setAttribs(gl, program, attribs) {
    if (!attribLocations[program])
        attribLocations[program] = {};

    Object.keys(attribs).forEach((attr) => {
        if (!attribLocations[program][attr]) {
            attribLocations[program][attr] = gl.getAttribLocation(getProgram(program), attr);
        }
        if (attribLocations[program][attr] !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, attribs[attr]["buffer"]);
            gl.enableVertexAttribArray(attribLocations[program][attr]);
            gl.vertexAttribPointer(
                attribLocations[program][attr],
                attribs[attr]["numComponents"], gl.FLOAT, false, 0, 0
            );
        }
    });
}

var uniformLocations = {};

function setUniforms(gl, program, uniforms) {
    if (!uniformLocations[program]) {
        uniformLocations[program] = {};
    }

    useProgram(gl, program);
    Object.keys(uniforms).forEach((uni) => {
        if (!uniformLocations[program][uni]) {
            uniformLocations[program][uni] = gl.getUniformLocation(getProgram(program), uni);
        }

        switch (uniforms[uni]["type"]) {
            case "int1":
                gl.uniform1i(uniformLocations[program][uni],
                    uniforms[uni].data);
                break;

            case "float1":
                gl.uniform1f(uniformLocations[program][uni],
                    uniforms[uni].data);
                break;

            case "vec3":
                gl.uniform3fv(uniformLocations[program][uni],
                    uniforms[uni].data)
                break;

            case "mat4":
                gl.uniformMatrix4fv(uniformLocations[program][uni],
                    false, uniforms[uni].data)
                break;
        }
    });
}

function guessNumComponentsFromName(name, length) {
    let numComponents;
    if (name.indexOf('coord') >= 0) {
        numComponents = 2;
    } else if (name.indexOf('color') >= 0) {
        numComponents = 4;
    } else {
        numComponents = 3;  // position, normals, indices ...
    }

    if (length % numComponents > 0) {
        throw 'can not guess numComponents. You should specify it.';
    }

    return numComponents;
}

function getNumComponents(array, arrayName) {
    return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
}

function getArray(array) {
    return array.length ? array : array.data;
}

function getNumElements(arrays) {
    let key;
    const positionKeys = ['position', 'positions', 'a_position'];
    for (const k of positionKeys) {
        if (k in arrays) {
            key = k;
            break;
        }
    }
    key = key || Object.keys(arrays)[0];
    const array = arrays[key];
    const length = getArray(array).length;
    const numComponents = getNumComponents(array, key);
    const numElements = length / numComponents;
    if (length % numComponents > 0) {
        throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
    }
    return numElements;
}

function createBufferInfo(gl, data) {
    var bufferInfo = {};
    bufferInfo.numElements = getNumElements(data);
    bufferInfo.attribs = {}

    Object.keys(data).forEach((key) => {
        bufferInfo.attribs["a_" + key] = {};
        bufferInfo.attribs["a_" + key].buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs["a_" + key].buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data[key]), gl.STATIC_DRAW);
        bufferInfo.attribs["a_" + key].numComponents = 3;
    })

    bufferInfo.attribs["a_texcoord"].numComponents = 2;
    return bufferInfo;
}

function setBufferAttribs(gl, program, bufferInfo) {
    setAttribs(gl, program, bufferInfo.attribs);
}

export { resizeCanvasToDisplaySize, buildProgramsFromArray, createBufferInfo, setBufferAttribs, setUniforms };
