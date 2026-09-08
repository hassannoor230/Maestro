import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const fadeInUp = (
  targets: string | Element | NodeListOf<Element>,
  options?: { delay?: number; duration?: number; stagger?: number; y?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.from(targets, {
    opacity: 0,
    y: options?.y ?? 60,
    duration: options?.duration ?? 1,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0,
    ease: 'power3.out',
  });
};

export const fadeInDown = (
  targets: string | Element | NodeListOf<Element>,
  options?: { delay?: number; duration?: number; stagger?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.from(targets, {
    opacity: 0,
    y: -40,
    duration: options?.duration ?? 0.8,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0,
    ease: 'power3.out',
  });
};

export const scaleIn = (
  targets: string | Element | NodeListOf<Element>,
  options?: { delay?: number; duration?: number; stagger?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, scale: 1 });
    return;
  }

  gsap.from(targets, {
    opacity: 0,
    scale: 0.8,
    duration: options?.duration ?? 0.8,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0,
    ease: 'back.out(1.7)',
  });
};

export const staggerReveal = (
  targets: string,
  options?: { stagger?: number; y?: number; duration?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.from(targets, {
    opacity: 0,
    y: options?.y ?? 40,
    duration: options?.duration ?? 0.8,
    stagger: options?.stagger ?? 0.15,
    ease: 'power2.out',
  });
};

export const parallaxHero = (containerRef: React.RefObject<HTMLElement>, yPercent = 30) => {
  if (prefersReducedMotion() || !containerRef.current) return;

  gsap.to(containerRef.current, {
    y: -yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
};

export const scrollReveal = (
  targets: string,
  options?: { y?: number; x?: number; scale?: number; duration?: number; stagger?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, x: 0, scale: 1 });
    return;
  }

  const elements = document.querySelectorAll(targets);
  gsap.from(elements, {
    opacity: 0,
    y: options?.y ?? 50,
    x: options?.x ?? 0,
    scale: options?.scale ?? 1,
    duration: options?.duration ?? 0.8,
    stagger: options?.stagger ?? 0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: elements,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
};

export const floatingAnimation = (target: string | Element) => {
  if (prefersReducedMotion() || !target) return;

  gsap.to(target, {
    y: -15,
    rotation: 2,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

export const pulseGlow = (target: string | Element, color = '#D4AF37') => {
  if (prefersReducedMotion() || !target) return;

  gsap.to(target, {
    boxShadow: `0 0 25px ${color}, 0 0 40px ${color}`,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

export const staggerChildren = (
  targets: string,
  options?: { stagger?: number; delay?: number }
) => {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.from(targets, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: targets,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
};
