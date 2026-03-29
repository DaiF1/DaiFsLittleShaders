export default `#version 300 es
 
precision highp float;

in vec3 v_normal;
in vec2 v_uv;
 
out vec4 outColor;

uniform sampler2D u_palette;
 
void main() {
    vec4 color = texture(u_palette, v_uv);
    outColor = vec4(color.rgb, 1);
}
`;
