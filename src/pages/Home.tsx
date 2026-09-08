import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { getSettings, getReviews } from '../lib/api';
import foodImages from '../lib/images';
import { scrollReveal, parallaxHero, floatingAnimation, pulseGlow } from '../lib/gsapUtils';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const homeRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSettings().then(r => setSettings(r.data)).catch(() => {});
    getReviews().then(r => setReviews(r.data)).catch(() => {});

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.hero-badge, .hero-title-line-1, .hero-title-line-2, .hero-subtitle, .hero-cta-group > *, .hero-image-wrapper, .stat-card, .experience-item', { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo('.hero-badge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
        .fromTo('.hero-title-line-1', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
        .fromTo('.hero-title-line-2', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5)
        .fromTo('.hero-subtitle', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7)
        .fromTo('.hero-cta-group > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, ease: 'power3.out' }, 0.9)
        .fromTo('.hero-image-wrapper', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, 0.6)
        .fromTo('.stat-card', { 
          opacity: 0, y: 30 
        }, { 
          opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
          onComplete: () => {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card) => {
              floatingAnimation(card);
            });
            const goldStat = document.querySelector('.stat-card .stat-num');
            if (goldStat) {
              pulseGlow(goldStat);
            }
          }
        }, 0.3)
        .fromTo('.experience-item', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, 0.2);

      ScrollTrigger.refresh();
    }, homeRef.current);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (heroRef.current) parallaxHero(heroRef);
    if (heroOverlayRef.current) {
      floatingAnimation(heroOverlayRef.current);
    }
    if (heroImageRef.current) {
      floatingAnimation(heroImageRef.current);
    }
  }, []);

  useEffect(() => {
    scrollReveal('.food-gallery-item', { stagger: 0.1, y: 30 });
  }, []);

  const stats = [
    { num: '12+', label: 'YEARS', icon: '👑' },
    { num: '1,319+', label: 'REVIEWS', icon: '⭐' },
    { num: '4.2★', label: 'RATING', icon: '💎' },
    { num: '10K+', label: 'COMMUNITY', icon: '🌟' },
  ];

  const experiences = [
    { num: '01', title: 'ATMOSPHERE', desc: 'Elegant surroundings designed for memorable evenings.', icon: '✨' },
    { num: '02', title: 'CUISINE', desc: 'Carefully crafted dishes with bold flavours.', icon: '🍽️' },
    { num: '03', title: 'HOSPITALITY', desc: 'Warm service with attention to every detail.', icon: '🤝' },
    { num: '04', title: 'MOMENTS', desc: 'A place where meals become memories.', icon: '💫' },
  ];

  const galleryImages = [
    { src: foodImages.fries, alt: 'Signature fries' },
    { src: foodImages.chicken, alt: 'Maestro chicken dish' },
    { src: foodImages.coffee, alt: 'Freshly brewed coffee' },
    { src: foodImages.dessert, alt: 'Maestro dessert' },
  ];

  return (
    <div ref={homeRef}>
      {/* VIP Particles Background */}
      <div className="vip-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="vip-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-champagne/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/3 rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pb-20">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <p className="hero-badge text-gold tracking-[0.3em] text-xs uppercase">
              Est. {settings?.years || 12}+ Years of Excellence
            </p>
            <h1 className="hero-title-line-1 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
              BRINGING CLASS
            </h1>
            <h1 className="hero-title-line-2 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95]">
              <span className="gold-gradient">TO THE CUISINE.</span>
            </h1>
            <p className="hero-subtitle text-muted text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              A signature dining experience crafted in the heart of Gujranwala. Exceptional cuisine, elegant surroundings, genuine hospitality.
            </p>
            <div className="hero-cta-group flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/menu"
                className="btn-gold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm tracking-widest hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300 text-center"
              >
                EXPLORE MENU
              </Link>
              <Link
                to="/reservation"
                className="btn-outline px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm tracking-widest hover:bg-gold/10 transition-all duration-300 text-center"
              >
                RESERVE YOUR TABLE
              </Link>
            </div>
          </div>

          <div ref={heroImageRef} className="hero-image-wrapper relative mt-8 lg:mt-0">
            <div className="rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10">
              <img
                src={foodImages.restaurant}
                alt="Maestro Cafe dining room"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div ref={heroOverlayRef} className="absolute -left-2 sm:left-0 top-10 glass rounded-xl px-3 sm:px-4 py-2 sm:py-3 hidden sm:block">
              <div className="stat-num font-serif text-xl sm:text-2xl text-gold">{settings?.years || 12}+</div>
              <div className="text-xs text-muted">Years</div>
            </div>
            <div className="absolute -right-2 sm:right-0 top-28 glass rounded-xl px-3 sm:px-4 py-2 sm:py-3 hidden sm:block">
              <div className="font-serif text-xl sm:text-2xl text-gold">{settings?.rating || '4.2'}★</div>
              <div className="text-xs text-muted">{settings?.reviewsCount || '1,319+'} Reviews</div>
            </div>
            <div className="absolute left-6 sm:left-6 -bottom-4 glass rounded-xl px-3 sm:px-4 py-2 sm:py-3 hidden md:block">
              <div className="font-serif text-lg sm:text-xl text-gold">{settings?.priceRange || 'PKR 2–3K'}</div>
              <div className="text-xs text-muted">Per Person</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <h2 className="font-serif text-4xl sm:text-5xl mb-6">
            {settings?.years || 12}+ YEARS OF<br />
            <span className="gold-gradient">CRAFTING EXPERIENCES</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-12">
            {settings?.heroDescription || 'Where exceptional cuisine, elegant surroundings and genuine hospitality come together.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card glass rounded-2xl p-6 hover-lift">
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <div className="font-serif text-4xl text-gold">{stat.num}</div>
                <div className="text-muted text-sm mt-1 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="experience-section py-20 bg-secondary/40 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3">The Experience</p>
            <h2 className="font-serif text-4xl sm:text-5xl">MORE THAN A MEAL</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((e) => (
              <div key={e.num} className="experience-item glass rounded-2xl p-8 space-y-4 hover-lift">
                <div className="flex items-center justify-between">
                  <span className="text-gold text-sm tracking-widest">{e.num}</span>
                  <span className="text-2xl">{e.icon}</span>
                </div>
                <h3 className="font-serif text-2xl">{e.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className="food-gallery-item relative overflow-hidden rounded-2xl border border-gold/10 group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-44 md:h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-gold text-sm">View Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="signature-section py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div ref={heroOverlayRef} className="rounded-2xl overflow-hidden border border-gold/20 bg-surface aspect-square relative group">
            <img
              src={foodImages.chicken}
              alt="Polo Stuffed Chicken"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-gold text-sm tracking-widest">SIGNATURE DISH</span>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-gold tracking-[0.3em] text-xs uppercase">Signature</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
              THE SIGNATURE<br />
              POLO STUFFED CHICKEN
            </h2>
            <p className="text-muted leading-relaxed">
              Fried chicken breast stuffed with spinach & cheese. Served with mashed potatoes & sautéed vegetables. A masterpiece of flavour and presentation.
            </p>
            <div className="flex items-center gap-4">
              <span className="font-serif text-3xl text-gold">PKR 1,490</span>
              <Link
                to="/menu"
                className="btn-outline px-8 py-3 rounded-full text-sm tracking-widest hover:bg-gold/10 transition-all duration-300"
              >
                DISCOVER DISH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-champagne/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3">Testimonials</p>
            <h2 className="font-serif text-4xl sm:text-5xl">HEARD AT MAESTRO</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(reviews.length ? reviews : [
              { name: 'Hamza Jawed', rating: 5, text: 'Maestro Café – A Trusted Favorite for 12 Years! Cozy atmosphere and friendly staff.' },
              { name: 'Happy Guest', rating: 5, text: 'Best in taste. Maestro never disappoint!' },
              { name: 'Local Foodie', rating: 5, text: 'The Polo Stuffed Chicken is exceptional.' },
            ]).map((r: any, i: number) => (
              <div key={i} className="review-card glass rounded-2xl p-8 space-y-4 hover-lift">
                <div className="flex items-center gap-1 text-gold text-lg">{'★'.repeat(r.rating || 5)}</div>
                <p className="text-champagne/90 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    {r.name.charAt(0)}
                  </div>
                  <div className="text-muted text-sm">— {r.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent" />
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6 relative z-10">
          <h2 className="font-serif text-4xl sm:text-5xl">YOUR TABLE AWAITS.</h2>
          <p className="text-muted">Reserve your experience at Maestro Cafe today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/reservation"
              className="btn-gold px-10 py-4 rounded-full text-sm tracking-widest hover:shadow-2xl hover:shadow-gold/30 transition-all duration-300"
            >
              RESERVE NOW
            </Link>
            <Link
              to="/menu"
              className="btn-outline px-10 py-4 rounded-full text-sm tracking-widest hover:bg-gold/10 transition-all duration-300"
            >
              VIEW MENU
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
