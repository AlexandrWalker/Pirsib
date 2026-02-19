document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /**
   * Lenis Smooth Scroll
   */
  const lenis = new Lenis({
    anchors: false
  })

  gsap.ticker.add(time => {
    lenis.raf(time * 1000)
  })

  // прокрутка к якорю после загрузки
  window.addEventListener('load', () => {
    const hash = window.location.hash
    if (!hash) return

    const target = document.querySelector(hash)
    if (!target) return

    // небольшая задержка, чтобы Lenis и layout гарантированно инициализировались
    setTimeout(() => {
      lenis.scrollTo(target, {
        offset: -60,
        immediate: false
      })
    }, 50)
  })


  /**
   * Burger Menu
   */
  function burgerNav() {
    const header = document.getElementById('header');

    /* new */
    const firstSection = document.querySelector('section');
    let scrollPos = 0;
    /* /new */

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
        // header.classList.add('out');

        /* new */
        scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPos > firstSection.offsetHeight) {
          header.classList.add('out');
        }
        /* /new */

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

  /**
   * Header Scroll
   */
  function headerFunc() {
    const header = document.getElementById('header');
    const firstSection = document.querySelector('section');
    const html = document.documentElement;

    if (!header || !firstSection) return;

    const marker = 10;
    let lastScrollTop = 0;
    let ticking = false;
    let isOut = false; // состояние класса .out

    const scrollHandler = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = scrollPos > lastScrollTop && scrollPos > marker;
      const scrollingUp = scrollPos < lastScrollTop;
      const menuOpen = html.classList.contains('menu--open');

      // Добавляем .out только один раз при начале скролла вниз
      if (scrollingDown && !isOut) {
        header.classList.add('out');
        document.documentElement.classList.add('out');
        isOut = true;
      }

      // Убираем .out только один раз при начале скролла вверх
      if (scrollingUp && isOut || scrollPos < firstSection.offsetHeight) {
        header.classList.remove('out');
        document.documentElement.classList.remove('out');
        isOut = false;
      }

      // Управление классом .show по высоте первой секции
      header.classList.toggle('show', scrollPos > firstSection.offsetHeight);

      lastScrollTop = scrollPos <= 0 ? 0 : scrollPos;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(scrollHandler);
        ticking = true;
      }
    });
  }

  headerFunc();

  function stickyReveal() {
    const items = Array.from(document.querySelectorAll('.sticky__item'));

    const removeOffset = 31; // удаляем класс, если элемент ушёл ниже 50px

    let ticking = false;

    const checkItems = () => {
      items.forEach((item, index) => {
        // Пропускаем последний элемент
        if (index === items.length - 1) return;

        const rect = item.getBoundingClientRect();
        const top = rect.top;
        const isActive = item.classList.contains('sticky__item-active');

        // Добавляем класс, когда верх элемента коснулся верхней границы окна
        if (!isActive && top <= 0) {
          item.classList.add('sticky__item-active');
        }

        // Убираем класс, если элемент ушёл ниже removeOffset
        if (isActive && top > removeOffset) {
          item.classList.remove('sticky__item-active');
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkItems);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkItems);

    // Проверка при загрузке страницы
    checkItems();
  }

  stickyReveal();

  /**
   * Анимация градиента заголовоков и наведения
   */
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

  /**
   * SVG Gradients Mouse
   */
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

  /**
   * Accordion
   */
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

  /**
   * Swiper Sliders
   */
  const slidesConfig = [
    {
      selector: '.catalog__slider',
      options: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        centeredSlides: false,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        loop: false,
        simulateTouch: true,
        grabCursor: true,
        speed: 600,
        watchOverflow: true,

        direction: 'horizontal',
        touchStartPreventDefault: true,
        touchMoveStopPropagation: true,
        threshold: 8,
        touchAngle: 25,

        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        freeMode: { enabled: false, momentum: false, momentumBounce: false, sticky: true },
        pagination: { el: ".catalog__slider .swiper-pagination", clickable: true },
        navigation: { prevEl: ".catalog-button-prev", nextEl: ".catalog-button-next" },
        breakpoints: { 835: { slidesPerView: 3, spaceBetween: 20, pagination: false } },
      }
    },
    {
      selector: '.opinion__slider',
      options: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        centeredSlides: false,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        loop: false,
        simulateTouch: true,
        grabCursor: true,
        speed: 600,
        watchOverflow: true,

        direction: 'horizontal',
        touchStartPreventDefault: true,
        touchMoveStopPropagation: true,
        threshold: 8,
        touchAngle: 25,

        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        freeMode: { enabled: false, momentum: false, momentumBounce: false, sticky: true },
        pagination: { el: ".opinion__slider .swiper-pagination", clickable: true },
        navigation: { prevEl: ".opinion-button-prev", nextEl: ".opinion-button-next" },
        breakpoints: { 835: { slidesPerView: 3, spaceBetween: 20, pagination: false } },
      }
    },
    {
      selector: '.personal__slider',
      options: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        grabCursor: true,
        speed: 1000,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        // effect: "creative",
        // creativeEffect: { prev: { translate: ["-20%", 0, -1] }, next: { translate: ["20%", 0, 0] } },
        autoplay: { delay: 5000, disableOnInteraction: false },
        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        centeredSlides: false,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        loop: false,
        simulateTouch: true,
        freeMode: { enabled: false, momentum: false, momentumBounce: false, sticky: true },
        navigation: { prevEl: ".personal-button-prev", nextEl: ".personal-button-next" },

        direction: 'horizontal',
        touchStartPreventDefault: true,
        touchMoveStopPropagation: true,
        threshold: 8,
        touchAngle: 25,
      }
    },
    {
      selector: '.works__slider',
      options: {
        slidesPerView: 1.1,
        slidesPerGroup: 1,
        spaceBetween: 8,
        grabCursor: true,
        speed: 600,
        watchOverflow: true,
        mousewheel: { forceToAxis: true, sensitivity: 1, releaseOnEdges: true },
        pagination: { el: ".works__slider .swiper-pagination", clickable: true },
        navigation: { prevEl: ".works-button-prev", nextEl: ".works-button-next" },
        breakpoints: { 835: { slidesPerView: 3, spaceBetween: 20, pagination: false } },
        centeredSlides: false,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        loop: false,
        simulateTouch: true,
        freeMode: { enabled: false, momentum: false, momentumBounce: false, sticky: true },

        direction: 'horizontal',
        touchStartPreventDefault: true,
        touchMoveStopPropagation: true,
        threshold: 8,
        touchAngle: 25,
      }
    }
  ];

  slidesConfig.forEach(cfg => {
    const container = document.querySelector(cfg.selector);
    if (!container) return;

    const swiper = new Swiper(cfg.selector, cfg.options);
    initTempoNavigation(swiper);
  });

  function initTempoNavigation(swiper) {
    let slideQueue = 0;
    let lastNav = null;
    const clickTimes = [];
    const WINDOW_MS = 800;

    function recordAndDecide() {
      const now = Date.now();
      while (clickTimes.length && now - clickTimes[0] > WINDOW_MS) clickTimes.shift();
      clickTimes.push(now);
      const clicks = clickTimes.length;
      if (clicks >= 5) return { slides: Math.min(4, clicks - 1), speed: 180 };
      if (clicks >= 3) return { slides: 2, speed: 260 };
      if (clicks === 2) return { slides: 1, speed: 340 };
      return { slides: 1, speed: 200 };
    }

    function processQueue() {
      if (!lastNav || slideQueue <= 0) return;
      slideQueue = Math.max(0, slideQueue - 1);
      const { dir, speed } = lastNav;
      dir === 'next' ? swiper.slideNext(speed) : swiper.slidePrev(speed);
    }

    function navHandler(dir) {
      const { slides, speed } = recordAndDecide();
      lastNav = { dir, speed };
      slideQueue += slides;
      processQueue();
    }

    const nextBtn = document.querySelector('.swiper-button-next');
    const prevBtn = document.querySelector('.swiper-button-prev');

    if (nextBtn) nextBtn.addEventListener('click', () => navHandler('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => navHandler('prev'));
  }

  // ==== Общие настройки ====
  gsap.defaults({ ease: "power2.out" });

  // ==== Универсальный FadeUp ====
  document.querySelectorAll('[data-transform="fadeUp"], [data-transform="fadeUp1x"]').forEach(el => {
    const duration = el.dataset.transform === "fadeUp1x" ? 1 : 0.7;
    gsap.from(el, {
      opacity: 0,
      y: 100,
      duration,
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        toggleActions: "play none none none", // play один раз, не повторять
        once: true
      },
      willChange: "opacity, transform"
    });
  });

  // ==== Title Fade ====
  document.querySelectorAll('[data-transform="titleFadeUp"]').forEach(parent => {
    const title = parent.querySelector('[data-gradient-text]');
    if (!title) return;
    gsap.from(title, {
      opacity: 0,
      y: 100,
      duration: 0.5,
      scrollTrigger: {
        trigger: title,
        start: "top 100%",
        toggleActions: "play none none none",
        once: true
      },
      willChange: "opacity, transform"
    });
  });

  // ==== FadeUpStaggerParent & FadeRightStaggerParent ====
  [['fadeUpStaggerParent', 'fadeUpStagger', 'y', 50], ['fadeRightStaggerParent', 'fadeRightStagger', 'x', 50]].forEach(([parentAttr, itemAttr, dir, startOffset]) => {
    document.querySelectorAll(`[data-transform="${parentAttr}"]`).forEach(parent => {
      const items = parent.querySelectorAll(`[data-transform="${itemAttr}"]`);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, [dir]: startOffset, willChange: "opacity, transform" });
      gsap.to(items, {
        opacity: 1,
        [dir]: 0,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
          trigger: parent,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true
        }
      });
    });
  });

  // ==== Blur Animation (GPU-ускорение) ====
  function isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  document.querySelectorAll('[data-animation="blur"]').forEach(el => {
    if (isFirefox()) {
      // Для Firefox — альтернативная анимация
      gsap.set(el, { opacity: 0, y: 50 }); // смещение вместо blur
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          toggleActions: "play none none none",
          once: true
        }
      });
    } else {
      // Для остальных — оригинальная blur-анимация
      gsap.set(el, { opacity: 0, y: 50, filter: "blur(8px)", willChange: "opacity, filter" });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        force3D: true,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          toggleActions: "play none none none",
          once: true
        }
      });
    }
  });

  // ==== Parallax для изображений и блоков ====
  const animations = document.querySelectorAll('[data-animation="parallax-img"], [data-animation="parallax-img-scale"], [data-animation^="parallax-box"]');
  if (!animations.length) return;

  animations.forEach(container => {
    // Находим изображение внутри контейнера, если есть
    const el = container.tagName.toLowerCase() === 'img' ? container : container.querySelector('img') || container;

    const isScale = container.dataset.animation === "parallax-img-scale";
    const yStart = container.dataset.animation === "parallax-box-2x" ? "20%" : "10%";
    const yEnd = container.dataset.animation === "parallax-box-2x" ? "-20%" : "-10%";

    const fromVars = { y: yStart };
    if (isScale) fromVars.scale = 1, fromVars.y = 0;

    const toVars = { y: yEnd };
    if (isScale) toVars.scale = 1.2, fromVars.y = 0;

    gsap.fromTo(el, fromVars, {
      ...toVars,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: container,   // триггер по контейнеру
        start: "top 90%",
        end: "bottom top",
        scrub: true
      },
      willChange: "transform"
    });
  });

  // Выявление заполненности поля формы для присваивания класса
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.toggle('filled', input.value.trim() !== ''));
  });

  /**
   * Инициализация Fancybox
   */
  Fancybox.bind('[data-fancybox]', {
    Panzoom: false,
    Html: {
      autoSize: false
    },
    on: { 'Carousel.ready': () => lenis.stop(), destroy: () => lenis.start() }
  });

  /**
   * Таймлайн
   */
  const TimelineScroll = {

    defaultConfig: {
      breakpoint: 768,
      selectors: {
        placeholder: '.timeline-placeholder',
        container: '.timeline-container',
        timeline: '.timeline',
        wrapper: '.timeline-wrapper',
        items: '.timeline-item',
        btnPrev: '.timeline-button-prev',
        btnNext: '.timeline-button-next'
      }
    },

    init(placeholderSelector = '.timeline-placeholder', customSelectors = {}) {

      this.config = {
        ...this.defaultConfig,
        selectors: { ...this.defaultConfig.selectors, ...customSelectors }
      };

      this.state = {
        rootElement: null,
        timelinePlaceholder: null,
        timelineContainer: null,
        timeline: null,
        timelineWrapper: null,
        timelineItems: null,
        btnPrev: null,
        btnNext: null,

        itemWidth: 0,
        containerWidth: 0,
        totalWidth: 0,
        maxScroll: 0,
        placeholderHeight: 0,
        containerHeight: 0,
        scrollDistance: 0,

        timelineProgress: 0,
        currentIndex: 0,
        isAnimating: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        isDragging: false,
        startScroll: 0,
        xSwipe: false,

        scrollTimeout: null,
        isScrolling: false,

        buttonHoldInterval: null,
        buttonHoldDirection: null,
        buttonHoldDelay: 300,
        buttonHoldSpeed: 100,
        initialButtonPress: true
      };

      this.setRootElement(placeholderSelector);

      this.cacheElements();
      this.calculatePlaceholderHeight();
      this.bindEvents();
      this.updateButtons();
      this.updateActiveItem(0);
      return this;
    },

    setRootElement(selector) {
      const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

      if (!element) {
        console.warn(`TimelineScroll: Root element not found with selector "${selector}"`);
      }

      this.state.rootElement = element;
    },

    destroy() {
      window.removeEventListener('resize', this.onResize.bind(this));
      this.stopButtonHold();
    },

    next() {
      this.goToIndex(this.state.currentIndex + 1);
    },

    prev() {
      this.goToIndex(this.state.currentIndex - 1);
    },

    goTo(index) {
      this.goToIndex(index);
    },

    getCurrentIndex() {
      return this.state.currentIndex;
    },

    startButtonHold(direction) {
      const s = this.state;

      if (s.buttonHoldInterval) {
        clearInterval(s.buttonHoldInterval);
      }

      s.buttonHoldDirection = direction;
      s.initialButtonPress = true;

      if (direction === 'next') {
        this.next();
      } else {
        this.prev();
      }

      s.buttonHoldInterval = setTimeout(() => {
        s.initialButtonPress = false;
        s.buttonHoldInterval = setInterval(() => {
          if (s.buttonHoldDirection === 'next') {
            this.next();
          } else {
            this.prev();
          }
        }, s.buttonHoldSpeed);
      }, s.buttonHoldDelay);
    },

    stopButtonHold() {
      const s = this.state;

      if (s.buttonHoldInterval) {
        clearTimeout(s.buttonHoldInterval);
        clearInterval(s.buttonHoldInterval);
        s.buttonHoldInterval = null;
        s.buttonHoldDirection = null;
      }
    },

    cacheElements() {
      const s = this.state;
      const selectors = this.config.selectors;

      s.timelinePlaceholder = s.rootElement;
      s.timelineContainer = this.findElement(selectors.container);
      s.timeline = this.findElement(selectors.timeline);
      s.timelineWrapper = this.findElement(selectors.wrapper);
      s.timelineItems = this.findElement(selectors.items, true);
      s.btnPrev = this.findElement(selectors.btnPrev);
      s.btnNext = this.findElement(selectors.btnNext);

      this.validateRequiredElements();
    },

    findElement(selector, all = false) {
      if (all) {
        return this.state.rootElement.querySelectorAll(selector);
      }
      return this.state.rootElement.querySelector(selector);
    },

    validateRequiredElements() {
      const s = this.state;
      const required = [
        { element: s.timelineContainer, name: 'container' },
        { element: s.timeline, name: 'timeline' },
        { element: s.timelineWrapper, name: 'wrapper' },
        { element: s.timelineItems, name: 'items' }
      ];

      required.forEach(({ element, name }) => {
        if (!element || (Array.isArray(element) && element.length === 0)) {
          console.warn(`TimelineScroll: Required element "${name}" not found with selector "${this.config.selectors[name]}"`)
        }
      });
    },

    isMobileDevice() {
      return window.innerWidth <= this.config.breakpoint;
    },

    calculatePlaceholderHeight() {
      const s = this.state;

      if (this.isMobileDevice()) {
        s.timelinePlaceholder.style.height = 'auto';
        return;
      }

      s.containerHeight = s.timelineContainer.offsetHeight;
      s.itemWidth = s.timelineItems[0].offsetWidth;
      // s.containerWidth = s.timeline.offsetWidth;
      s.containerWidth = s.timelineContainer.offsetWidth;

      s.totalWidth = s.itemWidth * s.timelineItems.length;
      s.maxScroll = Math.max(0, s.totalWidth - s.containerWidth);
      s.scrollDistance = s.maxScroll;
      s.placeholderHeight = s.containerHeight + s.scrollDistance;

      s.timelinePlaceholder.style.height = `${s.placeholderHeight}px`;
    },

    updateButtons() {
      const s = this.state;
      if (this.isMobileDevice() || !s.btnPrev || !s.btnNext) return;

      s.btnPrev.disabled = s.currentIndex === 0;
      s.btnNext.disabled = s.currentIndex === s.timelineItems.length - 1;
    },

    goToIndex(index) {
      if (this.isMobileDevice()) {
        return this.goToIndexMobile(index);
      }

      const s = this.state;
      if (s.isAnimating) return;

      index = Math.max(0, Math.min(index, s.timelineItems.length - 1));
      if (index === s.currentIndex) return;

      s.isAnimating = true;

      const maxIndex = s.timelineItems.length - 1;
      const targetProgress = index / maxIndex;
      const containerTop = s.timelinePlaceholder.offsetTop;
      const targetScroll = containerTop + (targetProgress * s.scrollDistance);

      lenis.scrollTo(targetScroll, {
        duration: 0.4, // Было 0.7, стало 0.4
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          s.isAnimating = false;
        }
      });
    },

    goToIndexMobile(index) {
      const s = this.state;
      index = Math.max(0, Math.min(index, s.timelineItems.length - 1));
      const item = s.timelineItems[index];
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const containerWidth = s.timeline.offsetWidth;

      const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

      s.timeline.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      this.updateActiveItemMobile(index);
    },

    updateTimeline(scrollY) {
      const s = this.state;
      if (this.isMobileDevice()) return;

      const containerTop = s.timelinePlaceholder.offsetTop;

      let scrollProgress = (scrollY - containerTop) / s.scrollDistance;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      if (scrollY >= containerTop && scrollY <= containerTop + s.scrollDistance) {
        s.timelineProgress = scrollProgress;

        const translateX = -s.timelineProgress * s.maxScroll;
        s.timelineWrapper.style.transform = `translateX(${translateX}px)`;

        this.updateActiveItem(s.timelineProgress);

      } else {
        if (scrollY < containerTop) {
          s.timelineProgress = 0;
          s.timelineWrapper.style.transform = 'translateX(0px)';
          this.updateActiveItem(0);
        } else if (scrollY > containerTop + s.scrollDistance) {
          s.timelineProgress = 1;
          s.timelineWrapper.style.transform = `translateX(${-s.maxScroll}px)`;
          this.updateActiveItem(1);
        }
      }
    },

    updateActiveItem(progress) {
      const s = this.state;
      const maxIndex = s.timelineItems.length - 1;
      const newIndex = Math.min(
        maxIndex,
        Math.round(progress * maxIndex)
      );

      if (newIndex !== s.currentIndex) {
        s.currentIndex = newIndex;

        s.timelineItems.forEach((item, index) => {
          item.classList.toggle('timeline-active', index === s.currentIndex);
        });

        this.updateButtons();
      }
    },

    updateActiveItemMobile(index) {
      const s = this.state;
      if (index !== s.currentIndex) {
        s.currentIndex = index;

        s.timelineItems.forEach((item, i) => {
          item.classList.toggle('timeline-active', i === s.currentIndex);
        });
      }
    },

    handleMobileScroll() {
      const s = this.state;
      if (!this.isMobileDevice()) return;

      clearTimeout(s.scrollTimeout);
      s.isScrolling = true;

      const scrollLeft = s.timeline.scrollLeft;
      const containerWidth = s.timeline.offsetWidth;
      const itemWidth = s.timelineItems[0].offsetWidth;

      const center = scrollLeft + (containerWidth / 2);

      let closestIndex = 0;
      let minDistance = Infinity;

      s.timelineItems.forEach((item, index) => {
        const itemLeft = item.offsetLeft;
        const itemCenter = itemLeft + (itemWidth / 2);
        const distance = Math.abs(center - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      this.updateActiveItemMobile(closestIndex);

      s.scrollTimeout = setTimeout(() => {
        s.isScrolling = false;

        if (!s.isScrolling) {
          this.goToIndex(closestIndex);
        }
      }, 100);
    },

    handleTouchStart(e) {
      const s = this.state;
      if (s.isAnimating) return;

      s.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      s.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      s.currentX = parseInt(getComputedStyle(s.timelineWrapper).transform.split(',')[4] || 0, 10);
      s.startScroll = lenis.scroll;
      s.isDragging = true;
      s.xSwipe = false;
      s.timelineWrapper.classList.add('grabbing');
    },

    handleTouchMove(e) {
      const s = this.state;
      if (!s.isDragging) return;
      e.preventDefault();

      const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      if (!s.xSwipe) {
        const diffX = Math.abs(x - s.startX);
        const diffY = Math.abs(y - s.startY);

        if (diffY > diffX && diffY > 10) {
          s.isDragging = false;
          s.timelineWrapper.classList.remove('grabbing');
          return;
        }

        if (diffX > 10) {
          s.xSwipe = true;
          e.preventDefault();
        }
      }

      if (s.xSwipe) {
        const diff = x - s.startX;

        let newX = s.currentX + diff;

        newX = Math.min(Math.max(newX, -s.maxScroll), 0);

        s.timelineWrapper.style.transform = `translateX(${newX}px)`;

        lenis.scrollTo(s.startScroll, { immediate: true });
      }
    },

    handleTouchEnd(e) {
      const s = this.state;
      if (!s.isDragging) return;
      s.isDragging = false;
      s.timelineWrapper.classList.remove('grabbing');

      const x = e.type === 'touchend' ? (e.changedTouches ? e.changedTouches[0].clientX : 0) : e.clientX;
      const diff = x - s.startX;
      const velocity = diff / 100;

      if (Math.abs(diff) > 50 || Math.abs(velocity) > 0.5) {
        if (diff > 0) {
          this.goToIndex(s.currentIndex - 1);
        } else {
          this.goToIndex(s.currentIndex + 1);
        }
      } else {
        this.goToIndex(s.currentIndex);
      }
    },

    onLenisScroll({ scroll }) {
      if (!this.state.isDragging) {
        this.updateTimeline(scroll);
      }
    },

    onResize() {
      this.calculatePlaceholderHeight();
      this.updateTimeline(lenis.scroll);
      this.updateButtons();
    },

    bindEvents() {
      const s = this.state;

      if (s.btnPrev) {
        s.btnPrev.addEventListener('click', () => {
          this.goToIndex(s.currentIndex - 1);
        });

        s.btnPrev.addEventListener('mousedown', () => {
          this.startButtonHold('prev');
        });

        s.btnPrev.addEventListener('touchstart', () => {
          this.startButtonHold('prev');
        });

        s.btnPrev.addEventListener('mouseup', () => {
          this.stopButtonHold();
        });

        s.btnPrev.addEventListener('touchend', () => {
          this.stopButtonHold();
        });

        s.btnPrev.addEventListener('mouseleave', () => {
          this.stopButtonHold();
        });
      }

      if (s.btnNext) {
        s.btnNext.addEventListener('click', () => {
          this.goToIndex(s.currentIndex + 1);
        });

        s.btnNext.addEventListener('mousedown', () => {
          this.startButtonHold('next');
        });

        s.btnNext.addEventListener('touchstart', () => {
          this.startButtonHold('next');
        });

        s.btnNext.addEventListener('mouseup', () => {
          this.stopButtonHold();
        });

        s.btnNext.addEventListener('touchend', () => {
          this.stopButtonHold();
        });

        s.btnNext.addEventListener('mouseleave', () => {
          this.stopButtonHold();
        });
      }

      document.addEventListener('mouseup', () => {
        this.stopButtonHold();
      });

      document.addEventListener('touchend', () => {
        this.stopButtonHold();
      });

      if (!this.isMobileDevice()) {
        s.timelineWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        s.timelineWrapper.addEventListener('mousedown', this.handleTouchStart.bind(this));

        s.timelineWrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        s.timelineWrapper.addEventListener('mousemove', this.handleTouchMove.bind(this));

        s.timelineWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this));
        s.timelineWrapper.addEventListener('mouseup', this.handleTouchEnd.bind(this));
        s.timelineWrapper.addEventListener('mouseleave', this.handleTouchEnd.bind(this));
      }

      s.timeline.addEventListener('scroll', this.handleMobileScroll.bind(this));

      lenis.on('scroll', this.onLenisScroll.bind(this));
      window.addEventListener('resize', this.onResize.bind(this));
    }
  };

  TimelineScroll.create = function (placeholderSelector = '.timeline-placeholder', customSelectors = {}) {
    const instance = Object.create(this);
    return instance.init(placeholderSelector, customSelectors);
  };
  // можно вынести в отдельный файл - КОНЕЦ

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (document.getElementById('timelinePlaceholder')) {
    const timeline = TimelineScroll.create('#timelinePlaceholder');
  }

  (function () {
    const rangeItems = document.querySelectorAll('.range__item');
    if (rangeItems.length > 0) {
      rangeItems.forEach(rangeItem => {
        const range = rangeItem.querySelector('.range__item-js');
        range.addEventListener('input', () => {
          rangeItem.style.setProperty('--value', range.value + '%');
        });

        const stop = e => e.stopPropagation();
        // mouse
        rangeItem.addEventListener('mousedown', stop, { passive: true });
        // touch
        rangeItem.addEventListener('touchstart', stop, { passive: true });
        rangeItem.addEventListener('touchmove', stop, { passive: true });
        // pointer (на всякий случай)
        rangeItem.addEventListener('pointerdown', stop, { passive: true });
      });
    }
  })();

  /**
   * Кнопка куки
   */
  if (('; ' + document.cookie).split(`; COOKIE_ACCEPT=`).pop().split(';')[0] !== '1') {
    const cookiesNotify = document.getElementById('plate-cookie');

    if (cookiesNotify) {
      cookiesNotify.style.right = '0';
    }
  }

});

function checkCookies() {
  document.cookie = 'COOKIE_ACCEPT=1;path=\'/\';expires:' + (new Date(new Date().getTime() + 86400e3 * 365).toUTCString());
  document.getElementById('plate-cookie').style.right = '-100%';
  setInterval(() => document.getElementById('plate-cookie').remove(), 5000);
}