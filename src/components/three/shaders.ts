/** GLSL for the 3D carousel: the world behind each portal and the glow around each card. */

const noise = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec2(13.1, 7.7);
      a *= 0.5;
    }
    return v;
  }
`;

const output = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

export const passUv = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Backdrop inside a portal: domain-warped noise between the theme's base colour
 * and the section tint. Hover pushes the warp, pulls it towards the pointer and
 * sends rings out from it.
 */
export const worldFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform vec3 uBase;
  uniform vec3 uTint;
  varying vec3 vPos;
  ${noise}
  void main() {
    vec2 p = vPos.xy * 0.22;
    vec2 pointer = (uPointer - 0.5) * 3.0;
    float t = uTime * 0.07;
    float warp = 1.6 + 2.6 * uHover;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + warp * q + vec2(1.7, 9.2) + pointer * 0.25 * uHover), fbm(p + warp * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + 2.4 * r);
    float d = length(vPos.xy * 0.2 - pointer * 0.35);
    float rings = sin(d * 14.0 - uTime * 3.0) * exp(-d * 1.6) * uHover;
    float amount = smoothstep(0.25, 0.95, f + rings * 0.12) * (0.42 + 0.33 * uHover);
    vec3 color = mix(uBase, uTint, amount);
    color += uTint * 0.05 * rings;
    gl_FragColor = vec4(color, 1.0);
    ${output}
  }
`;

/**
 * Card outline and glow, drawn on a plane a little larger than the card. The
 * outline is always there; on hover a noisy band of light runs around it.
 */
export const haloFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform float uActive;
  uniform vec3 uColor;
  uniform vec2 uSize;
  uniform vec2 uCard;
  uniform float uRadius;
  varying vec2 vUv;
  ${noise}
  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uCard * 0.5, uRadius);
    float line = 1.0 - smoothstep(0.0, 0.014, abs(d));
    float outside = step(0.0, d);
    float angle = atan(p.y, p.x);
    float flow = 0.5 + 0.5 * sin(angle * 2.0 - uTime * 2.2 + fbm(p * 2.5 + uTime * 0.4) * 5.0);
    // Fades to nothing before the edge of the plane, so the glow never shows a square cut.
    float reach = min(uSize.x - uCard.x, uSize.y - uCard.y) * 0.5;
    float glow = exp(-d * mix(16.0, 7.0, uHover)) * outside * (1.0 - smoothstep(reach * 0.45, reach * 0.95, d));
    float alpha = line * (0.22 + 0.5 * uActive + 0.28 * uHover) + glow * (0.1 * uActive + 0.55 * uHover * flow);
    gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
    ${output}
  }
`;
