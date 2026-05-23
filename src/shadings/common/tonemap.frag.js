export default `#version 300 es

precision highp float;

in vec2 v_UV;

out vec4 outColor;

uniform sampler2D u_hdr;
uniform float u_exposure;

vec3 saturate(vec3 x) {
    return min(vec3(1.0), max(vec3(0.0), x));
}

vec3 aces(vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return saturate((x * (a * x + b)) / (x * (c * x + d) + e));
}

void main() {
    ivec2 coord = ivec2(gl_FragCoord.xy);

    vec4 color = texelFetch(u_hdr, coord, 0);
    vec3 hdr = color.rgb * u_exposure;
    vec3 tonemapped = aces(hdr);

    float gamma = 2.2;
    vec3 gammaCorrected = pow(tonemapped, vec3(1.0/gamma));
    outColor = vec4(gammaCorrected, color.a);
}
`;
