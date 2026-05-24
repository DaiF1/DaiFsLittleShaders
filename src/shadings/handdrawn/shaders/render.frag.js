import lighting from "../../common/lighting.js"

export default `#version 300 es
 
precision highp float;
precision highp sampler2DShadow;

// Attributes
in vec3 v_modelPosition;
in vec3 v_position;
in vec3 v_viewDirection;
in vec3 v_normal;
in vec3 v_fragcoord;
 
layout (location=0) out vec4 outColor;
layout (location=1) out vec4 outNormal;

// Lights
${lighting}

// uniforms
uniform sampler2DShadow u_shadow;
uniform sampler2D u_palette;

uniform mat4 u_shadowViewProj;
uniform mat4 u_viewMatrix;

uniform sampler2D u_crossHatching;
uniform float u_time;

void main() {
    vec3 viewDirection = normalize(v_viewDirection);

    float intensity = 0.0;
    for (int i = 0; i < u_dirLightCount; i++)
    {
        DirectionalLight light = u_dirLights[i];
        intensity += max(dot(normalize(light.direction), v_normal) * light.intensity, 0.0);
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

        intensity += max(dot(dir, v_normal) * att, 0.0) * att;
    }

    float shadow = shadowMapping(u_shadow, v_position, u_shadowViewProj);
    float light = shadow * intensity;

    float time = cos(u_time * 20.0);
    time = (floor(time) + ceil(time)) * 0.25;

    const float scale = 23.0;
    vec2 st = vec2(v_fragcoord.x * scale, v_fragcoord.y * scale * 0.5 + time);
    vec3 crosshatch = texture(u_crossHatching, st).rgb;
    vec3 crosshatchColor = 1.0 - vec3((1.0 - step(0.1, light)) * crosshatch.r /* red */
            + (1.0 - step(0.2, light)) * crosshatch.g /* green */
            + (1.0 - step(0.3, light)) * crosshatch.b); /* blue */;

    float lightMask = step(0.15, light);
    vec3 shadowColor = lightMask + (1.0 - lightMask) * vec3(0.5);

    vec3 color = shadowColor * crosshatchColor;
    outColor = vec4(color, 1.0);
    outNormal = vec4(v_normal * 0.5 + 0.5, 1.0);
}
`;

