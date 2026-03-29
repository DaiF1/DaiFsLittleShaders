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

// Textures
uniform sampler2D u_palette;

// Constants
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 0.8, 0.0);

float b = 0.95;
float y = 0.7;
float alpha = 0.25;
float beta = 0.2;

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

    vec3 cool = b * blue + alpha * diffuse;
    vec3 warm = y * yellow + beta * diffuse;

    float k = (1.0 + intensity) / 2.0;

    vec3 color = k * cool + (1.0 - k) * warm;
    outColor = vec4(color, 1);
}
`;
