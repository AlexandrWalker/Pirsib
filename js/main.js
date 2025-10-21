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
      } else {
        lenis.stop();
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

      const gradientMoves = document.querySelectorAll('[data-gradient="gradientMove"]');
      gradientMoves.forEach(gradientMove => {
        window.addEventListener('mousemove', e => {
          w = window.innerWidth;
          h = window.innerHeight;
          x = Math.round(e.pageX / w * 100);
          y = Math.round(e.pageY / h * 100);
          gradientMove.style.backgroundImage = `radial-gradient(42.06% 481.38% at ${x}% ${y}%, #AD32AE 0%, #3C49C2 100%)`;
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

  const directionsItems = document.querySelector('.directions__items');
  const directionsItem1 = document.querySelector('[data-transform="foreachFadeUp1"]');
  const directionsItem2 = document.querySelector('[data-transform="foreachFadeUp2"]');
  const directionsItem3 = document.querySelector('[data-transform="foreachFadeUp3"]');
  const directionsItem4 = document.querySelector('[data-transform="foreachFadeUp4"]');

  const tl = gsap.timeline({
    paused: true
  });

  tl.to(directionsItem1, { duration: 0.3, y: 0, opacity: 1, stagger: { amount: .3 } })
    .to(directionsItem2, { duration: 0.3, y: 0, opacity: 1, stagger: { amount: .3 } })
    .to(directionsItem3, { duration: 0.3, y: 0, opacity: 1, stagger: { amount: .3 } })
    .to(directionsItem4, { duration: 0.3, y: 0, opacity: 1, stagger: { amount: .3 } })
  scrollTriggerPlayer(directionsItems, tl);

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