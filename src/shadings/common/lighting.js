export default `
#define MAX_LIGHT_COUNT 10

struct PointLight
{
  vec3 position;
  vec3 color;
  float intensity;
};
uniform PointLight u_pointLights[MAX_LIGHT_COUNT];
uniform int u_pointLightCount;

struct DirectionalLight
{
  vec3 direction;
  vec3 color;
  float intensity;
};
uniform DirectionalLight u_dirLights[MAX_LIGHT_COUNT];
uniform int u_dirLightCount;

float shadowMapping(sampler2DShadow shadowTex, vec3 position, mat4 shadowProj) {
    vec4 shadowClip = shadowProj * vec4(position, 1.0f);
    vec3 shadowNdc = shadowClip.xyz / shadowClip.w;
    vec2 shadowUV = vec2(shadowNdc.xy * 0.5 + 0.5);
    float currentShadow = shadowNdc.z * 0.5 + 0.5;

    float shadow = 1.0;
    if (shadowUV.x >= 0.0 && shadowUV.x <= 1.0 &&
        shadowUV.y >= 0.0 && shadowUV.y <= 1.0) {

        float smoothRadius = 1.0;
        for (float i = -smoothRadius; i <= smoothRadius; i += 1.0) {
            for (float j = -smoothRadius; j <= smoothRadius; j += 1.0) {
                vec2 UV_offseted = shadowUV + (vec2(i, j) / vec2(textureSize(shadowTex, 0).xy)); // Offset the UV
                shadow += texture(shadowTex, vec3(UV_offseted, currentShadow));  // Accumulate the samples
            }
        }
        shadow /= (2.0 * smoothRadius + 1.0) * (2.0 * smoothRadius + 1.0);
    }

    return shadow;
}

float sqr(float a) {
    return a * a;
}

float attenuation(float dist, float radius) {
    float att = clamp(1.0 - dist*dist/(radius*radius), 0.0, 1.0);
    return att * att;
}
`;
