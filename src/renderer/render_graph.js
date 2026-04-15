import { gl } from "./gl";
import { DEPTH_TARGET, RenderTexture } from "./render_texture";
import { resizeCanvasToDisplaySize } from "./resize";

export class RenderGraph
{
    constructor(passes) {
        this.passes = passes;
    }

    render() {
        const resized = resizeCanvasToDisplaySize(gl.canvas);

        for (let pass of this.passes) {
            const width = pass.renderWidth ?? gl.canvas.width;
            const height = pass.renderHeight ?? gl.canvas.height;

            if (pass.out != null) {
                // Create and link Framebuffer
                this.currentFB = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.currentFB);

                const colors = pass.out.colors ?? [];
                const attachments = []
                for (let i = 0; i < colors.length; i++) {
                    const tex = colors[i];
                    if (resized)
                        tex.resize(width, height);

                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i,
                        gl.TEXTURE_2D, tex.texture, 0);
                    attachments.push(gl.COLOR_ATTACHMENT0 + i);
                }

                const depth = pass.out.depth ?? new RenderTexture(DEPTH_TARGET, { renderSize: [width, height] }); // TODO: replace with renderbuffer
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                    gl.TEXTURE_2D, depth.texture, 0);

                gl.drawBuffers(attachments);
            }
            else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.drawBuffers([gl.BACK]);
            }

            gl.viewport(0, 0, width, height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            pass.run(resized);
        }
    }
};
