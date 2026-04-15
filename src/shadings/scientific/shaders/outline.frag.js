export default `#version 300 es

precision highp float;

in vec2 v_uv;

out vec4 outColor;

uniform sampler2D u_color;
uniform sampler2D u_normal;
uniform sampler2D u_depth;

uniform vec2 u_viewportSize;
uniform float u_near;
uniform float u_far;

vec4 getPixel(sampler2D tex, ivec2 offset) {
    ivec2 uv = ivec2(gl_FragCoord.xy) + offset;
    return texelFetch(tex, uv, 0);
}

float linearize_depth(float d,float zNear,float zFar) {
    float z_n = 2.0 * d - 1.0;
    return 2.0 * zNear * zFar / (zFar + zNear - z_n * (zFar - zNear));
}

float getDepthPixel(int offsetX, int offsetY) {
    return linearize_depth(getPixel(u_depth, ivec2(offsetX, offsetY)).r, u_near, u_far);
}

vec3 getNormalPixel(int offsetX, int offsetY) {
    return getPixel(u_normal, ivec2(offsetX, offsetY)).rgb;
}

void main() {
    float minSeparation = 1.0;
    float maxSeparation = 1.0;
    float minDistance   = 1.5;
    float maxDistance   = 2.0;
    float noiseScale    = 1.0;
    int   size          = 1;
    vec3  colorModifier = vec3(0.522, 0.431, 0.349);

    float depth = getDepthPixel(0, 0);
    float depthDiff = 0.0;
    depthDiff += abs(depth - getDepthPixel(1, 0));
    depthDiff += abs(depth - getDepthPixel(-1, 0));
    depthDiff += abs(depth - getDepthPixel(0, 1));
    depthDiff += abs(depth - getDepthPixel(0, -1));
    depthDiff += abs(depth - getDepthPixel(1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, -1));
    depthDiff /= 8.0;

    vec3 normal = getNormalPixel(0, 0);
    float normalDiff = 0.0;
    normalDiff += distance(normal, getNormalPixel(1, 0));
    normalDiff += distance(normal, getNormalPixel(-1, 0));
    normalDiff += distance(normal, getNormalPixel(0, 1));
    normalDiff += distance(normal, getNormalPixel(0, -1));
    normalDiff += distance(normal, getNormalPixel(1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, -1));
    normalDiff /= 8.0;

    float outline = smoothstep(0.01, 0.2, normalDiff) + smoothstep(0.1, 0.9, depthDiff);
    vec4 color = texture(u_color, v_uv);
    vec4 outlineColor = vec4(62.0 / 255.0, 34.0 / 255.0, 161.0 / 255.0, 1.0);

    outColor = mix(color, outlineColor, outline);
}`;
