export default `#version 300 es
 
in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;
}
`;
