import { onDestroy } from "svelte";

export default function addIntersectionListener(
  target: HTMLElement,
  onIntersect: (observer: IntersectionObserver) => void,
) {
  if (typeof IntersectionObserver === "undefined") {
    return;
  }
  if (!target) {
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    const intersecting = entries[0]?.isIntersecting ?? false;
    if (intersecting) {
      onIntersect(observer);
    }
  });
  observer.observe(target);
  onDestroy(() => observer.disconnect());
}
