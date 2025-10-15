document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  const phone = document.getElementById('phone');
  window.addEventListener('mousemove', e => {
    w = window.innerWidth;
    h = window.innerHeight;
    x = Math.round(e.pageX / w * 100);
    y = Math.round(e.pageY / h * 100);
    phone.style.backgroundImage = `radial-gradient(42.06% 481.38% at ${x}% ${y}%, #AD32AE 0%, #3C49C2 100%)`;
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