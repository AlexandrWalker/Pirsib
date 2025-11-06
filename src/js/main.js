document.addEventListener('DOMContentLoaded', () => {

  // function quickDist(deltaX, deltaY) {
  //   return deltaX ** 2 + deltaY ** 2;
  // }

  // addEventListener("mousemove", e => {
  //   const centerX = window.innerWidth / 2;
  //   const centerY = window.innerHeight / 2;
  //   const distanceX = e.clientX - centerX
  //   const distanceY = e.clientY - centerY
  //   const maxDist = quickDist(centerX, centerY);
  //   const dist = quickDist(distanceX, distanceY);
  //   const deg = Math.atan2(distanceY, distanceX) / Math.PI * 180;
  //   document.body.style.setProperty("--deg", `${deg}deg`);
  //   document.body.style.setProperty("--distance", `${dist / maxDist}`);
  // });

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  /**
   * Подключение ScrollTrigger
   */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /**
   * Инициализация Lenis
   */
  const lenis = new Lenis({
    anchors: {
      offset: -60,
    },
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  /**
   * Управляет поведением меню-бургера.
   */
  function burgerNav() {
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burger-btn');
    const burgerMenuInner = document.querySelector('.burger-menu');

    const closeMenu = () => {
      burgerBtn.classList.remove('burger--open');
      document.documentElement.classList.remove('menu--open');
      lenis.start();
    };

    burgerBtn.addEventListener('click', function () {

      if (document.documentElement.classList.contains('menu--open')) {
        lenis.start();
        header.classList.add('out');
      } else {
        lenis.stop();
      }

      if (header.classList.contains('show')) {
        header.classList.remove('show');
      }

      burgerBtn.classList.toggle('burger--open');
      document.documentElement.classList.toggle('menu--open');
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      if (!burgerMenuInner.contains(event.target) && !burgerBtn.contains(event.target)) {
        closeMenu();
      }
    });
  }
  burgerNav();

  /**
   * Управляет поведением хэдера.
   */
  function headerFunc() {
    const header = document.getElementById('header');
    const firstSection = document.querySelector('section');
    const marker = 10;
    let lastScrollTop = 1;
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
      // if (scrollPosition() > lastScrollTop && scrollPosition() > firstSection.offsetHeight) {
      if (scrollPosition() > lastScrollTop && scrollPosition() > marker) {
        header.classList.add('out');
      } else {
        header.classList.remove('out');
      }

      if (scrollPosition() > firstSection.offsetHeight) {
        // if (scrollPosition() > marker) {
        header.classList.add('show');
      } else {
        header.classList.remove('show');
      }

      lastScrollTop = scrollPosition();
    })
  }
  headerFunc();

  /**
   * Градиент текста по курсору
   */
  $(window).on('resize load', function () {
    if (window.innerWidth > 834) {

      (function () {
        function initGradientText(selector = '[data-gradient-text]') {
          const elements = document.querySelectorAll(selector);

          elements.forEach(el => {
            let targetX = 50, targetY = 50;
            let currentX = 50, currentY = 50;
            let isHover = false;
            const speed = 0.12;

            function animate() {
              currentX += (targetX - currentX) * speed;
              currentY += (targetY - currentY) * speed;

              if (isHover) {
                // Градиент строго под курсором
                el.style.backgroundImage = `radial-gradient(circle at ${currentX}% ${currentY}%, #AD32AE 0%, #AD32AE 40%, #3C49C2 60%, #3C49C2 100%)`;
                el.style.backgroundSize = '100% 100%'; // фиксированное 100% для корректного отображения
              }

              requestAnimationFrame(animate);
            }
            animate();

            function setTarget(e) {
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              targetX = (x / rect.width) * 100;
              targetY = (y / rect.height) * 100;
            }

            el.addEventListener('mouseenter', e => {
              isHover = true;
              el.classList.add('active');
              setTarget(e);
              el.style.animation = 'none'; // отключаем автоматическую анимацию
              el.style.backgroundSize = '100% 100%';
            });

            el.addEventListener('mousemove', e => {
              if (isHover) setTarget(e);
            });

            el.addEventListener('mouseleave', () => {
              isHover = false;
              el.classList.remove('active');

              // фиксируем текущую позицию градиента
              const computedStyle = window.getComputedStyle(el);
              const bgPos = computedStyle.backgroundPosition;
              el.style.backgroundPosition = bgPos;
              el.style.backgroundImage = '';
              el.style.backgroundSize = '300% 100%';

              // плавно возобновляем автоматическую анимацию
              requestAnimationFrame(() => {
                el.style.animation = 'idleGradient 3s linear infinite';
              });
            });

            // Touch поддержка
            el.addEventListener('touchstart', e => {
              isHover = true;
              el.classList.add('active');
              const t = e.touches[0];
              if (t) setTarget(t);
              el.style.animation = 'none';
              el.style.backgroundSize = '100% 100%';
            }, { passive: true });

            el.addEventListener('touchmove', e => {
              if (!isHover) return;
              const t = e.touches[0];
              if (t) setTarget(t);
            }, { passive: true });

            el.addEventListener('touchend', () => {
              isHover = false;
              el.classList.remove('active');

              const computedStyle = window.getComputedStyle(el);
              const bgPos = computedStyle.backgroundPosition;
              el.style.backgroundPosition = bgPos;
              el.style.backgroundSize = '300% 100%';
              el.style.backgroundImage = '';

              requestAnimationFrame(() => {
                el.style.animation = 'idleGradient 3s linear infinite';
              });
            });
          });
        }

        initGradientText();
      })();

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


    }
  });

  /**
   * Аккордион
   */
  function accordionFunc() {
    if (document.querySelector('.accordion-parent')) {
      document.querySelectorAll('.accordion-parent').forEach((accordionContainer) => {

        var accordionHead = accordionContainer.querySelectorAll('.accordion'),
          accordionActiveClass = 'accordion-active',
          accordionActive = accordionContainer.getElementsByClassName(accordionActiveClass);

        Array.from(accordionHead).forEach(function (accordionItem, i, accordionHead) {
          accordionItem.addEventListener('click', function (e) {
            e.stopPropagation();

            if (accordionActive.length > 0 && accordionActive[0] !== this) {
              accordionActive[0].classList.remove(accordionActiveClass);
            }
            this.classList.toggle(accordionActiveClass);

            window.addEventListener('keydown', (e) => {
              if (e.key === "Escape") {
                accordionItem.classList.remove(accordionActiveClass)
              }
            });

            document.addEventListener('click', (e) => {
              const withinBoundaries = e.composedPath().includes(accordionItem);

              if (!withinBoundaries) {
                accordionItem.classList.remove(accordionActiveClass);
              }
            })
          });
        });
      });
    }
  }
  accordionFunc();

  /**
   * Инициализация слайдера
   */
  const swiper = document.querySelector('.swiper');
  if (swiper) {
    const opinionSlider = new Swiper('.opinion__slider', {
      slidesPerGroup: 1,
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      simulateTouch: true,
      watchOverflow: true,
      speed: 600,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true,
      },
      touchEvents: {
        prevent: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        prevEl: ".opinion-button-prev",
        nextEl: ".opinion-button-next",
      },
      breakpoints: {
        835: {
          slidesPerView: 3,
          spaceBetween: 20,
          pagination: false,
        },
      },
    });

    const personalSlider = new Swiper('.personal__slider', {
      slidesPerGroup: 1,
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      simulateTouch: true,
      watchOverflow: true,
      speed: 1000,
      // effect: "fade",
      // effect: "flip",
      effect: "creative",
      creativeEffect: {
        prev: {
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["20%", 0, 0],
        },
      },
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true
      },
      touchEvents: {
        prevent: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });

    const worksSlider = new Swiper('.works__slider', {
      slidesPerGroup: 1,
      slidesPerView: 1,
      spaceBetween: 8,
      loop: true,
      grabCursor: true,
      simulateTouch: true,
      watchOverflow: true,
      speed: 600,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
        releaseOnEdges: true,
      },
      touchEvents: {
        prevent: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        prevEl: ".works-button-prev",
        nextEl: ".works-button-next",
      },
      breakpoints: {
        835: {
          slidesPerView: 3,
          spaceBetween: 20,
          pagination: false,
        },
      },
    });
  }

  /**
   * GSAP
   */
  const fadeUps = document.querySelectorAll('[data-transform="fadeUp"]');
  if (fadeUps.length > 0) {
    fadeUps.forEach(fadeUp => {
      const tl = gsap.timeline({
        paused: true
      });
      tl.from(fadeUp, {
        opacity: 0,
        y: "100",
        duration: .5,
        ease: "ease",
        stagger: {
          amount: .3
        },
      });
      scrollTriggerPlayer(fadeUp, tl)
    });
  }

  const textBlurs = document.querySelectorAll('[data-blur="textBlur"]');
  if (textBlurs.length > 0) {
    textBlurs.forEach(textBlur => {
      const tl = gsap.timeline({
        paused: true
      });
      tl.from(textBlur, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.5,
        ease: "power4.out",
        onUpdate: function () {
          this.targets().forEach(el => {
            el.style.filter = `blur(${Math.abs(this.progress() - 1) * 10}px)`;
          });
        }
      });
      scrollTriggerPlayer(textBlur, tl)
    });
  }

  const titleFadeUps = document.querySelectorAll('[data-transform="titleFadeUp"]');
  if (titleFadeUps.length > 0) {
    titleFadeUps.forEach(titleFadeUp => {
      const tl = gsap.timeline({
        paused: true
      });
      const title = titleFadeUp.querySelector('[data-gradient="gradientMove"]');
      tl.from(title, {
        opacity: 0,
        y: "100",
        duration: .5,
        ease: "ease",
        stagger: {
          amount: .3
        },
      });
      scrollTriggerPlayer(title, tl)
    });
  }

  const fadeUpStaggerParents = document.querySelectorAll('[data-transform="fadeUpStaggerParent"]')
  if (fadeUpStaggerParents.length > 0) {
    fadeUpStaggerParents.forEach(fadeUpStaggerParent => {
      const items = fadeUpStaggerParent.querySelectorAll('[data-transform="fadeUpStagger"]');
      gsap.to(items, {
        scrollTrigger: {
          trigger: fadeUpStaggerParent,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }

  const fadeRightStaggerParents = document.querySelectorAll('[data-transform="fadeRightStaggerParent"]')
  if (fadeRightStaggerParents.length > 0) {
    fadeRightStaggerParents.forEach(fadeRightStaggerParent => {
      const items = fadeRightStaggerParent.querySelectorAll('[data-transform="fadeRightStagger"]');
      gsap.to(items, {
        scrollTrigger: {
          trigger: fadeRightStaggerParent,
          start: "top 80%",
        },
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }

  const heroCover = document.querySelector('.hero__cover');
  if (heroCover) {
    const tl = gsap.timeline({
      paused: true
    });
    tl.from(heroCover, {
      opacity: 0,
      y: "100",
      duration: 1,
      ease: "ease",
      stagger: {
        amount: .3
      },
    });
    scrollTriggerPlayer(heroCover, tl)
  }

  const heroLogo = document.querySelector('.hero__logo');
  if (heroLogo) {
    const tl = gsap.timeline({
      paused: true
    });
    tl.from(heroLogo, {
      opacity: 0,
      filter: "blur(10px)",
      duration: 1,
      ease: "power4.out",
      onUpdate: function () {
        this.targets().forEach(el => {
          el.style.filter = `blur(${Math.abs(this.progress() - 1) * 10}px)`;
        });
      }
    });
    scrollTriggerPlayer(heroLogo, tl)
  }

  function scrollTriggerPlayer(triggerElement, timeline, onEnterStart = "top 95%") {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(1);
        timeline.pause()
      }
    });
    ScrollTrigger.create({
      trigger: triggerElement,
      start: onEnterStart,
      scrub: true,
      onEnter: () => timeline.play()
    })
  }

  // $(window).on('resize load', function () {

  //   /* Анимация mask */
  //   $(".wrapper").mousemove(function (e) {
  //     const masks = document.querySelectorAll('.mask');
  //     masks.forEach(mask => {
  //       parallaxIt(e, mask, -300);
  //     });
  //   });

  //   function parallaxIt(e, target, movement) {
  //     var $this = $(target);
  //     var relX = e.pageX - $this.offset().left;
  //     var relY = e.pageY - $this.offset().top;

  //     TweenMax.to(target, 1, {
  //       x: (relX - $this.width() / 2) / $this.width() * movement,
  //       y: (relY - $this.height() / 2) / $this.height() * movement,
  //       ease: 'none'
  //     });
  //   }

  // });

  const parallaxImgBoxes = document.querySelectorAll('[data-animation="parallax-box"]');
  if (parallaxImgBoxes != 0) {
    parallaxImgBoxes.forEach(parallaxImgBox => {

      gsap.fromTo(parallaxImgBox,
        { y: '20%' },
        {
          y: '-20%',
          scrollTrigger: {
            trigger: parallaxImgBox,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

    });
  }

  /**
   * Инициализация формы набора символов
   */
  const form = document.querySelector('form');
  if (form) {
    const inputElements = document.querySelectorAll('.form-input');
    const textareaElements = document.querySelectorAll('.form-textarea');
    const className = 'filled';

    if (inputElements.length > 0) {
      inputElements.forEach(element => {
        element.addEventListener('input', function () {
          if (this.value.trim() !== '') {
            element.classList.add(className);
          } else {
            element.classList.remove(className);
          }
        });
      });
    };

    if (textareaElements.length > 0) {
      textareaElements.forEach(element => {
        element.addEventListener('input', function () {
          if (this.value.trim() !== '') {
            element.classList.add(className);
          } else {
            element.classList.remove(className);
          }
        });
      });
    }
  }

  /**
   * Инициализация Fabcybox
   */
  Fancybox.bind('[data-fancybox]', {
    Html: {
      autoSize: false,
    },
    on: {
      'Carousel.ready': () => {
        lenis.stop();
      },
      destroy: () => {
        lenis.start();
      }
    }
  });

});