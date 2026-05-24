export default `#version 300 es
 
in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec3 v_modelPosition;
out vec3 v_position;
out vec3 v_normal;
out vec2 v_uv;
out vec3 v_viewDirection;
out vec3 v_fragcoord;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform vec3 u_cameraPosition;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;
    
    v_modelPosition = a_position.xyz;
    v_position = position.xyz;
    v_normal = normalize(mat3(u_modelMatrix) * a_normal);
    v_uv = a_uv;
    v_viewDirection = u_cameraPosition - position.xyz;
    v_fragcoord = gl_Position.xyz / gl_Position.w;
}
`;
