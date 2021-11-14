import * as THREE from 'three';
const Shader = {
    vertexShader: `
    attribute float index;
        attribute float current;
        uniform float u_speed;
        uniform float time;
        uniform float uSize;
        uniform float uRange; // 展示区间
        uniform float uTotal; // 粒子总数
        uniform vec3 uColor; 
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time*u_speed, 1.1);
            if (showNumber > current && showNumber < current + uRange) {
                float uIndex = ((current + uRange) - showNumber) / uRange;
                size *= uIndex;
                vOpacity = 1.0;
            } else {
                vOpacity = 0.0;
            }

            // 顶点着色器计算后的Position
            vColor = uColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition; 
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
        }
        `,
    fragmentShader: `
    varying vec3 vColor; 
    varying float vOpacity;
    void main() {
        gl_FragColor = vec4(vColor, vOpacity);
    }
    `
}

export default function (option) {

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uColor: {
                value: new THREE.Color(option.color) // 颜色
            },
            uRange: {
                value: option.range || 100 // 显示当前范围的个数
            },
            uSize: {
                value: option.size // 粒子大小
            },
            uTotal: {
                value: option.number // 当前粒子的所有的总数
            },
            time: {
                value: 0 // 
            },
            u_speed: {
                value: option.speed
            }
        },
        vertexShader: Shader.vertexShader,
        fragmentShader: Shader.fragmentShader,
    });
    return material;
}