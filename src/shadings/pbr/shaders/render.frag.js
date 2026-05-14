import lighting from "../../common/lighting.js"

export default `#version 300 es
 
precision highp float;
precision highp sampler2DShadow;

#define PI 3.1415926538

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
uniform sampler2D u_roughness;
uniform sampler2D u_metallic;

uniform mat4 u_shadowViewProj;

// Constants
vec3 blue = vec3(0.14, 0.23, 0.9);
vec3 yellow = vec3(0.7, 0.57, 0.28);

float alpha = 0.1;
float beta = 0.3;

vec3 fresnel_shlick(float f0, vec3 w_i, vec3 w_o)
{
  vec3 h = normalize(w_i + w_o);
  return vec3(f0 + (1.0 - f0) * pow(1.0 - max(dot(w_o, h), 0.0), 5.0));
}

float geom_shlick(vec3 n, vec3 w, float k)
{
  float dot_w = max(dot(n, w), 0.0);
  return dot_w / (dot_w * (1.0 - k) + k);
}

vec3 bdrf_specular(vec3 p, vec3 w_i, vec3 w_o, float roughness)
{
  vec3 n = normalize(v_normal);
  vec3 h = normalize(w_i + w_o);
  float NdH = max(dot(n, h), 0.0);

  // Normal distribution
  float rough = roughness * roughness;
  float d = NdH * NdH * (rough - 1.0) + 1.0;
  float distrib = rough / (d * d * PI);

  // Geometric function
  float r = roughness + 1.0;
  float k = r * r / 8.0;
  float geom = geom_shlick(n, w_i, k) * geom_shlick(n, w_o, k);

  float s_div = 4.0 * dot(w_o, n) * dot(w_i, n);
  return vec3((distrib * geom) / s_div);
}

vec3 directLighting(vec3 albedo, vec3 n, vec3 w_i, vec3 w_o, vec3 l_color,
                             float l_intensity, float metallic, float roughness)
{
    vec3 kS = fresnel_shlick(metallic, w_i, w_o);
    vec3 specular = kS * bdrf_specular(v_position, w_i, w_o, roughness);
    vec3 diffuse = (1.0 - kS) * albedo;
    diffuse *= (1.0 - metallic);
    return (diffuse + specular) * l_color * l_intensity * max(0.0, dot(v_normal, w_i));
}

void main() {
    vec3 albedo = texture(u_palette, v_uv).rgb;
    float roughness = texture(u_roughness, v_uv).r;
    float metallic = texture(u_metallic, v_uv).r;

    vec3 viewDirection = normalize(v_viewDirection);

    float shadow = shadowMapping(u_shadow, v_position, u_shadowViewProj);

    vec3 color = vec3(0.0);
    for (int i = 0; i < u_dirLightCount; i++)
    {
        DirectionalLight light = u_dirLights[i];
        color += directLighting(albedo, v_normal, normalize(light.direction), viewDirection, light.color, light.intensity, metallic, roughness) * shadow;
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

        color += directLighting(albedo, v_normal, normalize(light.position - v_position), viewDirection, light.color, light.intensity, metallic, roughness);
    }

    outColor = vec4(color, 1.0);
}
`;
