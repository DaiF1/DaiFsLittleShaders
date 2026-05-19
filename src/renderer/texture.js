import { parseDDS } from "../utils/loadDDSTexture";
import { gl } from "./gl"

function loadPNG(file) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // TODO: add param for those options
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    let image = new Image();
    image.src = file;
    image.addEventListener('load', () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });

    gl.bindTexture(gl.TEXTURE_2D, null);
    return { texture, isCubemap: false };
}

async function loadDDS(file) {
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('OES_texture_half_float_linear');

    const buffer = await (await fetch(file)).arrayBuffer();
    const { isCubemap, faces, glFormat } = parseDDS(buffer);
    const levelCount = faces[0].length;

    const texture = gl.createTexture();
    const target  = isCubemap ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
    gl.bindTexture(target, texture);

    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, levelCount > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (isCubemap) {
        gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    }
    if (levelCount > 1) {
        gl.texParameteri(target, gl.TEXTURE_BASE_LEVEL, 0);
        gl.texParameteri(target, gl.TEXTURE_MAX_LEVEL, levelCount - 1);
    }

    for (let face = 0; face < faces.length; face++) {
        const faceTarget = isCubemap ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + face : gl.TEXTURE_2D;
        for (let level = 0; level < levelCount; level++) {
            const { data, width, height } = faces[face][level];
            gl.texImage2D(faceTarget, level, glFormat.internalFormat, width, height, 0, glFormat.format, glFormat.type, data);
        }
    }

    gl.bindTexture(target, null);
    return { texture, isCubemap };
}

export class Texture
{
    static cache = {};

    constructor(file) {
        this._loadTexture(file);
    }

    async _loadTexture(file) {
        if (file in Texture.cache) {
            this.texture = Texture.cache[file].texture;
            this.isCubemap = Texture.cache[file].isCubemap;
        }

        const filetype = file.split('.').pop();
        this.file = file;
        switch (filetype) {
            case "png": {
                const { texture, isCubemap } = loadPNG(file)
                this.texture = texture;
                this.isCubemap = isCubemap;
            } break;
            case "dds": {
                const { texture, isCubemap } = await loadDDS(file)
                this.texture = texture;
                this.isCubemap = isCubemap;
            } break;
            default:
                console.error(`Unknown image type: '${filetype}'.`);
                return;
        }

        Texture.cache[file] = { texture: this.texture, isCubemap: this.isCubemap };
    }

    bind(index) {
        if (!this.texture) return;

        gl.activeTexture(gl.TEXTURE0 + parseInt(index));
        if (this.isCubemap)
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        else
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}
