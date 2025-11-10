document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // === Lenis Smooth Scroll ===
  const lenis = new Lenis({ anchors: { offset: -60 } });
  gsap.ticker.add(time => lenis.raf(time * 1000));

  // === Burger Menu ===
  function burgerNav() {
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burger-btn');
    const burgerMenuInner = document.querySelector('.burger-menu');

    const closeMenu = () => {
      burgerBtn.classList.remove('burger--open');
      document.documentElement.classList.remove('menu--open');
      lenis.start();
    };

    burgerBtn.addEventListener('click', () => {
      if (document.documentElement.classList.contains('menu--open')) {
        lenis.start();
        header.classList.add('out');
      } else {
        lenis.stop();
      }
      burgerBtn.classList.toggle('burger--open');
      document.documentElement.classList.toggle('menu--open');
      header.classList.toggle('show', document.documentElement.classList.contains('menu--open'));
    });

    window.addEventListener('keydown', e => { if (e.key === "Escape") closeMenu(); });
    document.addEventListener('click', e => {
      if (!burgerMenuInner.contains(e.target) && !burgerBtn.contains(e.target)) closeMenu();
    });
  }
  burgerNav();

  // === Header Scroll ===
  function headerFunc() {
    const header = document.getElementById('header');
    const firstSection = document.querySelector('section');
    const marker = 10;
    let lastScrollTop = 1;
    let ticking = false;

    const scrollHandler = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('out', scrollPos > lastScrollTop && scrollPos > marker);
      header.classList.toggle('show', scrollPos > firstSection.offsetHeight);
      lastScrollTop = scrollPos;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(scrollHandler); ticking = true; }
    });
  }
  headerFunc();

  // (function initParallax() {
  //   const layers = document.querySelectorAll('.mask');
  //   const maxShift = window.innerHeight * 0.2; // максимум 20% смещения
  //   const visibleLayers = new Set(); // какие уже видны
  //   let scrollY = 0;
  //   let currentY = 0;

  //   // Наблюдатель за появлением слоёв в зоне видимости
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         visibleLayers.add(entry.target);
  //         entry.target.style.opacity = entry.target.dataset.initialOpacity || 1;
  //       } else {
  //         visibleLayers.delete(entry.target);
  //         entry.target.style.opacity = 0;
  //       }
  //     });
  //   }, { threshold: 0 });

  //   layers.forEach(layer => {
  //     layer.dataset.initialOpacity = layer.style.opacity || 1;
  //     observer.observe(layer);
  //   });

  //   function animate() {
  //     // Инерционное приближение (ease-out)
  //     currentY += (scrollY - currentY) * 0.08;

  //     layers.forEach((layer, index) => {
  //       if (!visibleLayers.has(layer)) return; // двигаем только видимые

  //       const rect = layer.getBoundingClientRect();
  //       const screenH = window.innerHeight;

  //       // Прогресс прокрутки конкретного слоя (0 вверху, 1 внизу)
  //       const progress = Math.min(Math.max((screenH - rect.top) / (screenH * 2), 0), 1);

  //       // Разная "глубина" для каждого слоя
  //       // const depth = 0.2 - index * 0.05; // 0.2, 0.15, 0.1 ...
  //       const depth = 0.2; // 0.2, 0.15, 0.1 ...
  //       const offset = Math.min(currentY * depth * progress, maxShift);

  //       layer.style.transform = `translateY(${offset}px)`;
  //     });

  //     requestAnimationFrame(animate);
  //   }

  //   window.addEventListener('scroll', () => {
  //     scrollY = window.scrollY;
  //   });

  //   animate();
  // })();

  (function () {
    const elements = document.querySelectorAll('[data-gradient-text]');
    if (!elements.length) return;

    const states = [];
    let animationFrame;
    let active = window.innerWidth > 834;

    function init() {
      cancelAnimationFrame(animationFrame);
      states.length = 0;

      if (!active) {
        elements.forEach(el => el.style.backgroundImage = '');
        return;
      }

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const textWidth = el.scrollWidth;

        const state = {
          el,
          offset: 0,        // текущее смещение фона
          speed: 0.5,       // скорость движения
          hover: false,
          targetX: 50,
          rect,
          textWidth
        };

        // Hover — плавная инверсия цветов через CSS-переменные
        el.addEventListener('mouseenter', () => {
          state.hover = true;
          el.style.setProperty('--color1', '#3C49C2');
          el.style.setProperty('--color2', '#AD32AE');
        });

        el.addEventListener('mouseleave', () => {
          state.hover = false;
          el.style.setProperty('--color1', '#AD32AE');
          el.style.setProperty('--color2', '#3C49C2');
        });

        // Реакция на курсор
        el.addEventListener('mousemove', e => {
          const relX = ((e.clientX - rect.left) / textWidth) * 100;
          state.targetX = Math.min(Math.max(relX, 0), 100);
        });

        states.push(state);
      });

      animate();
    }

    function animate() {
      states.forEach(s => {
        if (s.hover) {
          // при наведении градиент смещается к курсору
          s.el.style.backgroundPosition = `${100 - s.targetX}% 50%`;
        } else {
          // бесшовное движение справа налево
          s.offset += s.speed;
          if (s.offset <= -100) s.offset += 100; // зацикливаем без скачка
          s.el.style.backgroundPosition = `${s.offset}% 50%`;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('load', init);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newState = window.innerWidth > 834;
        if (newState !== active) {
          active = newState;
          init();
        } else {
          states.forEach(s => {
            s.rect = s.el.getBoundingClientRect();
            s.textWidth = s.el.scrollWidth;
          });
        }
      }, 200);
    });
  })();

  // === SVG Gradients Mouse ===
  // Массив градиентов с их матрицами
  const gradients = [
    { id: 'paint0_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint1_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint2_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint3_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint4_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint5_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint6_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint7_radial_265_2289', matrix: 'matrix(89.5206 423.09 -1475.06 1639.7 334.444 -317.709)' },
    { id: 'paint8_radial_265_2289', matrix: 'matrix(10.2496 67.819 -168.886 262.836 207.79 386.652)' },
    { id: 'paint9_radial_265_2289', matrix: 'matrix(8.73367 48.3895 -143.908 187.536 225.447 408.921)' },
    { id: 'paint10_radial_265_2289', matrix: 'matrix(11.0124 65.8181 -181.456 255.081 246.985 388.905)' },
    { id: 'paint11_radial_265_2289', matrix: 'matrix(8.99772 48.337 -148.259 187.332 269.923 408.961)' },
    { id: 'paint12_radial_265_2289', matrix: 'matrix(8.99772 48.337 -148.259 187.332 290.511 408.961)' },
    { id: 'paint13_radial_265_2289', matrix: 'matrix(10.6995 69.8199 -176.299 270.59 320.048 384.773)' },
    { id: 'paint14_radial_265_2289', matrix: 'matrix(8.74344 67.819 -144.069 262.836 350.431 386.652)' },
    { id: 'paint15_radial_265_2289', matrix: 'matrix(2.07338 66.924 -34.1639 259.367 369.095 387.66)' },
    { id: 'paint16_radial_265_2289', matrix: 'matrix(8.49894 48.4422 -140.04 187.74 378.885 408.882)' },
    { id: 'paint17_radial_265_2289', matrix: 'matrix(6.13216 47.3891 -101.042 183.658 398.671 409.655)' },
    { id: 'paint18_radial_265_2289', matrix: 'matrix(7.81432 48.337 -128.759 187.332 412.233 408.961)' },
    { id: 'paint19_radial_265_2289', matrix: 'matrix(2.07341 66.924 -34.1644 259.367 428.679 387.66)' },
    { id: 'paint20_radial_265_2289', matrix: 'matrix(7.73609 47.3891 -127.47 183.658 439.312 409.674)' },
    { id: 'paint21_radial_265_2289', matrix: 'matrix(8.66521 67.8716 -142.78 263.039 458.491 394.239)' },
    { id: 'paint22_radial_265_2289', matrix: 'matrix(8.68477 69.7672 -143.102 270.386 487.002 384.832)' },
    { id: 'paint23_radial_265_2289', matrix: 'matrix(5.87787 65.8181 -96.8518 255.081 505.838 388.905)' },
    { id: 'paint24_radial_265_2289', matrix: 'matrix(7.38402 47.1784 -121.669 182.842 520.988 410.187)' },
    { id: 'paint25_radial_265_2289', matrix: 'matrix(8.72389 70.8202 -143.747 274.467 539.606 383.666)' },
    { id: 'paint26_radial_265_2289', matrix: 'matrix(2.07338 66.924 -34.1639 259.367 559.083 387.66)' },
    { id: 'paint27_radial_265_2289', matrix: 'matrix(8.99774 48.337 -148.259 187.332 569.058 408.961)' }
  ];

  $('#hero').mousemove(function (e) {
    const mouseX = e.pageX - this.offsetLeft;
    const mouseY = e.pageY - this.offsetTop;

    const svgRoot = document.querySelector("#mysvg");
    const rect = svgRoot.getBoundingClientRect();
    const midx = rect.left + rect.width / 2;
    const midy = rect.top + rect.height / 2;

    const angleDeg = Math.atan2(midy - mouseY, midx - mouseX) * 180 / Math.PI;

    gradients.forEach(g => {
      $(`svg defs #${g.id}`).attr('gradientTransform', `rotate(${angleDeg}) ${g.matrix}`);
    });
  });

  // === Accordion ===
  function accordionFunc() {
    const accordions = document.querySelectorAll('.accordion');
    let activeAccordion = null;
    accordions.forEach(acc => acc.addEventListener('click', e => {
      e.stopPropagation();
      if (activeAccordion && activeAccordion !== acc) activeAccordion.classList.remove('accordion-active');
      acc.classList.toggle('accordion-active');
      activeAccordion = acc.classList.contains('accordion-active') ? acc : null;
    }));
    window.addEventListener('keydown', e => { if (e.key === "Escape" && activeAccordion) activeAccordion.classList.remove('accordion-active'); });
    document.addEventListener('click', e => { if (activeAccordion && !activeAccordion.contains(e.target)) activeAccordion.classList.remove('accordion-active'); activeAccordion = null; });
  }
  accordionFunc();

  // === Swiper Sliders ===
  const slidesConfig = [
    {
      selector: '.opinion__slider',
      options: {
        slidesPerGroup: 1,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: document.querySelectorAll('.opinion__slider .swiper-slide').length > 1,
        grabCursor: true,
        speed: 600,
        watchOverflow: true,
        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        passiveListeners: true,
        pagination: { el: ".opinion__slider .swiper-pagination", clickable: true },
        navigation: { prevEl: ".opinion-button-prev", nextEl: ".opinion-button-next" },
        breakpoints: { 835: { slidesPerView: 3, spaceBetween: 20, pagination: false } }
      }
    },
    {
      selector: '.personal__slider',
      options: {
        slidesPerGroup: 1,
        slidesPerView: 1,
        spaceBetween: 20,
        loop: document.querySelectorAll('.personal__slider .swiper-slide').length > 1,
        grabCursor: true,
        speed: 1000,
        effect: "creative",
        creativeEffect: { prev: { translate: ["-20%", 0, -1] }, next: { translate: ["20%", 0, 0] } },
        autoplay: { delay: 5000, disableOnInteraction: false },
        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        passiveListeners: true
      }
    },
    {
      selector: '.works__slider',
      options: {
        slidesPerGroup: 1,
        slidesPerView: 1,
        spaceBetween: 8,
        loop: document.querySelectorAll('.works__slider .swiper-slide').length > 1,
        grabCursor: true,
        speed: 600,
        watchOverflow: true,
        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        passiveListeners: true,
        pagination: { el: ".works__slider .swiper-pagination", clickable: true },
        navigation: { prevEl: ".works-button-prev", nextEl: ".works-button-next" },
        breakpoints: { 835: { slidesPerView: 3, spaceBetween: 20, pagination: false } }
      }
    }
  ];

  slidesConfig.forEach(cfg => {
    const el = document.querySelector(cfg.selector);
    if (el) new Swiper(cfg.selector, cfg.options);
  });

  // === GSAP Animations ===
  function scrollTriggerPlayer(triggerElement, timeline, onEnterStart = "top 95%") {
    if (!triggerElement) return;
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => { timeline.progress(1); timeline.pause(); }
    });
    ScrollTrigger.create({
      trigger: triggerElement,
      start: onEnterStart,
      scrub: true,
      onEnter: () => timeline.play()
    });
  }

  // fadeUp
  document.querySelectorAll('[data-transform="fadeUp"]').forEach(el => {
    const tl = gsap.timeline({ paused: true });
    tl.from(el, { opacity: 0, y: 100, duration: 0.5, ease: "ease", stagger: { amount: 0.3 } });
    scrollTriggerPlayer(el, tl);
  });

  // textBlur
  document.querySelectorAll('[data-blur="textBlur"]').forEach(el => {
    const tl = gsap.timeline({ paused: true });
    tl.from(el, {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power4.out",
      onUpdate: function () {
        this.targets().forEach(t => t.style.filter = `blur(${Math.abs(this.progress() - 1) * 10}px)`);
      }
    });
    scrollTriggerPlayer(el, tl);
  });

  // titleFadeUp
  document.querySelectorAll('[data-transform="titleFadeUp"]').forEach(parent => {
    const title = parent.querySelector('[data-gradient-text]');
    if (!title) return;
    const tl = gsap.timeline({ paused: true });
    tl.from(title, { opacity: 0, y: 100, duration: 0.5, ease: "ease", stagger: { amount: 0.3 } });
    scrollTriggerPlayer(title, tl, onEnterStart = "top 100%");
  });

  // fadeUpStaggerParent
  document.querySelectorAll('[data-transform="fadeUpStaggerParent"]').forEach(parent => {
    const items = parent.querySelectorAll('[data-transform="fadeUpStagger"]');
    if (!items.length) return;
    gsap.to(items, { scrollTrigger: { trigger: parent, start: "top 90%" }, opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
  });

  // fadeRightStaggerParent
  document.querySelectorAll('[data-transform="fadeRightStaggerParent"]').forEach(parent => {
    const items = parent.querySelectorAll('[data-transform="fadeRightStagger"]');
    if (!items.length) return;

    // Инициализация начального состояния
    gsap.set(items, { opacity: 0, x: 50, willChange: "opacity, transform" });

    // Один ScrollTrigger на весь контейнер
    gsap.to(items, {
      scrollTrigger: {
        trigger: parent,
        start: "top 90%",
        once: true,          // проиграть анимацию только один раз
      },
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
  });

  const parallaxImgContainers = document.querySelectorAll('[data-animation="parallax-img"]');
  if (parallaxImgContainers.length > 0) {
    parallaxImgContainers.forEach(parallaxImgContainer => {
      const image = parallaxImgContainer.querySelector('img');
      gsap.fromTo(image,
        {
          y: '-10%',
        },
        {
          y: '10%',
          scrollTrigger: {
            trigger: image,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  const fadeItems = document.querySelectorAll('[data-transform="fade"]');
  fadeItems.forEach(fadeItem => {
    const tl = gsap.timeline({
      paused: true
    });

    tl.from(fadeItem, {
      opacity: 0,
      y: "100",
      duration: .8,
      delay: .3,
      ease: "ease",
      stagger: {
        amount: .8
      }
    });
    scrollTriggerPlayer(fadeItem, tl)
  });

  const parallaxImgScaleContainers = document.querySelectorAll('[data-animation="parallax-img-scale"]');
  if (parallaxImgScaleContainers.length > 0) {
    parallaxImgScaleContainers.forEach(parallaxImgScaleContainer => {
      const image = parallaxImgScaleContainer.querySelector('img');
      gsap.fromTo(image,
        {
          scale: '0.8',
        },
        {
          scale: '1',
          scrollTrigger: {
            trigger: parallaxImgScaleContainer,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  // hero__cover
  const heroCover = document.querySelector('.hero__cover');
  if (heroCover) {
    const tl = gsap.timeline({ paused: true });
    tl.from(heroCover, { opacity: 0, y: 100, duration: 1, ease: "ease", stagger: { amount: 0.3 } });
    scrollTriggerPlayer(heroCover, tl);
  }

  // hero__logo
  const heroLogo = document.querySelector('.hero__logo');
  if (heroLogo) {
    const tl = gsap.timeline({ paused: true });
    tl.from(heroLogo, {
      opacity: 0, filter: "blur(10px)", duration: 1, ease: "power4.out",
      onUpdate: function () { this.targets().forEach(t => t.style.filter = `blur(${Math.abs(this.progress() - 1) * 10}px)`); }
    });
    scrollTriggerPlayer(heroLogo, tl);
  }

  // === Parallax Boxes ===
  // document.querySelectorAll('[data-animation="parallax-box"]').forEach(box => {
  //   gsap.fromTo(box, { y: '10%' },
  //     { y: '-10%', scrollTrigger: { trigger: box, start: 'top 90%', end: 'bottom top', scrub: true } });
  // });

  // === Form Input Handling ===
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.toggle('filled', input.value.trim() !== ''));
  });

  // === Fancybox ===
  Fancybox.bind('[data-fancybox]', { Html: { autoSize: false }, on: { 'Carousel.ready': () => lenis.stop(), destroy: () => lenis.start() } });

});
