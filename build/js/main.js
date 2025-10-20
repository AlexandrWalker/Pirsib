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
    const marker = 150;
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
  const opinionSlider = new Swiper('.opinion--slider', {
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
    navigation: false,
    breakpoints: {
      835: {
        slidesPerView: 3,
        spaceBetween: 20,
        pagination: false,
        navigation: {
          prevEl: ".opinion-button-prev",
          nextEl: ".opinion-button-next",
        },
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
    navigation: false,
    breakpoints: {
      835: {
        slidesPerView: 3,
        spaceBetween: 20,
        pagination: false,
        navigation: {
          prevEl: ".works-button-prev",
          nextEl: ".works-button-next",
        },
      },
    },
  });

});