import * as THREE from 'three';

const Shader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
      vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float b;
    uniform float p;
    uniform float s;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
      gl_FragColor = vec4( glowColor, a );
    }`
}

export default function (opts) {
  const material = new THREE.ShaderMaterial({
    uniforms:
    {
      "s": { type: "f", value: opts.s },
      "b": { type: "f", value: opts.b },
      "p": { type: "f", value: opts.p },
      glowColor: { type: "c", value: opts.glowColor }
    },
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  })
  return material;
}