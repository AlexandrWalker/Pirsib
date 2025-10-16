document.addEventListener('DOMContentLoaded', () => {

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

});