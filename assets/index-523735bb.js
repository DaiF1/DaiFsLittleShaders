var At=Object.defineProperty;var Lt=(i,e,o)=>e in i?At(i,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[e]=o;var it=(i,e,o)=>(Lt(i,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=o(a);fetch(a.href,n)}})();const ut=new Map;function yt(i){for(const e of i){let o,r,a=window.devicePixelRatio;e.devicePixelContentBoxSize?(o=e.devicePixelContentBoxSize[0].inlineSize,r=e.devicePixelContentBoxSize[0].blockSize,a=1):e.contentBoxSize?e.contentBoxSize[0]?(o=e.contentBoxSize[0].inlineSize,r=e.contentBoxSize[0].blockSize):(o=e.contentBoxSize.inlineSize,r=e.contentBoxSize.blockSize):(o=e.contentRect.width,r=e.contentRect.height);const n=Math.round(o*a),s=Math.round(r*a);ut.set(e.target,[n,s])}}function Mt(i){const[e,o]=ut.get(i),r=i.width!==e||i.height!==o;return r&&(i.width=e,i.height=o,t.viewport(0,0,i.width,i.height)),r}function Ct(i){ut.set(i,[i.width,i.height]),new ResizeObserver(yt).observe(i,{box:"content-box"}),Mt(i)}let t=null;function St(){let i=document.getElementById("c");if(i.width=window.innerWidth,i.height=window.innerHeight,t=i.getContext("webgl2"),t.viewport(0,0,i.width,i.height),!t){console.error("Does not support webgl2");return}Ct(i)}function Ft(i){const e=[[0,0,0]],o=[[0,0]],r=[[0,0,0]],a=[e,o,r];let n=[[],[],[]];function s(u){u.split("/").forEach((v,m)=>{if(!v)return;const p=parseInt(v),_=p+(p>=0?0:a[m].length);n[m].push(...a[m][_])})}const c={v(u){e.push(u.map(parseFloat))},vn(u){r.push(u.map(parseFloat))},vt(u){o.push(u.map(parseFloat))},f(u){const h=u.length-2;for(let v=0;v<h;++v)s(u[0]),s(u[v+1]),s(u[v+2])}},f=/(\w*)(?: )*(.*)/,l=i.split(`
`);for(let u=0;u<l.length;++u){const h=l[u].trim();if(h===""||h.startsWith("#"))continue;const v=f.exec(h);if(!v)continue;const[,m,p]=v,_=h.split(/\s+/).slice(1),g=c[m];if(!g){console.warn("unhandled keyword:",m);continue}g(_,p)}return{position:n[0],texcoord:n[1],normal:n[2]}}class V{constructor(e,o,r){this.vertices=e??[],this.normals=o??[],this.uvs=r??[],this.programCache={}}createVAO(e){let o=t.createVertexArray();t.bindVertexArray(o);let r=t.getAttribLocation(e,"a_position");if(r>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.vertices),t.STATIC_DRAW),t.enableVertexAttribArray(r),t.vertexAttribPointer(r,3,t.FLOAT,!1,0,0)}let a=t.getAttribLocation(e,"a_normal");if(a>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.normals),t.STATIC_DRAW),t.enableVertexAttribArray(a),t.vertexAttribPointer(a,3,t.FLOAT,!1,0,0)}let n=t.getAttribLocation(e,"a_uv");if(n>=0){let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.uvs),t.STATIC_DRAW),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0)}return t.bindBuffer(t.ARRAY_BUFFER,null),t.bindVertexArray(null),o}draw(e){let o=this.programCache[e.id];o==null&&(o=this.createVAO(e.program),this.programCache[e.id]=o),t.bindVertexArray(o),t.drawArrays(t.TRIANGLES,0,this.vertices.length/3)}static async fromOBJ(e){const o=await(await fetch(e)).text(),r=Ft(o);return new V(r.position,r.normal,r.texcoord)}}function X(i){return i*Math.PI/180}function rt(i,e,o){return i*(1-o)+e*o}function Et(i,e,o){return[rt(i[0],e[0],o),rt(i[1],e[1],o),rt(i[2],e[2],o)]}function Ut(i){return Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2])}function ht(i){const e=Ut(i);return[i[0]/e,i[1]/e,i[2]/e]}const d={perspective:function(i,e,o,r){var a=Math.tan(Math.PI*.5-.5*i),n=1/(o-r);return[a/e,0,0,0,0,a,0,0,0,0,(o+r)*n,-1,0,0,o*r*n*2,0]},orthographic:function(i,e,o,r,a,n){return[2/(e-i),0,0,0,0,2/(r-o),0,0,0,0,2/(a-n),0,(i+e)/(i-e),(o+r)/(o-r),(a+n)/(a-n),1]},multiply:function(i,e){var o=i[0],r=i[0*4+1],a=i[0*4+2],n=i[0*4+3],s=i[1*4+0],c=i[1*4+1],f=i[1*4+2],l=i[1*4+3],u=i[2*4+0],h=i[2*4+1],v=i[2*4+2],m=i[2*4+3],p=i[3*4+0],_=i[3*4+1],g=i[3*4+2],x=i[3*4+3],w=e[0*4+0],T=e[0*4+1],M=e[0*4+2],P=e[0*4+3],A=e[1*4+0],L=e[1*4+1],y=e[1*4+2],C=e[1*4+3],S=e[2*4+0],F=e[2*4+1],U=e[2*4+2],z=e[2*4+3],N=e[3*4+0],I=e[3*4+1],B=e[3*4+2],O=e[3*4+3];return[w*o+T*s+M*u+P*p,w*r+T*c+M*h+P*_,w*a+T*f+M*v+P*g,w*n+T*l+M*m+P*x,A*o+L*s+y*u+C*p,A*r+L*c+y*h+C*_,A*a+L*f+y*v+C*g,A*n+L*l+y*m+C*x,S*o+F*s+U*u+z*p,S*r+F*c+U*h+z*_,S*a+F*f+U*v+z*g,S*n+F*l+U*m+z*x,N*o+I*s+B*u+O*p,N*r+I*c+B*h+O*_,N*a+I*f+B*v+O*g,N*n+I*l+B*m+O*x]},translation:function(i,e,o){return[1,0,0,0,0,1,0,0,0,0,1,0,i,e,o,1]},xRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[1,0,0,0,0,e,o,0,0,-o,e,0,0,0,0,1]},yRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[e,0,-o,0,0,1,0,0,o,0,e,0,0,0,0,1]},zRotation:function(i){var e=Math.cos(i),o=Math.sin(i);return[e,o,0,0,-o,e,0,0,0,0,1,0,0,0,0,1]},scaling:function(i,e,o){return[i,0,0,0,0,e,0,0,0,0,o,0,0,0,0,1]},translate:function(i,e,o,r){return d.multiply(i,d.translation(e,o,r))},xRotate:function(i,e){return d.multiply(i,d.xRotation(e))},yRotate:function(i,e){return d.multiply(i,d.yRotation(e))},zRotate:function(i,e){return d.multiply(i,d.zRotation(e))},scale:function(i,e,o,r){return d.multiply(i,d.scaling(e,o,r))},inverse:function(i){var e=i[0],o=i[0*4+1],r=i[0*4+2],a=i[0*4+3],n=i[1*4+0],s=i[1*4+1],c=i[1*4+2],f=i[1*4+3],l=i[2*4+0],u=i[2*4+1],h=i[2*4+2],v=i[2*4+3],m=i[3*4+0],p=i[3*4+1],_=i[3*4+2],g=i[3*4+3],x=h*g,w=_*v,T=c*g,M=_*f,P=c*v,A=h*f,L=r*g,y=_*a,C=r*v,S=h*a,F=r*f,U=c*a,z=l*p,N=m*u,I=n*p,B=m*s,O=n*u,Y=l*s,q=e*p,K=m*o,Z=e*u,J=l*o,Q=e*s,tt=n*o,_t=x*s+M*u+P*p-(w*s+T*u+A*p),gt=w*o+L*u+S*p-(x*o+y*u+C*p),xt=T*o+y*s+F*p-(M*o+L*s+U*p),wt=A*o+C*s+U*u-(P*o+S*s+F*u),E=1/(e*_t+n*gt+l*xt+m*wt);return[E*_t,E*gt,E*xt,E*wt,E*(w*n+T*l+A*m-(x*n+M*l+P*m)),E*(x*e+y*l+C*m-(w*e+L*l+S*m)),E*(M*e+L*n+U*m-(T*e+y*n+F*m)),E*(P*e+S*n+F*l-(A*e+C*n+U*l)),E*(z*f+B*v+O*g-(N*f+I*v+Y*g)),E*(N*a+q*v+J*g-(z*a+K*v+Z*g)),E*(I*a+K*f+Q*g-(B*a+q*f+tt*g)),E*(Y*a+Z*f+tt*v-(O*a+J*f+Q*v)),E*(I*h+Y*_+N*c-(O*_+z*c+B*h)),E*(Z*_+z*r+K*h-(q*h+J*_+N*r)),E*(q*c+tt*_+B*r-(Q*_+I*r+K*c)),E*(Q*h+O*r+J*c-(Z*c+tt*h+Y*r))]},cross:function(i,e){return[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]]},subtractVectors:function(i,e){return[i[0]-e[0],i[1]-e[1],i[2]-e[2]]},normalize:function(i){var e=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);return e>1e-5?[i[0]/e,i[1]/e,i[2]/e]:[0,0,0]},lookAt:function(i,e,o){var r=d.normalize(d.subtractVectors(i,e)),a=d.normalize(d.cross(o,r)),n=d.normalize(d.cross(r,a));return[a[0],a[1],a[2],0,n[0],n[1],n[2],0,r[0],r[1],r[2],0,i[0],i[1],i[2],1]},transformVector:function(i,e){for(var o=[],r=0;r<4;++r){o[r]=0;for(var a=0;a<4;++a)o[r]+=e[a]*i[a*4+r]}return o}},at="perspective",H="orthographic";class ot{constructor(e,o={}){if(this.type=e,e===at){this.fov=o.fov?X(o.fov):X(30),this.near=o.near??1,this.far=o.far??2e3;const r=t.canvas.clientWidth/t.canvas.clientHeight;this.projMatrix=d.perspective(this.fov,r,this.near,this.far)}else e===H&&(this.left=o.left??-100,this.right=o.right??100,this.bottom=o.left??100,this.top=o.right??-100,this.far=o.far??-400,this.near=o.near??400,this.projMatrix=d.orthographic(this.left,this.right,this.bottom,this.top,this.near,this.far));this.position=o.position??[10,0,0],this.target=o.target??[0,0,0],this.up=o.up??[0,1,0],this.cameraMatrix=d.lookAt(this.position,this.target,this.up),this.viewMatrix=d.inverse(this.cameraMatrix),this.needsUpdate=!1}bindUniforms(e){let o=t.getUniformLocation(e,"u_viewMatrix");o!=null&&t.uniformMatrix4fv(o,!1,this.viewMatrix);let r=t.getUniformLocation(e,"u_projectionMatrix");r!=null&&t.uniformMatrix4fv(r,!1,this.projMatrix);let a=t.getUniformLocation(e,"u_cameraPosition");a!=null&&t.uniform3fv(a,this.position);let n=t.getUniformLocation(e,"u_near");n!=null&&t.uniform1f(n,this.near);let s=t.getUniformLocation(e,"u_far");s!=null&&t.uniform1f(s,this.far);let c=t.getUniformLocation(e,"u_viewportSize");c!=null&&t.uniform2fv(c,[t.canvas.width,t.canvas.height])}moveCamera(e,o){this.startPosition=this.position,this.targetPosition=e,this.startTarget=this.target,this.targetTarget=o,this.needsUpdate=!0,this.timeElapsed=0}update(e){this.needsUpdate&&(this.timeElapsed+=e,this.timeElapsed>=1&&(this.timeElapsed=1),this.position=Et(this.startPosition,this.targetPosition,this.timeElapsed),this.target=Et(this.startTarget,this.targetTarget,this.timeElapsed),this.cameraMatrix=d.lookAt(this.position,this.target,this.up),this.viewMatrix=d.inverse(this.cameraMatrix),this.timeElapsed>=1&&(this.needsUpdate=!1))}recalculateMatrix(){if(this.type===at){const e=t.canvas.clientWidth/t.canvas.clientHeight;this.projMatrix=d.perspective(this.fov,e,this.near,this.far)}else this.type}get viewProjMatrix(){return d.multiply(this.projMatrix,this.viewMatrix)}}class nt{constructor(e,o=[0,0,0],r=[0,0,0],a=[1,1,1]){this.mesh=e,this.position=o,this.rotation=r,this.scale=a,this.positionMat=d.translation(o[0],o[1],o[2]),this.rotationMat=d.xRotation(r[0]),this.rotationMat=d.yRotate(this.rotationMat,r[1]),this.rotationMat=d.zRotate(this.rotationMat,r[2]),this.scaleMat=d.scaling(a[0],a[1],a[2]),this.computeMatrix()}computeMatrix(){this.matrix=d.multiply(this.positionMat,d.multiply(this.scaleMat,this.rotationMat))}draw(e){let o=t.getUniformLocation(e.program,"u_modelMatrix");o!=null&&t.uniformMatrix4fv(o,!1,this.matrix),this.mesh.draw(e)}rotateX(e){this.rotationMat=d.xRotate(this.rotationMat,X(e)),this.computeMatrix()}setRotationX(e){this.rotation[0]=X(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}rotateY(e){this.rotationMat=d.yRotate(this.rotationMat,X(e)),this.computeMatrix()}setRotationY(e){this.rotation[1]=X(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}rotateZ(e){this.rotationMat=d.zRotate(this.rotationMat,X(e)),this.computeMatrix()}setRotationZ(e){this.rotation[2]=X(e),this.rotationMat=d.xRotation(this.rotation[0]),this.rotationMat=d.yRotate(this.rotationMat,this.rotation[1]),this.rotationMat=d.zRotate(this.rotationMat,this.rotation[2]),this.computeMatrix()}}const Tt=10;class W{constructor(e,o={}){this.objects=e??[],this.directionalLights=o.directional??[],this.pointLights=o.point??[]}render(e){const o=e.program,r=Math.min(Tt,this.directionalLights.length),a=t.getUniformLocation(o,"u_dirLightCount");a!=null&&t.uniform1i(a,r);for(let c=0;c<r;c++){const f=t.getUniformLocation(o,`u_dirLights[${c}].direction`),l=t.getUniformLocation(o,`u_dirLights[${c}].color`),u=t.getUniformLocation(o,`u_dirLights[${c}].intensity`),h=this.directionalLights[c];t.uniform3fv(f,h.direction),t.uniform3fv(l,h.color),t.uniform1f(u,h.intensity)}const n=Math.min(Tt,this.pointLights.length),s=t.getUniformLocation(o,"u_pointLightCount");s!=null&&t.uniform1i(s,n);for(let c=0;c<n;c++){const f=t.getUniformLocation(o,`u_pointLights[${c}].position`),l=t.getUniformLocation(o,`u_pointLights[${c}].color`),u=t.getUniformLocation(o,`u_pointLights[${c}].intensity`),h=this.pointLights[c];t.uniform3fv(f,h.position),t.uniform3fv(l,h.color),t.uniform1f(u,h.intensity)}for(let c of this.objects)c.draw(e)}static getPostProcessPlane(){const e=new V([-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0],[],[0,0,1,0,0,1,0,1,1,0,1,1]);return new W([new nt(e)])}}function zt(i){document.getElementById("camera-button").addEventListener("click",i)}function Nt(i){document.querySelectorAll(".custom-select").forEach(o=>{const r=o.querySelector(".select-button"),a=o.querySelector(".select-dropdown"),n=a.querySelectorAll("li"),s=r.querySelector(".selected-value"),c=(l=null)=>{const u=l!==null?l:a.classList.contains("hidden");a.classList.toggle("hidden",!u),r.setAttribute("aria-expanded",u)},f=l=>{n.forEach(u=>u.classList.remove("selected")),l.classList.add("selected"),s.textContent=l.textContent.trim(),i(l.dataset.value)};n.forEach(l=>{l.addEventListener("click",()=>{f(l),c(!1)}),l.addEventListener("keydown",u=>{(u.key==="Enter"||u.keyCode===13)&&(f(l),c(!1))})}),r.addEventListener("click",()=>{c()}),document.addEventListener("click",l=>{!o.contains(l.target)&&c(!1)})})}function It(i){zt(i.cameraCallback),Nt(i.shadingCallback)}const Bt=`#version 300 es
 
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
`,ft=`
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
`,Ot=`
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
`,mt=`
vec3 gammaCorrect(vec3 color) {
    float gamma = 2.2;
    return pow(color, vec3(1.0 / gamma));
}

vec4 gammaCorrect(vec4 color) {
    return vec4(gammaCorrect(color.rgb), color.a);
}
`,Xt=`#version 300 es
 
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
${ft}

// Tonemapping
${Ot}

${mt}

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
`,dt=`#version 300 es
 
in vec3 a_position;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    vec4 position = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * position;
}
`,vt=`#version 300 es

precision mediump float;
 
out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`,$="color",j="depth";function kt(i){switch(i){case"linear":return t.LINEAR;case"nearest":return t.NEAREST}}function Gt(i){switch(i){case"repeat":return t.REPEAT;case"clamp":return t.CLAMP_TO_EDGE}}class b{constructor(e,o={}){this.target=e;const r=o.size!=null?o.size[0]:t.canvas.width,a=o.size!=null?o.size[1]:t.canvas.height;this.matchCanvasSize=o.size==null,this.filter=o.filter??"nearest",this.wrap=o.wrap??"repeat",this.compareMode=o.compareMode??!1,this.createTexture(r,a)}bind(e){t.activeTexture(t.TEXTURE0+parseInt(e)),t.bindTexture(t.TEXTURE_2D,this.texture)}resize(e,o){t.deleteTexture(this.texture),this.createTexture(e,o)}createTexture(e,o){this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),this.target===$?t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,o,0,t.RGBA,t.UNSIGNED_BYTE,null):t.texStorage2D(t.TEXTURE_2D,1,t.DEPTH_COMPONENT32F,e,o);const r=kt(this.filter),a=Gt(this.wrap);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,a),this.compareMode&&(t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL)),t.bindTexture(t.TEXTURE_2D,null)}}function jt(i){switch(i){case t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"INCOMPLETE_ATTACHMENT";case t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"INCOMPLETE_MISSING_ATTACHMENT";case t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"INCOMPLETE_DIMENSIONS";case t.FRAMEBUFFER_UNSUPPORTED:return"UNSUPPORTED"}}class pt{constructor(e){this.passes=e,this.cache={},this.lastSize={width:t.canvas.width,height:t.canvas.height}}render(e){let o=Mt(t.canvas);o&&(this.lastSize={width:t.canvas.width,height:t.canvas.height});for(let r of this.passes){const a=r.renderWidth??t.canvas.width,n=r.renderHeight??t.canvas.height;if((a!==this.lastSize.width||n!==this.lastSize.height)&&(o=!0),r.out!=null){if(o||this.cache[r.id]==null){this.cache[r.id]&&(t.deleteFramebuffer(this.cache[r.id].fb),this.cache[r.id].renderbuffer&&t.deleteTexture(this.cache[r.id].renderbuffer.texture));const s=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,s);const c=r.out.colors??[],f=[];for(let h=0;h<c.length;h++){const v=c[h];o&&v.resize(a,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+h,t.TEXTURE_2D,v.texture,0),f.push(t.COLOR_ATTACHMENT0+h)}let l=r.out.depth;l==null?l=new b(j,{renderSize:[a,n]}):o&&l.resize(a,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,l.texture,0);const u=t.checkFramebufferStatus(t.FRAMEBUFFER);u!==t.FRAMEBUFFER_COMPLETE&&console.error(`Invalid Framebuffer (status: ${jt(u)}).`),this.cache[r.id]={fb:s,attachments:f,renderbuffer:r.out.depth==null?l:null}}t.bindFramebuffer(t.FRAMEBUFFER,this.cache[r.id].fb),t.drawBuffers(this.cache[r.id].attachments)}else t.bindFramebuffer(t.FRAMEBUFFER,null),t.drawBuffers([t.BACK]);t.viewport(0,0,a,n),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),r.run(o,e)}}}function Rt(i,e,o){switch(e){case"m4":t.uniformMatrix4fv(i,!1,o);break;case"t":t.uniform1i(i,o);break;case"f":t.uniform1f(i,o);break;default:console.error(`Type not supported: ${e}`)}}function Vt(i){switch(i){case"front":return t.FRONT;case"back":return t.BACK;case"double":return t.FRONT_AND_BACK}}const et=class et{constructor(e,o,r){this.id=et.lastId++,this.scene=e,this.camera=r.camera??null,this.shader=o,this.out=r.out,this.camera=r.camera??null,this.renderWidth=r.renderSize?r.renderSize[0]:null,this.renderHeight=r.renderSize?r.renderSize[1]:null,this.uniforms=r.uniforms??[],this.cullface=r.cullface??"back"}run(e,o){this.cullface!=="none"?(t.enable(t.CULL_FACE),t.cullFace(Vt(this.cullface))):t.disable(t.CULL_FACE),t.enable(t.DEPTH_TEST),t.useProgram(this.shader.program),this.camera!=null&&(e&&this.camera.recalculateMatrix(),this.camera.bindUniforms(this.shader.program));let r=0;for(let n of this.uniforms){let s=n.value;if(n.type==="t"){const f=r++;n.value.bind(f),s=f}const c=t.getUniformLocation(this.shader.program,n.name);Rt(c,n.type,s)}const a=t.getUniformLocation(this.shader.program,"u_time");Rt(a,"f",o),this.scene.render(this.shader)}};it(et,"lastId",0);let D=et;const bt={R32G32B32A32_FLOAT:2,R16G16_FLOAT:34},Ht=542327876,$t=808540228,Wt=124,Yt=20,qt=4+Wt+Yt,Kt=4;function Zt(i){const e={[bt.R32G32B32A32_FLOAT]:{internalFormat:t.RGBA32F,format:t.RGBA,type:t.FLOAT,dataType:Float32Array,bytesPerPixel:16},[bt.R16G16_FLOAT]:{internalFormat:t.RG16F,format:t.RG,type:t.HALF_FLOAT,dataType:Uint16Array,bytesPerPixel:4}},o=new DataView(i),r=_=>o.getUint32(_,!0);if(r(0)!==Ht)throw new Error("Error: not a DDS file");const a=r(84);if(a!==$t)throw new Error(`Error: not a DX10 DDS file (${a.toString(16)})`);const n=r(128),s=e[n];if(!s)throw new Error(`Error: format not in list (${n})`);const c=r(136)===Kt,f=c?6:1,l=r(28)||1,u=r(16),h=r(12),v=(_,g)=>_*g*s.bytesPerPixel,m=Array.from({length:f},()=>[]);let p=qt;for(let _=0;_<f;_++){let g=u,x=h;for(let w=0;w<l;w++){const T=v(g,x);m[_].push({data:new s.dataType(i,p,T/s.dataType.BYTES_PER_ELEMENT),width:g,height:x}),p+=T,g=Math.max(1,g>>1),x=Math.max(1,x>>1)}}return{isCubemap:c,faces:m,glFormat:s}}function Jt(i){const e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let o=new Image;return o.src=i,o.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,o),t.generateMipmap(t.TEXTURE_2D)}),t.bindTexture(t.TEXTURE_2D,null),{texture:e,isCubemap:!1}}async function Qt(i){t.getExtension("OES_texture_float_linear"),t.getExtension("OES_texture_half_float_linear");const e=await(await fetch(i)).arrayBuffer(),{isCubemap:o,faces:r,glFormat:a}=Zt(e),n=r[0].length,s=t.createTexture(),c=o?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D;t.bindTexture(c,s),t.texParameteri(c,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(c,t.TEXTURE_MIN_FILTER,n>1?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(c,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(c,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),o&&t.texParameteri(c,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),n>1&&(t.texParameteri(c,t.TEXTURE_BASE_LEVEL,0),t.texParameteri(c,t.TEXTURE_MAX_LEVEL,n-1));for(let f=0;f<r.length;f++){const l=o?t.TEXTURE_CUBE_MAP_POSITIVE_X+f:t.TEXTURE_2D;for(let u=0;u<n;u++){const{data:h,width:v,height:m}=r[f][u];t.texImage2D(l,u,a.internalFormat,v,m,0,a.format,a.type,h)}}return t.bindTexture(c,null),{texture:s,isCubemap:o}}const G=class G{constructor(e){this._loadTexture(e)}async _loadTexture(e){if(e in G.cache){this.texture=G.cache[e].texture,this.isCubemap=G.cache[e].isCubemap;return}const o=e.split(".").pop();switch(this.file=e,o){case"png":{const{texture:r,isCubemap:a}=Jt(e);this.texture=r,this.isCubemap=a}break;case"dds":{const{texture:r,isCubemap:a}=await Qt(e);this.texture=r,this.isCubemap=a}break;default:console.error(`Unknown image type: '${o}'.`);return}G.cache[e]={texture:this.texture,isCubemap:this.isCubemap}}bind(e){this.texture&&(t.activeTexture(t.TEXTURE0+parseInt(e)),this.isCubemap?t.bindTexture(t.TEXTURE_CUBE_MAP,this.texture):t.bindTexture(t.TEXTURE_2D,this.texture))}};it(G,"cache",{});let R=G,te=0;function Dt(i,e){let o=t.createShader(i);if(t.shaderSource(o,e),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS))return o;console.warn(t.getShaderInfoLog(o)),t.deleteShader(o)}function ee(i,e){let o=t.createProgram();if(t.attachShader(o,i),t.attachShader(o,e),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS))return t.detachShader(o,i),t.detachShader(o,e),t.deleteShader(i),t.deleteShader(e),o;console.log(t.getProgramInfoLog(o)),t.deleteProgram(o)}class k{constructor(e,o){this.id=te++,this.program=this.compileShader(e,o)}compileShader(e,o){let r=Dt(t.VERTEX_SHADER,e),a=Dt(t.FRAGMENT_SHADER,o);return ee(r,a)}}let st=null;function oe(i,e,o){if(st!=null)return;const r=2048,a=new b(j,{size:[r,r],compareMode:!0,filter:"linear"}),n=ht(o),s=40,c=[n[0]*s,n[1]*s,n[2]*s],f=Math.abs(n.y)>.99?[1,0,0]:[0,1,0],l=s*1.2;let u=new ot(H,{position:c,target:[0,0,0],up:f,near:.1,far:s*4,left:-l,right:l,top:-l,bottom:l}),h=new D(i,new k(dt,vt),{renderSize:[r,r],camera:u,out:{depth:a},cullface:"front"});const v=new R("./resources/vanilla-milkshake-1x.png"),m=new R("./resources/roughness.png"),p=new R("./resources/metallic.png"),_=new R("./resources/ibl/grasslands_sunset/ibl_irradiance_cube.dds"),g=new R("./resources/ibl/grasslands_sunset/ibl_specular_cube.dds"),x=new R("./resources/ibl/grasslands_sunset/brdf_look_up_table.dds");let w=new D(i,new k(Bt,Xt),{camera:e,uniforms:[{name:"u_shadow",type:"t",value:a},{name:"u_palette",type:"t",value:v},{name:"u_roughness",type:"t",value:m},{name:"u_metallic",type:"t",value:p},{name:"u_diffuse",type:"t",value:_},{name:"u_specular",type:"t",value:g},{name:"u_brdf",type:"t",value:x},{name:"u_shadowViewProj",type:"m4",value:u.viewProjMatrix}]});st=new pt([h,w])}function ie(i){st.render(i)}const re=`#version 300 es
 
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
`,ae=`#version 300 es
 
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
${ft}

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
`,Pt=`#version 300 es

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

${mt}

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
}`;let ct=null;function se(i,e,o){if(ct!=null)return;const r=2048,a=new b(j,{size:[r,r],compareMode:!0,filter:"linear"}),n=ht(o),s=40,c=[n[0]*s,n[1]*s,n[2]*s],f=Math.abs(n.y)>.99?[1,0,0]:[0,1,0],l=s*1.2;let u=new ot(H,{position:c,target:[0,0,0],up:f,near:.1,far:s*4,left:-l,right:l,top:-l,bottom:l}),h=new D(i,new k(dt,vt),{renderSize:[r,r],camera:u,out:{depth:a},cullface:"front"});const v=new R("./resources/vanilla-milkshake-1x.png"),m=new b($),p=new b($,{wrap:"clamp"}),_=new b(j,{wrap:"clamp"});let g=new D(i,new k(re,ae),{camera:e,uniforms:[{name:"u_shadow",type:"t",value:a},{name:"u_palette",type:"t",value:v},{name:"u_shadowViewProj",type:"m4",value:u.viewProjMatrix}],out:{colors:[m,p],depth:_}}),x=new D(W.getPostProcessPlane(),new k(Pt,ne),{camera:e,uniforms:[{name:"u_color",type:"t",value:m},{name:"u_normal",type:"t",value:p},{name:"u_depth",type:"t",value:_}]});ct=new pt([h,g,x])}function ce(i){ct.render(i)}const le=`#version 300 es
 
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
`,ue=`#version 300 es
 
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
${ft}

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
`,he=`#version 300 es

precision highp float;

in vec2 v_uv;

out vec4 outColor;

uniform sampler2D u_color;
uniform sampler2D u_normal;
uniform sampler2D u_depth;

uniform vec2 u_viewportSize;
uniform float u_near;
uniform float u_far;

${mt}

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
    //vec4 outlineColor = vec4(62.0 / 255.0, 34.0 / 255.0, 161.0 / 255.0, 1.0);
    vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 finalColor = mix(color, outlineColor, outline);

    outColor = gammaCorrect(finalColor);
}`;let lt=null;function fe(i,e,o){if(lt!=null)return;const r=2048,a=new b(j,{size:[r,r],compareMode:!0,filter:"linear"}),n=ht(o),s=40,c=[n[0]*s,n[1]*s,n[2]*s],f=Math.abs(n.y)>.99?[1,0,0]:[0,1,0],l=s*1.2;let u=new ot(H,{position:c,target:[0,0,0],up:f,near:.1,far:s*4,left:-l,right:l,top:-l,bottom:l}),h=new D(i,new k(dt,vt),{renderSize:[r,r],camera:u,out:{depth:a},cullface:"front"});const v=new R("./resources/vanilla-milkshake-1x.png"),m=new R("./resources/crosshatching.png"),p=new b($),_=new b($,{wrap:"clamp"}),g=new b(j,{wrap:"clamp"});let x=new D(i,new k(le,ue),{camera:e,uniforms:[{name:"u_shadow",type:"t",value:a},{name:"u_palette",type:"t",value:v},{name:"u_shadowViewProj",type:"m4",value:u.viewProjMatrix},{name:"u_crossHatching",type:"t",value:m}],out:{colors:[p,_],depth:g}}),w=new D(W.getPostProcessPlane(),new k(Pt,he),{camera:e,uniforms:[{name:"u_color",type:"t",value:p},{name:"u_normal",type:"t",value:_},{name:"u_depth",type:"t",value:g}]});lt=new pt([h,x,w])}function me(i){lt.render(i)}async function de(){St();const i=new nt(await V.fromOBJ("./resources/planet.obj"),[-11,-36,0]),e=new nt(await V.fromOBJ("./resources/car.obj"),[8,-1.5,0],[0,0,-X(29)]),o=[-2,5,-6],r=new W([e,i],{directional:[{direction:o,color:[1,.8,.6],intensity:1}],point:[{position:[9.6,-3,.78],color:[1,0,0],intensity:.3},{position:[9.6,-3,-.78],color:[1,0,0],intensity:.3},{position:[5.3,-.5,.7],color:[1,1,0],intensity:.7},{position:[5.3,-.5,-.7],color:[1,1,0],intensity:.7}]}),a={pbr:{load:oe,render:ie},scientific:{load:se,render:ce},handdrawn:{load:fe,render:me}};let n="pbr";document.body.classList=n;let s=0;const c=[[30,0,0],[25,0,15],[45,30,55],[10,0,0]],f=[[0,0,0],[0,1,0],[-5,0,0],[0,2,0]],l=new ot(at,{position:c[s]});It({cameraCallback:()=>{s=(s+1)%c.length;const m=c[s],p=f[s];l.moveCamera(m,p)},shadingCallback:m=>{n=m,a[n].load(r,l,o),document.body.classList=m}}),a[n].load(r,l,o);let u=0,h=0;function v(m){m*=.001;let p=m-u;h+=p,i.rotateZ(-10*p),l.update(p),u=m,a[n].render(h),requestAnimationFrame(v)}requestAnimationFrame(v)}de();
