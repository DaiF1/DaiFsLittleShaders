import { gl } from "./gl";
import { DEPTH_TARGET, RenderTexture } from "./render_texture";
import { resizeCanvasToDisplaySize } from "./resize";

function framebufferErrorToString(status) {
    switch (status) {
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            return "INCOMPLETE_ATTACHMENT";
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            return "INCOMPLETE_MISSING_ATTACHMENT";
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            return "INCOMPLETE_DIMENSIONS";
        case gl.FRAMEBUFFER_UNSUPPORTED:
            return "UNSUPPORTED";
    }
}

export class RenderGraph
{
    constructor(passes) {
        this.passes = passes;
        this.cache = {};

        this.lastSize = { width: gl.canvas.width, height: gl.canvas.height };
    }

    render(elapsedTime) {
        let resized = resizeCanvasToDisplaySize(gl.canvas);
        if (resized)
            this.lastSize = { width: gl.canvas.width, height: gl.canvas.height };

        for (let pass of this.passes) {
            const width = pass.renderWidth ?? gl.canvas.width;
            const height = pass.renderHeight ?? gl.canvas.height;
            if (width !== this.lastSize.width || height !== this.lastSize.height)
                resized = true;

            if (pass.out != null) {
                if (resized || this.cache[pass.id] == undefined) {
                    if (this.cache[pass.id]) {
                        gl.deleteFramebuffer(this.cache[pass.id].fb);
                        if (this.cache[pass.id].renderbuffer)
                            gl.deleteTexture(this.cache[pass.id].renderbuffer.texture);
                    }

                    const fb = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

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

                    let depth = pass.out.depth;
                    if (depth == null) {
                        depth = new RenderTexture(DEPTH_TARGET, { renderSize: [width, height] }); // TODO: replace with renderbuffer
                    } else if (resized) {
                        depth.resize(width, height);
                    }
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                        gl.TEXTURE_2D, depth.texture, 0);

                    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                    if (status !== gl.FRAMEBUFFER_COMPLETE)
                        console.error(`Invalid Framebuffer (status: ${framebufferErrorToString(status)}).`);
                    this.cache[pass.id] = { fb, attachments, renderbuffer: pass.out.depth == null ? depth : null };
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, this.cache[pass.id].fb);
                gl.drawBuffers(this.cache[pass.id].attachments);
            }
            else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.drawBuffers([gl.BACK]);
            }

            gl.viewport(0, 0, width, height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            pass.run(resized, elapsedTime);
        }
    }
};
