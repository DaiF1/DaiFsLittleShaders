var At=Object.defineProperty;var Mt=(i,e,o)=>e in i?At(i,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[e]=o;var et=(i,e,o)=>(Mt(i,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const ct=new Map;function Lt(i){for(const e of i){let o,r,n=window.devicePixelRatio;e.devicePixelContentBoxSize?(o=e.devicePixelContentBoxSize[0].inlineSize,r=e.devicePixelContentBoxSize[0].blockSize,n=1):e.contentBoxSize?e.contentBoxSize[0]?(o=e.contentBoxSize[0].inlineSize,r=e.contentBoxSize[0].blockSize):(o=e.contentBoxSize.inlineSize,r=e.contentBoxSize.blockSize):(o=e.contentRect.width,r=e.contentRect.height);const a=Math.round(o*n),s=Math.round(r*n);ct.set(e.target,[a,s])}}function gt(i){const[e,o]=ct.get(i),r=i.width!==e||i.height!==o;return r&&(i.width=e,i.height=o,t.viewport(0,0,i.width,i.height)),r}function Dt(i){ct.set(i,[i.width,i.height]),new ResizeObserver(Lt).observe(i,{box:"content-box"}),gt(i)}let t=null;function Pt(){let i=document.getElementById("c");if(i.width=window.innerWidth,i.height=window.innerHeight,t=i.getContext("webgl2"),t.viewport(0,0,i.width,i.height),!t){console.error("Does not support webgl2");return}Dt(i)}function yt(i){const e=[[0,0,0]],o=[[0,0]],r=[[0,0,0]],n=[e,o,r];let a=[[],[],[]];function s(c){c.split("/").forEach((m,v)=>{if(!m)return;const g=parseInt(m),p=g+(g>=0?0:n[v].length);a[v].push(...n[v][p])})}const l={v(c){e.push(c.map(parseFloat))},vn(c){r.push(c.map(parseFloat))},vt(c){o.push(c.map(parseFloat))},f(c){const h=c.length-2;for(let m=0;m<h;++m)s(c[0]),s(c[m+1]),s(c[m+2])}},f=/(\w*)(?: )*(.*)/,u=i.split(`
`);for(let c=0;c<u.length;++c){const h=u[c].trim();if(h===""||h.startsWith("#"))continue;const m=f.exec(h);if(!m)continue;const[,v,g]=m,p=h.split(/\s+/).slice(1),_=l[v];if(!_){console.warn("unhandled keyword:",v);continue}_(p,g)}return{position:a[0],texcoord:a[1],normal:a[2]}}class j{constructor(e,o,r){this.vertices=e??[],this.normals=o??[],this.uvs=r??[],this.programCache={}}createVAO(e){let o=t.createVertexArray();t.bindVertexArray(o);let r=t.getAttribLocation(e,"a_position");if(r>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.vertices),t.STATIC_DRAW),t.enableVertexAttribArray(r),t.vertexAttribPointer(r,3,t.FLOAT,!1,0,0)}let n=t.getAttribLocation(e,"a_normal");if(n>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.normals),t.STATIC_DRAW),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,3,t.FLOAT,!1,0,0)}let a=t.getAttribLocation(e,"a_uv");if(a>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.uvs),t.STATIC_DRAW),t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0)}return t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null),o}draw(e){let o=this.programCache[e.id];o==null&&(o=this.createVAO(e.program),this.programCache[e.id]=o),t.bindVertexArray(o),t.drawArrays(t.TRIANGLES,0,this.vertices.length/3)}static async fromOBJ(e){const o=await(await fetch(e)).text(),r=yt(o);return new j(r.position,r.normal,r.texcoord)}}function N(i){return i*Math.PI/180}function ot(i,e,o){return i*(1-o)+e*o}function mt(i,e,o){return[ot(i[0],e[0],o),ot(i[1],e[1],o),ot(i[2],e[2],o)]}function Ct(i){return Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2])}function Et(i){const e=Ct(i);return[i[0]/e,i[1]/e,i[2]/e]}const d={perspective:function(i,e,o,r){var n=Math.tan(Math.PI*.5-.5*i),a=1/(o-r);return[n/e,0,0,0,0,n,0,0,0,0,(o+r)*a,-1,0,0,o*r*a*2,0]},orthographic:function(i,e,o,r,n,a){return[2/(e-i),0,0,0,0,2/(r-o),0,0,0,0,2/(n-a),0,(i+e)/(i-e),(o+r)/(o-r),(n+a)/(n-a),1]},multiply:function(i,e){var o=i[0],r=i[0*4+1],n=i[0*4+2],a=i[0*4+3],s=i[1*4+0],l=i[1*4+1],f=i[1*4+2],u=i[1*4+3],c=i[2*4+0],h=i[2*4+1],m=i[2*4+2],v=i[2*4+3],g=i[3*4+0],p=i[3*4+1],_=i[3*4+2],E=i[3*4+3],T=e[0*4+0],w=e[0*4+1],R=e[0*4+2],b=e[0*4+3],A=e[1*4+0],M=e[1*4+1],L=e[1*4+2],D=e[1*4+3],P=e[2*4+0],y=e[2*4+1],C=e[2*4+2],S=e[2*4+3],U=e[3*4+0],F=e[3*4+1],z=e[3*4+2],I=e[3*4+3];return[T*o+w*s+R*c+b*g,T*r+w*l+R*h+b*p,T*n+w*f+R*m+b*_,T*a+w*u+R*v+b*E,A*o+M*s+L*c+D*g,A*r+M*l+L*h+D*p,A*n+M*f+L*m+D*_,A*a+M*u+L*v+D*E,P*o+y*s+C*c+S*g,P*r+y*l+C*h+S*p,P*n+y*f+C*m+S*_,P*a+y*u+C*v+S*E,U*o+F*s+z*c+I*g,U*r+F*l+z*h+I*p,U*n+F*f+z*m+I*_,U*a+F*u+z*v+I*E]},translation:function(i,e,o){return[1,0,0,0,0,1,0,0,0,0,1,0,i,e,o,1]},xRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[1,0,0,0,0,e,o,0,0,-o,e,0,0,0,0,1]},yRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[e,0,-o,0,0,1,0,0,o,0,e,0,0,0,0,1]},zRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[e,o,0,0,-o,e,0,0,0,0,1,0,0,0,0,1]},scaling:function(i,e,o){return[i,0,0,0,0,e,0,0,0,0,o,0,0,0,0,1]},translate:function(i,e,o,r){return d.multiply(i,d.translation(e,o,r))},xRotate:function(i,e){return d.multiply(i,d.xRotation(e))},yRotate:function(i,e){return d.multiply(i,d.yRotation(e))},zRotate:function(i,e){return d.multiply(i,d.zRotation(e))},scale:function(i,e,o,r){return d.multiply(i,d.scaling(e,o,r))},inverse:function(i){var e=i[0],o=i[0*4+1],r=i[0*4+2],n=i[0*4+3],a=i[1*4+0],s=i[1*4+1],l=i[1*4+2],f=i[1*4+3],u=i[2*4+0],c=i[2*4+1],h=i[2*4+2],m=i[2*4+3],v=i[3*4+0],g=i[3*4+1],p=i[3*4+2],_=i[3*4+3],E=h*_,T=p*m,w=l*_,R=p*f,b=l*m,A=h*f,M=r*_,L=p*n,D=r*m,P=h*n,y=r*f,C=l*n,S=u*g,U=v*c,F=a*g,z=v*s,I=a*c,V=u*s,H=e*g,W=v*o,$=e*c,Y=u*o,q=e*s,K=a*o,ut=E*s+R*c+b*g-(T*s+w*c+A*g),ht=T*o+M*c+P*g-(E*o+L*c+D*g),ft=w*o+L*s+y*g-(R*o+M*s+C*g),dt=A*o+D*s+C*c-(b*o+P*s+y*c),x=1/(e*ut+a*ht+u*ft+v*dt);return[x*ut,x*ht,x*ft,x*dt,x*(T*a+w*u+A*v-(E*a+R*u+b*v)),x*(E*e+L*u+D*v-(T*e+M*u+P*v)),x*(R*e+M*a+C*v-(w*e+L*a+y*v)),x*(b*e+P*a+y*u-(A*e+D*a+C*u)),x*(S*f+z*m+I*_-(U*f+F*m+V*_)),x*(U*n+H*m+Y*_-(S*n+W*m+$*_)),x*(F*n+W*f+q*_-(z*n+H*f+K*_)),x*(V*n+$*f+K*m-(I*n+Y*f+q*m)),x*(F*h+V*p+U*l-(I*p+S*l+z*h)),x*($*p+S*r+W*h-(H*h+Y*p+U*r)),x*(H*l+K*p+z*r-(q*p+F*r+W*l)),x*(q*h+I*r+Y*l-($*l+K*h+V*r))]},cross:function(i,e){return[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]]},subtractVectors:function(i,e){return[i[0]-e[0],i[1]-e[1],i[2]-e[2]]},normalize:function(i){var e=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);return e>1e-5?[i[0]/e,i[1]/e,i[2]/e]:[0,0,0]},lookAt:function(i,e,o){var r=d.normalize(d.subtractVectors(i,e)),n=d.normalize(d.cross(o,r)),a=d.normalize(d.cross(r,n));return[n[0],n[1],n[2],0,a[0],a[1],a[2],0,r[0],r[1],r[2],0,i[0],i[1],i[2],1]},transformVector:function(i,e){for(var o=[],r=0;r<4;++r){o[r]=0;for(var n=0;n<4;++n)o[r]+=e[n]*i[n*4+r]}return o}},it="perspective",Z="orthographic";class lt{constructor(e,o={}){if(this.type=e,e===it){this.fov=o.fov?N(o.fov):N(30),this.near=o.near??1,this.far=o.far??2e3;const r=t.canvas.clientWidth/t.canvas.clientHeight;this.projMatrix=d.perspective(this.fov,r,this.near,this.far)}else e===Z&&(this.left=o.left??-100,this.right=o.right??100,this.bottom=o.left??100,this.top=o.right??-100,this.far=o.far??-400,this.near=o.near??400,this.projMatrix=d.orthographic(this.left,this.right,this.bottom,this.top,this.near,this.far));this.position=o.position??[10,0,0],this.target=o.target??[0,0,0],this.up=o.up??[0,1,0],this.cameraMatrix=d.lookAt(this.position,this.target,this.up),this.viewMatrix=d.inverse(this.cameraMatrix),this.needsUpdate=!1}bindUniforms(e){let o=t.getUniformLocation(e,"u_viewMatrix");o!=null&&t.uniformMatrix4fv(o,!1,this.viewMatrix);let r=t.getUniformLocation(e,"u_projectionMatrix");r!=null&&t.uniformMatrix4fv(r,!1,this.projMatrix);let n=t.getUniformLocation(e,"u_cameraPosition");n!=null&&t.uniform3fv(n,this.position);let a=t.getUniformLocation(e,"u_near");a!=null&&t.uniform1f(a,this.near);let s=t.getUniformLocation(e,"u_far");s!=null&&t.uniform1f(s,this.far);let l=t.getUniformLocation(e,"u_viewportSize");l!=null&&t.uniform2fv(l,[t.canvas.width,t.canvas.height])}moveCamera(e,o){this.startPosition=this.position,this.targetPosition=e,this.startTarget=this.target,this.targetTarget=o,this.needsUpdate=!0,this.timeElapsed=0}update(e){this.needsUpdate&&(this.timeElapsed+=e,this.timeElapsed>=1&&(this.timeElapsed=1),this.position=mt(this.startPosition,this.targetPosition,this.timeElapsed),this.target=mt(this.startTarget,this.targetTarget,this.timeElapsed),this.cameraMatrix=d.lookAt(this.position,this.target,this.up),this.viewMatrix=d.inverse(this.cameraMatrix),this.timeElapsed>=1&&(this.needsUpdate=!1))}recalculateMatrix(){if(this.type===it){const e=t.canvas.clientWidth/t.canvas.clientHeight;this.projMatrix=d.perspective(this.fov,e,this.near,this.far)}else this.type}get viewProjMatrix(){return d.multiply(this.projMatrix,this.viewMatrix)}}class rt{constructor(e,o=[0,0,0],r=[0,0,0],n=[1,1,1]){this.mesh=e,this.position=o,this.rotation=r,this.scale=n,this.positionMat=d.translation(o[0],o[1],o[2]),this.rotationMat=d.xRotation(r[0]),this.rotationMat=d.yRotate(this.rotationMat,r[1]),this.rotationMat=d.zRotate(this.rotationMat,r[2]),this.scaleMat=d.scaling(n[0],n[1],n[2]),this.computeMatrix()}computeMatrix(){this.matrix=d.multiply(this.positionMat,d.multiply(this.scaleMat,this.rotationMat))}draw(e){let o=t.getUniformLocation(e.program,"u_modelMatrix");o!=null&&t.uniformMatrix4fv(o,!1,this.matrix),this.mesh.draw(e)}rotateX(e){this.rotationMat=d.xRotate(this.rotationMat,N(e)),this.computeMatrix()}setRotationX(e){this.rotation[0]=N(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}rotateY(e){this.rotationMat=d.yRotate(this.rotationMat,N(e)),this.computeMatrix()}setRotationY(e){this.rotation[1]=N(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}rotateZ(e){this.rotationMat=d.zRotate(this.rotationMat,N(e)),this.computeMatrix()}setRotationZ(e){this.rotation[2]=N(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}}const vt=10;class tt{constructor(e,o={}){this.objects=e??[],this.directionalLights=o.directional??[],this.pointLights=o.point??[]}render(e){const o=e.program,r=Math.min(vt,this.directionalLights.length),n=t.getUniformLocation(o,"u_dirLightCount");n!=null&&t.uniform1i(n,r);for(let l=0;l<r;l++){const f=t.getUniformLocation(o,`u_dirLights[${l}].direction`),u=t.getUniformLocation(o,`u_dirLights[${l}].color`),c=t.getUniformLocation(o,`u_dirLights[${l}].intensity`),h=this.directionalLights[l];t.uniform3fv(f,h.direction),t.uniform3fv(u,h.color),t.uniform1f(c,h.intensity)}const a=Math.min(vt,this.pointLights.length),s=t.getUniformLocation(o,"u_pointLightCount");s!=null&&t.uniform1i(s,a);for(let l=0;l<a;l++){const f=t.getUniformLocation(o,`u_pointLights[${l}].position`),u=t.getUniformLocation(o,`u_pointLights[${l}].color`),c=t.getUniformLocation(o,`u_pointLights[${l}].intensity`),h=this.pointLights[l];t.uniform3fv(f,h.position),t.uniform3fv(u,h.color),t.uniform1f(c,h.intensity)}for(let l of this.objects)l.draw(e)}static getPostProcessPlane(){const e=new j([-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0],[],[0,0,1,0,0,1,0,1,1,0,1,1]);return new tt([new rt(e)])}}function St(i){document.getElementById("camera-button").addEventListener("click",i)}function Ut(i){document.querySelectorAll(".custom-select").forEach(o=>{const r=o.querySelector(".select-button"),n=o.querySelector(".select-dropdown"),a=n.querySelectorAll("li"),s=r.querySelector(".selected-value"),l=(u=null)=>{const c=u!==null?u:n.classList.contains("hidden");n.classList.toggle("hidden",!c),r.setAttribute("aria-expanded",c)},f=u=>{a.forEach(c=>c.classList.remove("selected")),u.classList.add("selected"),s.textContent=u.textContent.trim(),i(u.dataset.value)};a.forEach(u=>{u.addEventListener("click",()=>{f(u),l(!1)}),u.addEventListener("keydown",c=>{(c.key==="Enter"||c.keyCode===13)&&(f(u),l(!1))})}),r.addEventListener("click",()=>{l()}),document.addEventListener("click",u=>{!o.contains(u.target)&&l(!1)})})}function Ft(i){St(i.cameraCallback),Ut(i.shadingCallback)}const zt=`#version 300 es
 
in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_uv;
out vec3 v_viewDirection;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform vec3 u_cameraPosition;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;

    v_position = position.xyz;
    v_normal = normalize(mat3(u_modelMatrix) * a_normal);
    v_uv = a_uv;
    v_viewDirection = u_cameraPosition - position.xyz;
}
`,xt=`
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

float shadowMapping(sampler2DShadow shadowTex, vec3 position, mat4 shadowProj) {
    vec4 shadowClip = shadowProj * vec4(position, 1.0f);
    vec3 shadowNdc = shadowClip.xyz / shadowClip.w;
    vec2 shadowUV = vec2(shadowNdc.xy * 0.5 + 0.5);
    float currentShadow = shadowNdc.z * 0.5 + 0.5;

    float shadow = 1.0;
    if (shadowUV.x >= 0.0 && shadowUV.x <= 1.0 &&
        shadowUV.y >= 0.0 && shadowUV.y <= 1.0) {

        float smoothRadius = 1.0;
        for (float i = -smoothRadius; i <= smoothRadius; i += 1.0) {
            for (float j = -smoothRadius; j <= smoothRadius; j += 1.0) {
                vec2 UV_offseted = shadowUV + (vec2(i, j) / vec2(textureSize(shadowTex, 0).xy)); // Offset the UV
                shadow += texture(shadowTex, vec3(UV_offseted, currentShadow));  // Accumulate the samples
            }
        }
        shadow /= (2.0 * smoothRadius + 1.0) * (2.0 * smoothRadius + 1.0);
    }

    return shadow;
}

float sqr(float a) {
    return a * a;
}

float attenuation(float dist, float radius) {
    float att = clamp(1.0 - dist*dist/(radius*radius), 0.0, 1.0);
    return att * att;
}
`,It=`
// Missing Deadlines (Benjamin Wrensch): https://iolite-engine.com/blog_posts/minimal_agx_implementation
// Filament: https://github.com/google/filament/blob/main/filament/src/ToneMapper.cpp#L263
// https://github.com/EaryChow/AgX_LUT_Gen/blob/main/AgXBaseRec2020.py

// Three.js: https://github.com/mrdoob/three.js/blob/4993e3af579a27cec950401b523b6e796eab93ec/src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl.js#L79-L89
// Matrices for rec 2020 <> rec 709 color space conversion
// matrix provided in row-major order so it has been transposed
// https://www.itu.int/pub/R-REP-BT.2407-2017
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
  1.6605, -0.1246, -0.0182,
  -0.5876, 1.1329, -0.1006,
  -0.0728, -0.0083, 1.1187
);

const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
  0.6274, 0.0691, 0.0164,
  0.3293, 0.9195, 0.0880,
  0.0433, 0.0113, 0.8956
);

// Converted to column major from blender: https://github.com/blender/blender/blob/fc08f7491e7eba994d86b610e5ec757f9c62ac81/release/datafiles/colormanagement/config.ocio#L358
const mat3 AgXInsetMatrix = mat3(
  0.856627153315983, 0.137318972929847, 0.11189821299995,
  0.0951212405381588, 0.761241990602591, 0.0767994186031903,
  0.0482516061458583, 0.101439036467562, 0.811302368396859
);

// Converted to column major and inverted from https://github.com/EaryChow/AgX_LUT_Gen/blob/ab7415eca3cbeb14fd55deb1de6d7b2d699a1bb9/AgXBaseRec2020.py#L25
// https://github.com/google/filament/blob/bac8e58ee7009db4d348875d274daf4dd78a3bd1/filament/src/ToneMapper.cpp#L273-L278
const mat3 AgXOutsetMatrix = mat3(
  1.1271005818144368, -0.1413297634984383, -0.14132976349843826,
  -0.11060664309660323, 1.157823702216272, -0.11060664309660294,
  -0.016493938717834573, -0.016493938717834257, 1.2519364065950405
);

const float AgxMinEv = -12.47393;
const float AgxMaxEv = 4.026069;

// Sample usage
vec3 agxCdl(vec3 color, vec3 slope, vec3 offset, vec3 power, float saturation) {
  color = LINEAR_SRGB_TO_LINEAR_REC2020 * color; // From three.js

  // 1. agx()
  // Input transform (inset)
  color = AgXInsetMatrix * color;

  color = max(color, 1e-10); // From Filament: avoid 0 or negative numbers for log2

  // Log2 space encoding
  color = clamp(log2(color), AgxMinEv, AgxMaxEv);
  color = (color - AgxMinEv) / (AgxMaxEv - AgxMinEv);

  color = clamp(color, 0.0, 1.0); // From Filament

  // Apply sigmoid function approximation
  // Mean error^2: 3.6705141e-06
  vec3 x2 = color * color;
  vec3 x4 = x2 * x2;
  color = + 15.5     * x4 * x2
          - 40.14    * x4 * color
          + 31.96    * x4
          - 6.868    * x2 * color
          + 0.4298   * x2
          + 0.1191   * color
          - 0.00232;

  // 2. agxLook()
  color = pow(color * slope + offset, power);
  const vec3 lw = vec3(0.2126, 0.7152, 0.0722);
  float luma = dot(color, lw);
  color = luma + saturation * (color - luma);

  // 3. agxEotf()
  // Inverse input transform (outset)
  color = AgXOutsetMatrix * color;

  // sRGB IEC 61966-2-1 2.2 Exponent Reference EOTF Display
  // NOTE: We're linearizing the output here. Comment/adjust when
  // *not* using a sRGB render target
  color = pow(max(vec3(0.0), color), vec3(2.2)); // From filament: max()

  color = LINEAR_REC2020_TO_LINEAR_SRGB * color; // From three.js
  // Gamut mapping. Simple clamp for now.
	color = clamp(color, 0.0, 1.0);

  return color;
}

vec3 agx(vec3 color) {
  return agxCdl(color, vec3(1.0), vec3(0.0), vec3(1.0), 1.0);
}

vec3 agxGolden(vec3 color) {
  return agxCdl(color, vec3(1.0, 0.9, 0.5), vec3(0.0), vec3(0.8), 1.3);
}

vec3 agxPunchy(vec3 color) {
  return agxCdl(color, vec3(1.0), vec3(0.0), vec3(1.35), 1.4);
}
`,Tt=`
vec3 gammaCorrect(vec3 color) {
    float gamma = 2.2;
    return pow(color, vec3(1.0 / gamma));
}

vec4 gammaCorrect(vec4 color) {
    return vec4(gammaCorrect(color.rgb), color.a);
}
`,Nt=`#version 300 es
 
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
${xt}

// Tonemapping
${It}

${Tt}

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

        color += directLighting(albedo, v_normal, normalize(light.position - v_position), viewDirection, light.color, light.intensity, metallic, roughness) * att;
    }

    outColor = vec4(gammaCorrect(agxPunchy(color)), 1.0);
}
`,wt=`#version 300 es
 
in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;
}
`,Rt=`#version 300 es

precision mediump float;
 
out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`,nt="color",J="depth";function Bt(i){switch(i){case"linear":return t.LINEAR;case"nearest":return t.NEAREST}}function Ot(i){switch(i){case"repeat":return t.REPEAT;case"clamp":return t.CLAMP_TO_EDGE}}class k{constructor(e,o={}){this.target=e;const r=o.size!=null?o.size[0]:t.canvas.width,n=o.size!=null?o.size[1]:t.canvas.height;this.matchCanvasSize=o.size==null,this.filter=o.filter??"nearest",this.wrap=o.wrap??"repeat",this.compareMode=o.compareMode??!1,this.createTexture(r,n)}bind(e){t.activeTexture(t.TEXTURE0+parseInt(e)),t.bindTexture(t.TEXTURE_2D,this.texture)}resize(e,o){t.deleteTexture(this.texture),this.createTexture(e,o)}createTexture(e,o){this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),this.target===nt?t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,o,0,t.RGBA,t.UNSIGNED_BYTE,null):t.texStorage2D(t.TEXTURE_2D,1,t.DEPTH_COMPONENT32F,e,o);const r=Bt(this.filter),n=Ot(this.wrap);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,n),this.compareMode&&(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL)),t.bindTexture(t.TEXTURE_2D,null)}}function Xt(i){switch(i){case t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"INCOMPLETE_ATTACHMENT";case t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"INCOMPLETE_MISSING_ATTACHMENT";case t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"INCOMPLETE_DIMENSIONS";case t.FRAMEBUFFER_UNSUPPORTED:return"UNSUPPORTED"}}class bt{constructor(e){this.passes=e,this.cache={},this.lastSize={width:t.canvas.width,height:t.canvas.height}}render(){let e=gt(t.canvas);e&&(this.lastSize={width:t.canvas.width,height:t.canvas.height});for(let o of this.passes){const r=o.renderWidth??t.canvas.width,n=o.renderHeight??t.canvas.height;if((r!==this.lastSize.width||n!==this.lastSize.height)&&(e=!0),o.out!=null){if(e||this.cache[o.id]==null){this.cache[o.id]&&(t.deleteFramebuffer(this.cache[o.id].fb),this.cache[o.id].renderbuffer&&t.deleteTexture(this.cache[o.id].renderbuffer.texture));const a=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,a);const s=o.out.colors??[],l=[];for(let c=0;c<s.length;c++){const h=s[c];e&&h.resize(r,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+c,t.TEXTURE_2D,h.texture,0),l.push(t.COLOR_ATTACHMENT0+c)}let f=o.out.depth;f==null?f=new k(J,{renderSize:[r,n]}):e&&f.resize(r,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,f.texture,0);const u=t.checkFramebufferStatus(t.FRAMEBUFFER);u!==t.FRAMEBUFFER_COMPLETE&&console.error(`Invalid Framebuffer (status: ${Xt(u)}).`),this.cache[o.id]={fb:a,attachments:l,renderbuffer:o.out.depth==null?f:null}}t.bindFramebuffer(t.FRAMEBUFFER,this.cache[o.id].fb),t.drawBuffers(this.cache[o.id].attachments)}else t.bindFramebuffer(t.FRAMEBUFFER,null),t.drawBuffers([t.BACK]);t.viewport(0,0,r,n),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.run(e)}}}function kt(i,e,o){switch(e){case"m4":t.uniformMatrix4fv(i,!1,o);break;case"t":t.uniform1i(i,o);break;case"f":t.uniform1f(i,o);break;default:console.error(`Type not supported: ${e}`)}}function Gt(i){switch(i){case"front":return t.FRONT;case"back":return t.BACK;case"double":return t.FRONT_AND_BACK}}const Q=class Q{constructor(e,o,r){this.id=Q.lastId++,this.scene=e,this.camera=r.camera??null,this.shader=o,this.out=r.out,this.camera=r.camera??null,this.renderWidth=r.renderSize?r.renderSize[0]:null,this.renderHeight=r.renderSize?r.renderSize[1]:null,this.uniforms=r.uniforms??[],this.cullface=r.cullface??"back"}run(e){this.cullface!=="none"?(t.enable(t.CULL_FACE),t.cullFace(Gt(this.cullface))):t.disable(t.CULL_FACE),t.enable(t.DEPTH_TEST),t.useProgram(this.shader.program),this.camera!=null&&(e&&this.camera.recalculateMatrix(),this.camera.bindUniforms(this.shader.program));let o=0;for(let r of this.uniforms){let n=r.value;if(r.type==="t"){const s=o++;r.value.bind(s),n=s}const a=t.getUniformLocation(this.shader.program,r.name);kt(a,r.type,n)}this.scene.render(this.shader)}};et(Q,"lastId",0);let X=Q;const pt={R32G32B32A32_FLOAT:2,R16G16_FLOAT:34},jt=542327876,Vt=808540228,Ht=124,Wt=20,$t=4+Ht+Wt,Yt=4;function qt(i){const e={[pt.R32G32B32A32_FLOAT]:{internalFormat:t.RGBA32F,format:t.RGBA,type:t.FLOAT,dataType:Float32Array,bytesPerPixel:16},[pt.R16G16_FLOAT]:{internalFormat:t.RG16F,format:t.RG,type:t.HALF_FLOAT,dataType:Uint16Array,bytesPerPixel:4}},o=new DataView(i),r=p=>o.getUint32(p,!0);if(r(0)!==jt)throw new Error("Error: not a DDS file");const n=r(84);if(n!==Vt)throw new Error(`Error: not a DX10 DDS file (${n.toString(16)})`);const a=r(128),s=e[a];if(!s)throw new Error(`Error: format not in list (${a})`);const l=r(136)===Yt,f=l?6:1,u=r(28)||1,c=r(16),h=r(12),m=(p,_)=>p*_*s.bytesPerPixel,v=Array.from({length:f},()=>[]);let g=$t;for(let p=0;p<f;p++){let _=c,E=h;for(let T=0;T<u;T++){const w=m(_,E);v[p].push({data:new s.dataType(i,g,w/s.dataType.BYTES_PER_ELEMENT),width:_,height:E}),g+=w,_=Math.max(1,_>>1),E=Math.max(1,E>>1)}}return{isCubemap:l,faces:v,glFormat:s}}function Kt(i){const e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let o=new Image;return o.src=i,o.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,o),t.generateMipmap(t.TEXTURE_2D)}),t.bindTexture(t.TEXTURE_2D,null),{texture:e,isCubemap:!1}}async function Zt(i){t.getExtension("OES_texture_float_linear"),t.getExtension("OES_texture_half_float_linear");const e=await(await fetch(i)).arrayBuffer(),{isCubemap:o,faces:r,glFormat:n}=qt(e),a=r[0].length,s=t.createTexture(),l=o?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D;t.bindTexture(l,s),t.texParameteri(l,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(l,t.TEXTURE_MIN_FILTER,a>1?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(l,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(l,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),o&&t.texParameteri(l,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),a>1&&(t.texParameteri(l,t.TEXTURE_BASE_LEVEL,0),t.texParameteri(l,t.TEXTURE_MAX_LEVEL,a-1));for(let f=0;f<r.length;f++){const u=o?t.TEXTURE_CUBE_MAP_POSITIVE_X+f:t.TEXTURE_2D;for(let c=0;c<a;c++){const{data:h,width:m,height:v}=r[f][c];t.texImage2D(u,c,n.internalFormat,m,v,0,n.format,n.type,h)}}return t.bindTexture(l,null),{texture:s,isCubemap:o}}const O=class O{constructor(e){this._loadTexture(e)}async _loadTexture(e){if(e in O.cache){this.texture=O.cache[e].texture,this.isCubemap=O.cache[e].isCubemap;return}const o=e.split(".").pop();switch(this.file=e,o){case"png":{const{texture:r,isCubemap:n}=Kt(e);this.texture=r,this.isCubemap=n}break;case"dds":{const{texture:r,isCubemap:n}=await Zt(e);this.texture=r,this.isCubemap=n}break;default:console.error(`Unknown image type: '${o}'.`);return}O.cache[e]={texture:this.texture,isCubemap:this.isCubemap}}bind(e){this.texture&&(t.activeTexture(t.TEXTURE0+parseInt(e)),this.isCubemap?t.bindTexture(t.TEXTURE_CUBE_MAP,this.texture):t.bindTexture(t.TEXTURE_2D,this.texture))}};et(O,"cache",{});let B=O,Jt=0;function _t(i,e){let o=t.createShader(i);if(t.shaderSource(o,e),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS))return o;console.warn(t.getShaderInfoLog(o)),t.deleteShader(o)}function Qt(i,e){let o=t.createProgram();if(t.attachShader(o,i),t.attachShader(o,e),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS))return t.detachShader(o,i),t.detachShader(o,e),t.deleteShader(i),t.deleteShader(e),o;console.log(t.getProgramInfoLog(o)),t.deleteProgram(o)}class G{constructor(e,o){this.id=Jt++,this.program=this.compileShader(e,o)}compileShader(e,o){let r=_t(t.VERTEX_SHADER,e),n=_t(t.FRAGMENT_SHADER,o);return Qt(r,n)}}let at=null;function te(i,e,o){if(at!=null)return;const r=2048,n=new k(J,{size:[r,r],compareMode:!0,filter:"linear"}),a=Et(o),s=40,l=[a[0]*s,a[1]*s,a[2]*s],f=Math.abs(a.y)>.99?[1,0,0]:[0,1,0],u=s*1.2;let c=new lt(Z,{position:l,target:[0,0,0],up:f,near:.1,far:s*4,left:-u,right:u,top:-u,bottom:u}),h=new X(i,new G(wt,Rt),{renderSize:[r,r],camera:c,out:{depth:n},cullface:"front"});const m=new B("./resources/vanilla-milkshake-1x.png"),v=new B("./resources/roughness.png"),g=new B("./resources/metallic.png"),p=new B("./resources/ibl/grasslands_sunset/ibl_irradiance_cube.dds"),_=new B("./resources/ibl/grasslands_sunset/ibl_specular_cube.dds"),E=new B("./resources/ibl/grasslands_sunset/brdf_look_up_table.dds");let T=new X(i,new G(zt,Nt),{camera:e,uniforms:[{name:"u_shadow",type:"t",value:n},{name:"u_palette",type:"t",value:m},{name:"u_roughness",type:"t",value:v},{name:"u_metallic",type:"t",value:g},{name:"u_diffuse",type:"t",value:p},{name:"u_specular",type:"t",value:_},{name:"u_brdf",type:"t",value:E},{name:"u_shadowViewProj",type:"m4",value:c.viewProjMatrix}]});at=new bt([h,T])}function ee(){at.render()}const oe=`#version 300 es
 
in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_uv;
out vec3 v_viewDirection;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform vec3 u_cameraPosition;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;

    v_position = position.xyz;
    v_normal = normalize(mat3(u_modelMatrix) * a_normal);
    v_uv = a_uv;
    v_viewDirection = u_cameraPosition - position.xyz;
}
`,ie=`#version 300 es
 
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
${xt}

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
`,re=`#version 300 es

precision mediump float;

in vec3 a_position;
in vec2 a_uv;

out vec2 v_uv;

void main() {
    gl_Position = vec4(a_position, 1.0);
    v_uv = a_uv;
}
`,ne=`#version 300 es

precision highp float;

in vec2 v_uv;

out vec4 outColor;

uniform sampler2D u_color;
uniform sampler2D u_normal;
uniform sampler2D u_depth;

uniform vec2 u_viewportSize;
uniform float u_near;
uniform float u_far;

${Tt}

vec4 getPixel(sampler2D tex, ivec2 offset) {
    ivec2 uv = ivec2(gl_FragCoord.xy) + offset;
    return texelFetch(tex, uv, 0);
}

float linearize_depth(float d,float zNear,float zFar) {
    float z_n = 2.0 * d - 1.0;
    return 2.0 * zNear * zFar / (zFar + zNear - z_n * (zFar - zNear));
}

float getDepthPixel(int offsetX, int offsetY) {
    return linearize_depth(getPixel(u_depth, ivec2(offsetX, offsetY)).r, u_near, u_far);
}

vec3 getNormalPixel(int offsetX, int offsetY) {
    return getPixel(u_normal, ivec2(offsetX, offsetY)).rgb;
}

void main() {
    float minSeparation = 1.0;
    float maxSeparation = 1.0;
    float minDistance   = 1.5;
    float maxDistance   = 2.0;
    float noiseScale    = 1.0;
    int   size          = 1;
    vec3  colorModifier = vec3(0.522, 0.431, 0.349);

    float depth = getDepthPixel(0, 0);
    float depthDiff = 0.0;
    depthDiff += abs(depth - getDepthPixel(1, 0));
    depthDiff += abs(depth - getDepthPixel(-1, 0));
    depthDiff += abs(depth - getDepthPixel(0, 1));
    depthDiff += abs(depth - getDepthPixel(0, -1));
    depthDiff += abs(depth - getDepthPixel(1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, 1));
    depthDiff += abs(depth - getDepthPixel(-1, -1));
    depthDiff /= 8.0;

    vec3 normal = getNormalPixel(0, 0);
    float normalDiff = 0.0;
    normalDiff += distance(normal, getNormalPixel(1, 0));
    normalDiff += distance(normal, getNormalPixel(-1, 0));
    normalDiff += distance(normal, getNormalPixel(0, 1));
    normalDiff += distance(normal, getNormalPixel(0, -1));
    normalDiff += distance(normal, getNormalPixel(1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, 1));
    normalDiff += distance(normal, getNormalPixel(-1, -1));
    normalDiff /= 8.0;

    float outline = smoothstep(0.01, 0.2, normalDiff) + smoothstep(0.1, 0.9, depthDiff);
    vec4 color = texture(u_color, v_uv);
    vec4 outlineColor = vec4(62.0 / 255.0, 34.0 / 255.0, 161.0 / 255.0, 1.0);
    vec4 finalColor = mix(color, outlineColor, outline);

    outColor = gammaCorrect(finalColor);
}`;let st=null;function ae(i,e,o){if(st!=null)return;const r=2048,n=new k(J,{size:[r,r],compareMode:!0,filter:"linear"}),a=Et(o),s=40,l=[a[0]*s,a[1]*s,a[2]*s],f=Math.abs(a.y)>.99?[1,0,0]:[0,1,0],u=s*1.2;let c=new lt(Z,{position:l,target:[0,0,0],up:f,near:.1,far:s*4,left:-u,right:u,top:-u,bottom:u}),h=new X(i,new G(wt,Rt),{renderSize:[r,r],camera:c,out:{depth:n},cullface:"front"});const m=new B("./resources/vanilla-milkshake-1x.png"),v=new k(nt),g=new k(nt,{wrap:"clamp"}),p=new k(J,{wrap:"clamp"});let _=new X(i,new G(oe,ie),{camera:e,uniforms:[{name:"u_shadow",type:"t",value:n},{name:"u_palette",type:"t",value:m},{name:"u_shadowViewProj",type:"m4",value:c.viewProjMatrix}],out:{colors:[v,g],depth:p}}),E=new X(tt.getPostProcessPlane(),new G(re,ne),{camera:e,uniforms:[{name:"u_color",type:"t",value:v},{name:"u_normal",type:"t",value:g},{name:"u_depth",type:"t",value:p}]});st=new bt([h,_,E])}function se(){st.render()}async function ce(){Pt();const i=new rt(await j.fromOBJ("./resources/planet.obj"),[-11,-36,0]),e=new rt(await j.fromOBJ("./resources/car.obj"),[8,-1.5,0],[0,0,-N(29)]),o=[-2,5,-6],r=new tt([e,i],{directional:[{direction:o,color:[1,.8,.6],intensity:1}],point:[{position:[9.6,-3,.78],color:[1,0,0],intensity:.3},{position:[9.6,-3,-.78],color:[1,0,0],intensity:.3},{position:[5.3,-.5,.7],color:[1,1,0],intensity:.7},{position:[5.3,-.5,-.7],color:[1,1,0],intensity:.7}]}),n={pbr:{load:te,render:ee},scientific:{load:ae,render:se}};let a="pbr";document.body.classList=a;let s=0;const l=[[30,0,0],[25,0,15],[45,30,55],[10,0,0]],f=[[0,0,0],[0,1,0],[-5,0,0],[0,2,0]],u=new lt(it,{position:l[s]});Ft({cameraCallback:()=>{s=(s+1)%l.length;const m=l[s],v=f[s];u.moveCamera(m,v)},shadingCallback:m=>{a=m,n[a].load(r,u,o),document.body.classList=m}}),n[a].load(r,u,o);let c=0;function h(m){m*=.001;let v=m-c;i.rotateZ(-10*v),u.update(v),c=m,n[a].render(),requestAnimationFrame(h)}requestAnimationFrame(h)}ce();
