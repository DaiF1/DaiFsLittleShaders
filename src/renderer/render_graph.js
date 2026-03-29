import { gl } from "./gl";
import { resizeCanvasToDisplaySize } from "./resize";

export class RenderGraph
{
    constructor(passes) {
        this.passes = passes;
    }

    render() {
        const resized = resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let pass of this.passes) {
            if (pass.out.length === 0) {
                // Create and link Framebuffer
            }
            else {
                // Disable framebuffer just in case
            }

            pass.run(resized);
        }
    }
};
