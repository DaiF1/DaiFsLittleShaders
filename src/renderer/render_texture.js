import { gl } from "./gl";

export const COLOR_TARGET = "color";
export const DEPTH_TARGET = "depth";

export class RenderTexture
{
    constructor(target, size, uniformName = "") {
        this.uniformName = uniformName;
        this.target = target;

        const targetTextureWidth = size[0];
        const targetTextureHeight = size[1];
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // define size and format of level 0
        const internalFormat = target === DEPTH_TARGET ? gl.DEPTH_COMPONENT32F : gl.RGBA
        const format = target === DEPTH_TARGET ? gl.DEPTH_COMPONENT : gl.RGBA;
        const type = target === DEPTH_TARGET ? gl.FLOAT : gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat,
            targetTextureWidth, targetTextureHeight, 0,
            format, type, null);

        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(program, index) {
        let uniformLocation = gl.getUniformLocation(program, this.uniformName);
        if (uniformLocation == null)
            return;

        gl.uniform1i(uniformLocation, index);

        gl.activeTexture(gl.TEXTURE0 + parseInt(index));
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
};
