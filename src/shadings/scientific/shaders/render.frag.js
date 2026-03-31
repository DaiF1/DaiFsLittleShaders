export default `#version 300 es
 
precision highp float;

// Attributes

in vec3 v_position;
in vec3 v_viewDirection;
in vec3 v_normal;
in vec2 v_uv;
 
out vec4 outColor;

// Lights
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

// uniforms
uniform sampler2D u_shadow;
uniform sampler2D u_palette;

uniform mat4 u_shadowViewProj;

// Constants
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 0.8, 0.0);

float b = 0.95;
float y = 0.4;
float alpha = 0.4;
float beta = 0.4;

float bias = -0.006;

void main() {
    vec3 diffuse = texture(u_palette, v_uv).rgb;

    vec3 viewDirection = normalize(v_viewDirection);

    float intensity = 0.0;
    for (int i = 0; i < u_dirLightCount; i++)
    {
        DirectionalLight light = u_dirLights[i];
        intensity += dot(normalize(light.direction), v_normal) * light.intensity;
    }

    for (int i = 0; i < u_pointLightCount; i++)
    {
        PointLight light = u_pointLights[i];
        intensity += dot(normalize(light.position - v_position), v_normal) * light.intensity;
    }
    intensity = 1.0 - intensity;

    vec4 shadowClip = u_shadowViewProj * vec4(v_position, 1.0f);
    vec3 shadowNdc = shadowClip.xyz / shadowClip.w;
    vec2 shadowUV = vec2(shadowNdc.xy * 0.5 + 0.5);
    float shadowDepth = texture(u_shadow, shadowUV).r;
    float currentShadow = shadowNdc.z * 0.5 + 0.5;

    float shadow = 1.0;

    if (shadowUV.x >= 0.0 && shadowUV.x <= 1.0 && 
        shadowUV.y >= 0.0 && shadowUV.y <= 1.0) {

        for (float i = -1.0; i <= 1.0; i += 1.0) {
            for (float j = -1.0; j <= 1.0; j += 1.0) {
                vec2 UV_offseted = shadowUV + (vec2(i, j) / vec2(textureSize(u_shadow, 0).xy)); // Offset the UV
                shadow += texture(u_shadow, UV_offseted).r <= currentShadow + bias ? 0.0 : 1.0;  // Accumulate the samples
            }
        }
        shadow /= 9.0; // divide by the number of the samples
    }

    vec3 cool = b * blue + alpha * diffuse;
    vec3 warm = y * yellow + beta * diffuse;

    float k = (1.0 + intensity * shadow) / 2.0;

    vec3 color = k * warm + (1.0 - k) * cool;
    outColor = vec4(color, 1.0);
}
`;
