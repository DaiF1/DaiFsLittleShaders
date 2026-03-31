import { gl } from "./gl"

export class Texture
{
    constructor(file, uniformName) {
        this.uniformName = uniformName;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // TODO: add param for those options
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        var image = new Image();
        image.src = file;
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

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
}
