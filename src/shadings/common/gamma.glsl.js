export default `
vec3 gammaCorrect(vec3 color) {
    float gamma = 2.2;
    return pow(color, vec3(1.0 / gamma));
}

vec4 gammaCorrect(vec4 color) {
    return vec4(gammaCorrect(color.rgb), color.a);
}
`;
