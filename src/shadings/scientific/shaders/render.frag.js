import lighting from "../../common/lighting.js"

export default `#version 300 es
 
precision highp float;
precision highp sampler2DShadow;

// Attributes
in vec3 v_position;
in vec3 v_viewDirection;
in vec3 v_normal;
in vec2 v_uv;
 
out vec4 outColor;

// Lights
${lighting}

// uniforms
uniform sampler2DShadow u_shadow;
uniform sampler2D u_palette;

uniform mat4 u_shadowViewProj;

// Constants
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 0.8, 0.0);

float b = 0.95;
float y = 0.4;
float alpha = 0.4;
float beta = 0.4;

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

    float shadow = shadowMapping(u_shadow, v_position, u_shadowViewProj);

    vec3 cool = b * blue + alpha * diffuse;
    vec3 warm = y * yellow + beta * diffuse;

    float k = (1.0 + intensity * shadow) / 2.0;

    vec3 color = k * warm + (1.0 - k) * cool;
    outColor = vec4(color, 1.0);
}
`;
