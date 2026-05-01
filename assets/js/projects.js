(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.PORTFOLIO_DATA || {};
    var projects = data.projects || [];
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initMenu();
    initScrollTop();
    renderFilters(projects);
    renderProjects(projects);
    initFilters(prefersReducedMotion);
    initReveal(prefersReducedMotion);
  });

  function initMenu() {
    var menuButton = document.getElementById("menu");
    var navbar = document.getElementById("site-navigation");
    if (!menuButton || !navbar) return;

    function closeMenu() {
      navbar.classList.remove("nav-open");
      menuButton.classList.remove("fa-times");
      menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", function () {
      var isOpen = navbar.classList.toggle("nav-open");
      menuButton.classList.toggle("fa-times", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navbar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initScrollTop() {
    var scrollTop = document.getElementById("scroll-top");
    function handleScroll() {
      if (scrollTop) scrollTop.classList.toggle("active", window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  function renderFilters(projects) {
    var filters = document.getElementById("filters");
    if (!filters) return;

    var categories = Array.from(new Map(projects.map(function (project) {
      return [project.category, project.categoryLabel];
    })).entries());

    filters.innerHTML = [
      "<button class=\"filter-btn active\" type=\"button\" data-filter=\"all\">All Projects</button>",
      categories.map(function (entry) {
        return "<button class=\"filter-btn\" type=\"button\" data-filter=\"" + escapeAttribute(entry[0]) + "\">" + escapeHtml(entry[1]) + "</button>";
      }).join("")
    ].join("");
  }

  function renderProjects(projects) {
    var container = document.getElementById("projectsContainer");
    if (!container) return;

    container.innerHTML = projects.map(function (project, index) {
      var demoButton = project.demo && project.demo.disabled
        ? "<button class=\"project-cta disabled\" type=\"button\" disabled title=\"" + escapeAttribute(project.demo.tooltip) + "\">Live Demo <i class=\"fas fa-arrow-right\"></i></button>"
        : "<a class=\"project-cta\" href=\"" + escapeAttribute(project.demo.url) + "\" target=\"_blank\" rel=\"noopener\">Live Demo <i class=\"fas fa-arrow-right\"></i></a>";

      return [
        "<article class=\"project-card reveal-item\" data-category=\"" + escapeAttribute(project.category) + "\"",
        " style=\"--project-gradient:" + escapeAttribute(project.gradient) + "; --reveal-delay:" + (index % 3) * 100 + "ms\">",
        "<div class=\"project-banner\">",
        "<span>" + escapeHtml(project.categoryLabel) + "</span>",
        "<i class=\"fas fa-project-diagram\" aria-hidden=\"true\"></i>",
        "</div>",
        "<div class=\"project-body\">",
        "<p class=\"project-kicker\">" + escapeHtml(project.categoryLabel) + "</p>",
        "<h2>" + escapeHtml(project.title) + "</h2>",
        "<h4>" + escapeHtml(project.subtitle) + "</h4>",
        "<p class=\"project-description\">" + escapeHtml(project.description) + "</p>",
        "<details class=\"project-details\" open>",
        "<summary>Key Features</summary>",
        "<ul>" + project.features.map(function (feature) {
          return "<li>" + escapeHtml(feature) + "</li>";
        }).join("") + "</ul>",
        "</details>",
        "<div class=\"tech-stack\">" + project.techStack.map(function (tech) {
          return "<span>" + escapeHtml(tech) + "</span>";
        }).join("") + "</div>",
        "<div class=\"project-actions\">",
        "<a class=\"project-cta\" href=\"" + escapeAttribute(project.github) + "\" target=\"_blank\" rel=\"noopener\">GitHub <i class=\"fas fa-arrow-right\"></i></a>",
        demoButton,
        "</div>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function initFilters(prefersReducedMotion) {
    var filters = document.getElementById("filters");
    var cards = Array.from(document.querySelectorAll(".project-card"));
    if (!filters || !cards.length) return;

    filters.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;

      filters.querySelectorAll("[data-filter]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      cards.forEach(function (card) {
        var visible = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter;
        card.classList.toggle("hidden", !visible);
        if (visible && !prefersReducedMotion) {
          card.animate(
            [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 320, easing: "ease", fill: "both" }
          );
        }
      });
    });
  }

  function initReveal(prefersReducedMotion) {
    var targets = document.querySelectorAll(".section-label, .heading, .section-sub, .filter-bar, .project-card");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, revealObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    targets.forEach(function (target, index) {
      target.classList.add("reveal-item");
      target.style.setProperty("--reveal-delay", Math.min(index % 3, 2) * 100 + "ms");
      if (isElementInViewport(target)) {
        target.classList.add("is-visible");
      } else {
        observer.observe(target);
      }
    });
  }

  function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * 0.04;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
