import * as THREE from 'three';

const Shader = {
  vertexShader: `
  void main() {
    gl_Position = vec4( position, 1.0 );
  } 
    `,
  fragmentShader: `
  #ifdef GL_ES
    precision mediump float;
    #endif
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;


    float box0(vec2 st){
      float left = 0.0;
      float right = 0.4;
      float top = 0.6;
      float bottom = 0.2;
      if(st.x > left && st.x < right && st.y > bottom && st.y < top){
        return 1.0;
      }else{
        return 0.0;
      } 
    }

    float box1(vec2 st){

      float left = 0.0;
      float right = 0.4;
      float top = 0.6;
      float bottom = 0.2;

      //左右边界
      float x1 = step(left,st.x);
      float x2 = step(right,1.0-st.x); //检测值要小于右边界才应该返回1.0，所以使用1.0-st.x
      
      //上下边界
      float y1 = step(bottom,st.y);
      float y2 = step(top,1.0-st.y);//检测值要小于上边界才应该返回1.0，所以使用1.0-st.y

      float pct = x1 * x2 *y1 *y2;
      return pct;
    }

    float box2(vec2 st){

      float left = 0.0;
      float right = 0.4;
      float top = 0.6;
      float bottom = 0.2;

      //左下边界
      vec2 bl = step(vec2(left,bottom),st);
      float pct = bl.x * bl.y;
  

      //右上边界
      vec2 tr = step(vec2(right,top),1.0-st);//检测值要小于右上边界才应该返回1.0，所以使用1.0-st
      pct *= tr.x * tr.y;

      return pct;
    }

    float box3(vec2 st){

      float right = 0.9;
      float top = 0.3;

      //通过右上角绘制原点对称的四边形
      vec2 bl = 1.0-step(vec2(right,top),abs(st));
      float pct = bl.x * bl.y;

      return pct;
    }

    float box4(vec2 st){

      float right = 0.9;
      float top = 0.3;
      float line_width = 0.03;

      //通过右上角绘制原点对称的四边形
      vec2 b1 = 1.0-step(vec2(right,top),abs(st));

      float boxouter = b1.x * b1.y;

      vec2 b2 = 1.0-step(vec2(right-line_width,top-line_width),abs(st));
      float boxinner = b2.x * b2.y;

      float pct = boxouter -boxinner;

      return pct;
    }

    float circle(vec2 st,vec2 center,float radius) { 
      float blur = 0.002;

      //float pct = distance(st,center);//计算任意点到圆心的距离

      vec2 tC = st-center; //计算圆心到任意点的向量
      //float pct = length(tC);//使用length函数求出长度
      float pct = sqrt(tC.x*tC.x+tC.y*tC.y);//使用开平方的方法求出长度

      return 1.0-smoothstep(radius,radius+blur,pct);
    }    

    float circleLine(vec2 st,vec2 center,float radius) { 
      float pct = distance(st,center);//计算任意点到圆心的距离
      float line_width = 0.02;
      float radius2 = radius-line_width;
      float blur = 0.002;
      return (1.0-smoothstep(radius-blur,radius+blur,pct))-(1.0-smoothstep(radius2-blur,radius2+blur,pct));
    }

    void main( void ) {

      //窗口坐标调整为[-1,1],坐标原点在屏幕中心
      vec2 st = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;

      //窗口坐标调整为[0,1],坐标原点在屏幕左下角
      //vec2 st = gl_FragCoord.xy/u_resolution;

      vec3 line_color = vec3(1.0,1.0,0.0);
      vec3 color = vec3(0,0,0);//背景色
      float pct = 0.0;

      pct = box0(st);
      pct = box1(st);
      pct = box2(st);
      pct = box3(st);
      pct = box4(st);
      //color = mix(color,line_color,pct);
      //pct = circle(st,vec2(-0.3),0.4);
      //color = mix(color,line_color,pct);
      pct = circleLine(st,vec2(0.3),0.4);
      color = mix(color,line_color,pct);

      gl_FragColor = vec4(color, 1);
    }
    `
}

export default function (opts) {
  const material = new THREE.ShaderMaterial({
    uniforms:
    {
      u_time: {
        type: "f",
        value: 1.0
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2()
      },
      u_mouse: {
        type: "v2",
        value: new THREE.Vector2()
      }
    },
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  })
  return material;
}