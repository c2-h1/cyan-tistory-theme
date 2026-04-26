(function () {
  // Mobile sidebar toggle
  function initMobileSidebar() {
    var hamburger = document.getElementById('hamburger');
    var overlay = document.getElementById('sidebar-overlay');

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        document.body.classList.toggle('sidebar-open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        document.body.classList.remove('sidebar-open');
      });
    }
  }

  // Force-expand all Tistory category subcategory lists
  // (Tistory's own JS may collapse them after load)
  function expandCategories() {
    var lists = document.querySelectorAll('.tt_category li > ul');
    lists.forEach(function (ul) {
      ul.style.setProperty('display', 'flex', 'important');
      ul.style.setProperty('flex-direction', 'column', 'important');
    });
  }

  // Add .cat-parent / .cat-leaf classes so CSS can show folder/triangle icons
  // without depending on CSS :has() which Tistory's pipeline may strip
  function labelCategoryItems() {
    document.querySelectorAll('.tt_category li').forEach(function (li) {
      if (li.querySelector(':scope > ul')) {
        li.classList.add('cat-parent');
      } else {
        li.classList.add('cat-leaf');
      }
    });
  }

  function init() {
    initMobileSidebar();
    expandCategories();
    labelCategoryItems();
    // Run again after a tick in case Tistory's widget JS fires after DOMContentLoaded
    setTimeout(function () {
      expandCategories();
      labelCategoryItems();
    }, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
