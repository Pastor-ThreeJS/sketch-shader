import * as THREE from 'three';
const Shader = {
    vertexShader: `
    varying vec2 vUv;
    attribute float percent;
    uniform float u_time;
    uniform float number;
    uniform float speed;
    uniform float length;
    varying float opacity;
    uniform float size;
    void main()
    {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        float l = clamp(1.0-length,0.0,1.0);
        gl_PointSize = clamp(fract(percent*number + l - u_time*number*speed)-l ,0.0,1.) * size * (1./length);
        opacity = gl_PointSize/size;
        gl_Position = projectionMatrix * mvPosition;
    }
        `,
    fragmentShader: `
    varying float opacity;
    uniform vec3 color;
    void main(){
        if(opacity <=0.2){
            discard;
        }
        gl_FragColor = vec4(color,1.0);
    }
    `
}

export default function (option) {

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        uniforms:
        {
            "u_time": {
                value: 0
            },
            "number": {
                value: option.number
            },
            "speed": {
                value: option.speed
            },
            "length": {
                value: option.length
            },
            "size": {
                value: option.size
            },
            "color": {
                value: new THREE.Color(option.color)
            },
        },
        vertexShader: Shader.vertexShader,
        fragmentShader: Shader.fragmentShader,
    });
    return material;
}