/* 昼夜、菜单、手记弹层、联络草稿。文案在 index.html。 */
(function () {
  const THEME_KEY = "chenlu-theme";

  function boot(name, fn) {
    try {
      fn();
    } catch (err) {
      console.error(name, err);
    }
  }

  function savedTheme() {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return value === "day" || value === "night" ? value : null;
    } catch (err) {
      return null;
    }
  }

  function isNight() {
    return document.documentElement.dataset.theme === "night";
  }

  function initTheme() {
    const button = document.getElementById("theme-toggle");
    const status = document.getElementById("theme-status");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!button) return;

    function sync(announce) {
      const night = isNight();
      button.setAttribute("aria-pressed", night ? "true" : "false");
      button.setAttribute("aria-label", night ? "切换到白天。当前是夜晚。" : "切换到夜晚。当前是白天。");
      if (meta) meta.setAttribute("content", night ? "#1a2b20" : "#5f9a3c");
      if (announce && status) status.textContent = night ? "已切换到夜晚。" : "已切换到白天。";
      if (window.FarmScene) window.FarmScene.refresh();
    }

    sync(false);

    button.addEventListener("click", () => {
      if (isNight()) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.dataset.theme = "night";
      try {
        localStorage.setItem(THEME_KEY, isNight() ? "night" : "day");
      } catch (err) {
        /* 记不住时，这次切换仍然生效 */
      }
      sync(true);
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (savedTheme()) return;
      if (mq.matches) document.documentElement.dataset.theme = "night";
      else document.documentElement.removeAttribute("data-theme");
      sync(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", followSystem);
    else if (mq.addListener) mq.addListener(followSystem);
  }

  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    const header = document.querySelector(".site-header");
    if (!toggle || !nav) return;
    const label = toggle.querySelector(".nav-toggle-text");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) label.textContent = open ? "关闭" : "菜单";
    }

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setOpen(false);
    });

    const links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => {
          const on = link.getAttribute("href") === "#" + visible.target.id;
          if (on) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.1, 0.3, 0.6] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function initDialog() {
    const dialog = document.getElementById("project-dialog");
    const closeBtn = document.getElementById("dialog-close");
    const title = document.getElementById("dialog-title");
    const body = document.getElementById("dialog-body");
    if (!dialog || !closeBtn || !title || !body) return;
    let opener = null;

    document.querySelectorAll("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", () => {
        const source = document.getElementById(button.getAttribute("data-open-detail"));
        const card = button.closest(".project-card");
        if (!source || !card) return;
        title.textContent = card.querySelector("h3").textContent;
        body.replaceChildren();
        const clone = source.cloneNode(true);
        clone.removeAttribute("id");
        clone.hidden = false;
        body.appendChild(clone);
        opener = button;
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener("click", () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && typeof dialog.close === "function") dialog.close();
    });

    dialog.addEventListener("close", () => {
      if (opener) opener.focus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !dialog.open) return;
      const items = dialog.querySelectorAll("button, [href], textarea, input, select, [tabindex]:not([tabindex='-1'])");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initContact() {
    const lines = document.querySelectorAll("#contact-lines li");
    const empty = document.getElementById("contact-empty");
    if (lines.length && empty) empty.hidden = true;

    const form = document.getElementById("note-form");
    const status = document.getElementById("note-status");
    const draft = document.getElementById("draft-output");
    const draftWrap = document.getElementById("draft-wrap");
    const message = document.getElementById("note-message");
    if (!form || !status || !draft || !message) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("note-name").value.trim();
      const text = message.value.trim();
      if (!text) {
        message.setAttribute("aria-invalid", "true");
        status.textContent = "先写下想说的话，再复制。这一页不会把草稿寄出去。";
        message.focus();
        return;
      }
      message.removeAttribute("aria-invalid");
      const who = name ? "我是" + name + "。\n\n" : "";
      const body = "你好，\n" + who + text + "\n";
      if (draftWrap) draftWrap.hidden = false;
      draft.value = body;
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(body);
          copied = true;
        }
      } catch (err) {
        copied = false;
      }
      if (!copied) {
        draft.focus();
        draft.select();
        status.textContent = "还没有寄出，也没能自动复制。草稿已放在下面，请按 Ctrl+C 或 ⌘C。";
        return;
      }
      status.textContent = "还没有寄出。草稿已复制，请贴到你自己的邮件或聊天里。";
    });
  }

  boot("scene", () => window.FarmScene && window.FarmScene.start());
  boot("garden", () => window.FarmGarden && window.FarmGarden.init());
  boot("theme", initTheme);
  boot("nav", initNav);
  boot("dialog", initDialog);
  boot("contact", initContact);
})();
