import { gl } from "./gl";

export const COLOR_TARGET = "color";
export const DEPTH_TARGET = "depth";

function stringToFilter(str) {
    switch (str) {
        case "linear":
            return gl.LINEAR;
        case "nearest":
            return gl.NEAREST;
    }
}

function stringToWrap(str) {
    switch (str) {
        case "repeat":
            return gl.REPEAT;
        case "clamp":
            return gl.CLAMP_TO_EDGE;
    }
}

export class RenderTexture
{
    constructor(target, params = {}) {
        this.target = target;

        const targetTextureWidth = params.size != null ? params.size[0] : gl.canvas.width;
        const targetTextureHeight = params.size != null ? params.size[1] : gl.canvas.height;
        this.matchCanvasSize = params.size == null;

        this.filter = params.filter ?? 'nearest';
        this.wrap = params.wrap ?? 'repeat';
        this.compareMode = params.compareMode ?? false;
        this.createTexture(targetTextureWidth, targetTextureHeight);
    }

    bind(index) {
        gl.activeTexture(gl.TEXTURE0 + parseInt(index));
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    resize(width, height) {
        gl.deleteTexture(this.texture);
        this.createTexture(width, height);
    }

    createTexture(width, height) {

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        if (this.target === COLOR_TARGET) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                width, height, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        else {
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F,
                width, height);
        }

        const filter = stringToFilter(this.filter);
        const wrap = stringToWrap(this.wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);

        if (this.compareMode) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
};
