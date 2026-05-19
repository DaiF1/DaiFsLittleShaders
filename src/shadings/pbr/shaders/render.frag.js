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

uniform samplerCube u_diffuse;
uniform samplerCube u_specular;
uniform sampler2D u_brdf;

uniform mat4 u_shadowViewProj;

// Constants
vec3 envmapRot = vec3(-1.0, 1.0, -1.0);

float ACESFilm(float x)
{
  float a = 2.51f;
  float b = 0.03f;
  float c = 2.43f;
  float d = 0.59f;
  float e = 0.14f;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

vec3 ACESFilm(vec3 c)
{
  return vec3(ACESFilm(c.r), ACESFilm(c.g), ACESFilm(c.b));
}

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

vec3 indirectLighting(vec3 n, vec3 w_o, vec3 m_albedo,
                               float m_metallic, float m_roughness)
{
    vec3 kS = fresnel_shlick(m_metallic, n, w_o);
    vec3 kD = (1.0 - kS) * (1.0 - m_metallic);

    vec3 diffuse = kD * m_albedo * texture(u_diffuse, n * envmapRot).rgb;

    vec3 reflected = reflect(w_o, n) * envmapRot * -1.0;

    vec3 spec = textureLod(u_specular, reflected, m_roughness * 6.0).rgb;
    vec2 brdf_uv = vec2(max(dot(n, w_o), 0.0), m_roughness * 6.0);
    vec3 brdf = texture(u_brdf, brdf_uv).rgb;
    vec3 specular = spec * (kS * brdf.r + brdf.g);

    return diffuse + specular;
}

void main() {
    vec3 albedo = texture(u_palette, v_uv).rgb;
    float roughness = texture(u_roughness, v_uv).r;
    float metallic = texture(u_metallic, v_uv).r;

    vec3 viewDirection = normalize(v_viewDirection);

    float shadow = shadowMapping(u_shadow, v_position, u_shadowViewProj);

    vec3 color = indirectLighting(v_normal, viewDirection, albedo, metallic, roughness);
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

    outColor = vec4(ACESFilm(color), 1.0);
}
`;
