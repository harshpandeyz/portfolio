(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var data = window.PORTFOLIO_DATA || {};
    var revealObserver = createRevealObserver(prefersReducedMotion);

    initNavigation(prefersReducedMotion);
    initScrollProgress();
    initTyping(prefersReducedMotion);
    renderSkills(data.skills || [], revealObserver, prefersReducedMotion);
    renderFeaturedProjects(data.projects || [], revealObserver, prefersReducedMotion);
    initContactForm();
    registerRevealElements(document, revealObserver, prefersReducedMotion);
  });

  function initNavigation(prefersReducedMotion) {
    var header = document.querySelector("header");
    var menuButton = document.getElementById("menu");
    var navbar = document.getElementById("site-navigation");
    var navLinks = Array.from(document.querySelectorAll(".navbar a[href^=\"#\"]"));
    var sections = Array.from(document.querySelectorAll("section[id]"));

    function closeMenu() {
      if (!navbar || !menuButton) return;
      navbar.classList.remove("nav-open");
      menuButton.classList.remove("fa-times");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-lock");
    }

    if (menuButton && navbar) {
      menuButton.addEventListener("click", function () {
        var isOpen = navbar.classList.toggle("nav-open");
        menuButton.classList.toggle("fa-times", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-lock", isOpen);
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var hash = link.getAttribute("href");
        var target = hash ? document.querySelector(hash) : null;
        closeMenu();
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", hash);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!navbar || !navbar.classList.contains("nav-open")) return;
      if (header && header.contains(event.target)) return;
      closeMenu();
    });

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-42% 0px -50% 0px", threshold: 0 });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  function initScrollProgress() {
    var progress = document.getElementById("scroll-progress");
    var scrollTop = document.getElementById("scroll-top");

    function handleScroll() {
      var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
      if (progress) progress.style.width = percent + "%";
      if (scrollTop) scrollTop.classList.toggle("active", window.scrollY > 360);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
  }

  function initTyping(prefersReducedMotion) {
    var target = document.querySelector(".typing-text");
    var words = ["Full Stack Developer", "Backend Engineer", "REST API Developer", "AI Enthusiast"];
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    if (!target) return;
    if (prefersReducedMotion) {
      target.textContent = words[0];
      return;
    }

    function tick() {
      var current = words[wordIndex];
      target.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
        window.setTimeout(tick, 70);
        return;
      }

      if (!deleting && charIndex === current.length) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(tick, 34);
        return;
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(tick, 180);
    }

    tick();
  }

  function renderSkills(groups, revealObserver, prefersReducedMotion) {
    var tabs = document.getElementById("skillsTabs");
    var panels = document.getElementById("skillsContainer");
    if (!tabs || !panels || !groups.length) return;

    tabs.innerHTML = groups.map(function (group, index) {
      return [
        "<button class=\"skill-tab" + (index === 0 ? " active" : "") + "\"",
        " type=\"button\" data-skill-tab=\"" + escapeHtml(group.id) + "\"",
        " style=\"--accent:" + escapeHtml(group.accent) + "\">",
        escapeHtml(group.label),
        "</button>"
      ].join("");
    }).join("");

    panels.innerHTML = groups.map(function (group, index) {
      return [
        "<div class=\"skill-panel" + (index === 0 ? " active" : "") + "\"",
        " data-skill-panel=\"" + escapeHtml(group.id) + "\"",
        " style=\"--accent:" + escapeHtml(group.accent) + "\">",
        "<div class=\"skill-panel-head\">",
        "<h3>" + escapeHtml(group.label) + "</h3>",
        "<span>" + group.skills.length + " skills</span>",
        "</div>",
        "<div class=\"skill-chip-grid\">",
        group.skills.map(renderSkillChip).join(""),
        "</div>",
        "</div>"
      ].join("");
    }).join("");

    tabs.querySelectorAll("[data-skill-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        var target = button.dataset.skillTab;
        tabs.querySelectorAll(".skill-tab").forEach(function (tab) {
          tab.classList.toggle("active", tab === button);
        });
        panels.querySelectorAll(".skill-panel").forEach(function (panel) {
          panel.classList.toggle("active", panel.dataset.skillPanel === target);
        });
        registerRevealElements(panels, revealObserver, prefersReducedMotion);
      });
    });

    updateHeroCount(".hero-skills-count", countSkills(groups));
    registerRevealElements(panels, revealObserver, prefersReducedMotion);
  }

  function renderSkillChip(skill, index) {
    var icon = skill.icon
      ? "<span class=\"skill-icon\"><img src=\"" + escapeAttribute(skill.icon) + "\" alt=\"\" loading=\"lazy\"></span>"
      : "<span class=\"skill-icon skill-icon-fallback\" aria-hidden=\"true\">" + escapeHtml(skill.name.slice(0, 1)) + "</span>";

    return [
      "<span class=\"skill-chip reveal-item\" style=\"--reveal-delay:" + (index % 3) * 100 + "ms\">",
      icon,
      "<span>" + escapeHtml(skill.name) + "</span>",
      "</span>"
    ].join("");
  }

  function countSkills(groups) {
    return groups.reduce(function (total, group) {
      return total + group.skills.length;
    }, 0);
  }

  function renderFeaturedProjects(projects, revealObserver, prefersReducedMotion) {
    var container = document.getElementById("projectsContainer");
    if (!container) return;

    container.innerHTML = projects.map(function (project, index) {
      return renderProjectCard(project, index);
    }).join("");

    updateHeroCount(".hero-projects-count", projects.length);
    registerRevealElements(container, revealObserver, prefersReducedMotion);
  }

  function renderProjectCard(project, index) {
    var demoButton = project.demo && project.demo.disabled
      ? "<button class=\"project-cta disabled\" type=\"button\" disabled title=\"" + escapeAttribute(project.demo.tooltip) + "\">Live Demo <i class=\"fas fa-arrow-right\"></i></button>"
      : "<a class=\"project-cta\" href=\"" + escapeAttribute(project.demo.url) + "\" target=\"_blank\" rel=\"noopener\">Live Demo <i class=\"fas fa-arrow-right\"></i></a>";

    return [
      "<article class=\"project-card reveal-item\" style=\"--project-gradient:" + escapeAttribute(project.gradient) + "; --reveal-delay:" + (index % 3) * 100 + "ms\">",
      "<div class=\"project-banner\">",
      "<span>" + escapeHtml(project.categoryLabel) + "</span>",
      "<i class=\"fas fa-project-diagram\" aria-hidden=\"true\"></i>",
      "</div>",
      "<div class=\"project-body\">",
      "<p class=\"project-kicker\">" + escapeHtml(project.categoryLabel) + "</p>",
      "<h3>" + escapeHtml(project.title) + "</h3>",
      "<h4>" + escapeHtml(project.subtitle) + "</h4>",
      "<p class=\"project-description\">" + escapeHtml(project.description) + "</p>",
      "<details class=\"project-details\">",
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
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var button = form.querySelector("button[type=\"submit\"]");
    var status = form.querySelector(".form-status");
    var defaultText = button ? button.innerHTML : "";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!button || !status) return;

      status.textContent = "";
      status.className = "form-status";
      button.disabled = true;
      button.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> Sending";

      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        window.setTimeout(function () {
          status.textContent = "Formspree is wired in. Replace YOUR_FORM_ID with the live Formspree form ID before deployment.";
          status.classList.add("error");
          button.disabled = false;
          button.innerHTML = defaultText;
        }, 350);
        return;
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) throw new Error("Form submission failed");
        form.reset();
        status.textContent = "Message sent successfully. I will get back to you soon.";
        status.classList.add("success");
      }).catch(function () {
        status.textContent = "Could not send the message right now. Please email me directly.";
        status.classList.add("error");
      }).finally(function () {
        button.disabled = false;
        button.innerHTML = defaultText;
      });
    });
  }

  function createRevealObserver(prefersReducedMotion) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return null;

    return new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  }

  function registerRevealElements(root, revealObserver, prefersReducedMotion) {
    var elements = root.querySelectorAll(".section-label, .heading, .section-sub, .about-card, .skill-panel.active .skill-chip, .project-card, .education-card, .contact-shell, .footer .box");

    elements.forEach(function (element, index) {
      if (!element.classList.contains("reveal-item")) {
        element.classList.add("reveal-item");
        element.style.setProperty("--reveal-delay", Math.min(index % 3, 2) * 100 + "ms");
      }

      if (prefersReducedMotion || !revealObserver || isElementInViewport(element)) {
        element.classList.add("is-visible");
      } else {
        revealObserver.observe(element);
      }
    });
  }

  function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.94 && rect.bottom > window.innerHeight * 0.04;
  }

  function updateHeroCount(selector, count) {
    var target = document.querySelector(selector);
    if (target) target.textContent = String(count);
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
