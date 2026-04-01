import { gl } from "./gl";

export const COLOR_TARGET = "color";
export const DEPTH_TARGET = "depth";

export class RenderTexture
{
    constructor(target, size, params) {
        this.target = target;

        const targetTextureWidth = size != null ? size[0] : gl.canvas.width;
        const targetTextureHeight = size != null ? size[1] : gl.canvas.height;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        if (target === COLOR_TARGET) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                targetTextureWidth, targetTextureHeight, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        else {
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F,
                targetTextureWidth, targetTextureHeight);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (params && params.compareMode) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    bind(index) {
        gl.activeTexture(gl.TEXTURE0 + parseInt(index));
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
};
