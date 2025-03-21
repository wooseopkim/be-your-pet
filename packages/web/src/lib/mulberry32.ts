export default function mulberry32(a: number) {
  let b = a;
  return () => {
    b += 0x6d2b79f5;
    let t = b;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
