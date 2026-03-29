export default `#version 300 es
 
in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec3 v_normal;
out vec2 v_uv;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
    v_normal = (u_modelMatrix * vec4(a_normal, 1.0)).xyz;
    v_uv = a_uv;
}
`;
