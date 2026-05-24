import lighting from "../../common/lighting.js"

export default `#version 300 es
 
precision highp float;
precision highp sampler2DShadow;

// Attributes
in vec3 v_position;
in vec3 v_viewDirection;
in vec3 v_normal;
in vec2 v_uv;
 
layout (location=0) out vec4 outColor;
layout (location=1) out vec4 outNormal;

// Lights
${lighting}

// uniforms
uniform sampler2DShadow u_shadow;
uniform sampler2D u_palette;

uniform mat4 u_shadowViewProj;

// Constants
vec3 blue = vec3(0.14, 0.23, 0.9);
vec3 yellow = vec3(0.7, 0.57, 0.28);

float alpha = 0.1;
float beta = 0.3;

void main() {
    vec3 diffuse = texture(u_palette, v_uv).rgb;

    vec3 viewDirection = normalize(v_viewDirection);

    float intensity = 0.0;
    for (int i = 0; i < u_dirLightCount; i++)
    {
        DirectionalLight light = u_dirLights[i];
        intensity += max(dot(normalize(light.direction), v_normal) * light.intensity, 0.0);
        diffuse += light.color * intensity;
    }

    for (int i = 0; i < u_pointLightCount; i++)
    {
        PointLight light = u_pointLights[i];
        vec3 dir = light.position - v_position;
        float dist = length(dir);
        dir /= dist;

        float att = attenuation(dist, light.intensity * 10.0);
        if (att <= 0.0f)
            continue;

        intensity += max(dot(dir, v_normal) * att, 0.0);
        diffuse += light.color * att;
    }

    float shadow = shadowMapping(u_shadow, v_position, u_shadowViewProj);

    vec3 cool = blue + alpha * diffuse;
    vec3 warm = yellow + beta * diffuse;

    float k = (1.0 + intensity * shadow) / 2.0;

    vec3 color = k * warm + (1.0 - k) * cool;
    outColor = vec4(color, 1.0);
    outNormal = vec4(v_normal * 0.5 + 0.5, 1.0);
}
`;
