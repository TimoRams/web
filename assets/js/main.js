(function () {
  "use strict";

  // Helper function to select elements
  const select = (el, all = false) => (all ? [...document.querySelectorAll(el)] : document.querySelector(el));

  // Helper function to add event listeners
  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  // Helper function to handle scroll events
  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  // Navbar links active state on scroll
  const navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  // Scrolls to an element with header offset
  const scrollto = (el) => {
    const header = select("#header");
    const offset = header.offsetHeight;
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  // Header fixed top on scroll
  const selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  // Back to top button
  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  // Mobile nav toggle
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  // Mobile nav dropdowns activate
  on("click", ".navbar .dropdown > a", function (e) {
    if (select("#navbar").classList.contains("navbar-mobile")) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle("dropdown-active");
    }
  }, true);

  // Scroll with offset on links with a class name .scrollto
  on("click", ".scrollto", function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      const navbar = select("#navbar");
      if (navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        const navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(this.hash);
    }
  }, true);

  // Scroll with offset on page load with hash links in the url
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  // Preloader with fade-out effect
  const preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("hidden");
      preloader.addEventListener("transitionend", () => {
        preloader.remove();
      });
    });
  }

  // GLightbox
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  // Skills animation
  const skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        const progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  // Portfolio isotope and filter
  window.addEventListener("load", () => {
    const portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      const portfolioFilters = select("#portfolio-flters li", true);

      on("click", "#portfolio-flters li", function (e) {
        e.preventDefault();
        portfolioFilters.forEach((el) => {
          el.classList.remove("filter-active");
        });
        this.classList.add("filter-active");

        portfolioIsotope.arrange({
          filter: this.getAttribute("data-filter"),
        });
        portfolioIsotope.on("arrangeComplete", () => {
          AOS.refresh();
        });
      }, true);
    }
  });

  // Portfolio lightbox
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  // Portfolio details slider
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  // Animation on scroll
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();
