import * as THREE from 'three';

const Shader = {
    vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    varying vec2 vUv;
    void main() 
    {
      vUv = uv;
      vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
      vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    uniform sampler2D map;
    uniform vec3 uColor;
    uniform float time;
    uniform float repeatX;
    uniform float speed;
    varying vec2 vUv;
    void main()
    {
        vec4 finalcolor= texture2D(map, vec2(vUv.x * repeatX , vUv.y));
        float left=texture2D(map, vec2(vUv.x+0.0001, vUv.y)).a;
        float right=texture2D(map, vec2(vUv.x-0.0001, vUv.y)).a;
        float top=texture2D(map, vec2(vUv.x,vUv.y+0.0001)).a;
        float bottom=texture2D(map, vec2(vUv.x,vUv.y-0.0001)).a;
        float result=left+right+top+bottom;
        result = result*(1.0-finalcolor.a);
        vec4 colorr = vec4((sin(time)*uColor.x),(cos(time)*uColor.y),(tan(time)*uColor.z),1.0)*result;
        gl_FragColor = finalcolor+colorr;
    }
    `
}

export default function (opts) {
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            repeatX: {
                value: opts.repeatX
            },
            speed: {
                value: opts.speed
            },
            time: {
                value: 0
            },
            map: {
                value: opts.map
            },
            uColor: {
                value: new THREE.Color(opts.color)
            },
        },
        vertexShader: Shader.vertexShader,
        fragmentShader: Shader.fragmentShader,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    })
    return material;
}