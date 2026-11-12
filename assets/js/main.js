/* =========================================================
   Portfólio — interações
   Sem dependências. Tudo é opcional: se algo falhar,
   o conteúdo continua visível e navegável.
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- Tema claro / escuro ---------- */
  const themeBtn = $('#themeToggle');
  const metaTheme = $('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#0a0c10');
  };
  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* armazenamento indisponível */ }
    });
  }

  /* ---------- Header: sombra ao rolar + botão "voltar ao topo" ---------- */
  const header = $('#header');
  const toTop = $('#toTop');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 640);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');

  const setMenu = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (header) header.classList.toggle('is-menu-open', open);
  };

  if (navToggle) navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.nav__link').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 881px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll-spy: destaca o link da seção atual e atualiza o #hash ---------- */
  const sections = $$('main section[id]');
  const links = $$('.nav__link');

  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    let current = '';
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.id === current) return;
        current = entry.target.id;
        setActive(current);
        // mantém a URL em sincronia (#home, #about…) sem empilhar histórico nem rolar a página
        if (history.replaceState) history.replaceState(null, '', '#' + current);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }
  setActive((location.hash || '#home').slice(1));

  /* ---------- Revelar elementos ao rolar ---------- */
  const revealEls = $$('[data-reveal]');

  // escalonamento sutil entre irmãos que aparecem juntos
  revealEls.forEach((el) => {
    const siblings = $$('[data-reveal]', el.parentElement).filter((n) => n.parentElement === el.parentElement);
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
  });

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        $$('[data-count]', entry.target).forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    $$('[data-count]').forEach(countUp);
  }

  /* ---------- Efeito de digitação (hero) ---------- */
  const typed = $('#typed');
  if (typed && !reduceMotion) {
    let roles = [];
    try { roles = JSON.parse(typed.dataset.roles || '[]'); } catch (e) { roles = []; }

    if (roles.length > 1) {
      let r = 0, c = 0, deleting = false;
      const step = () => {
        const word = roles[r];
        c += deleting ? -1 : 1;
        typed.textContent = word.slice(0, c);

        let delay = deleting ? 38 : 82;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 380; }
        setTimeout(step, delay);
      };
      setTimeout(step, 1800);
    }
  }

  /* ---------- Filtro de projetos ---------- */
  const filterBtns = $$('.filter');
  const projects = $$('.project');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      projects.forEach((card) => {
        const cats = (card.dataset.category || '').split(/\s+/);
        const show = f === 'all' || cats.includes(f);
        card.hidden = !show;
        card.classList.remove('is-filtered-in');
        if (show) {
          card.classList.add('is-visible');          // garante visibilidade mesmo se ainda não rolou até ele
          void card.offsetWidth;                     // reinicia a animação
          card.classList.add('is-filtered-in');
        }
      });
    });
  });

  /* ---------- Abas: Experiência / Formação ---------- */
  const tabs = $$('.tab');
  const panels = $$('.timeline[role="tabpanel"]');

  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => {
      p.hidden = p.id !== tab.getAttribute('aria-controls');
      // itens revelados ao rolar precisam aparecer ao trocar de aba
      if (!p.hidden) $$('[data-reveal]', p).forEach((el) => el.classList.add('is-visible'));
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') n = tabs[0];
      else if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- Formulário de contato (abre o app de e-mail) ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');

  const setStatus = (msg, type) => {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form__status' + (type ? ' is-' + type : '');
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      let valid = true;
      $$('.field', form).forEach((f) => f.classList.remove('has-error'));
      const flag = (fieldName) => {
        const input = form.elements[fieldName];
        if (input && input.closest('.field')) input.closest('.field').classList.add('has-error');
        valid = false;
      };
      if (!name) flag('name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) flag('email');
      if (!message) flag('message');

      if (!valid) {
        setStatus('Preencha todos os campos corretamente.', 'error');
        const firstBad = $('.has-error input, .has-error textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      const to = form.dataset.email || '';
      const subject = encodeURIComponent('Contato pelo portfólio — ' + name);
      const body = encodeURIComponent(message + '\n\n—\n' + name + '\n' + email);
      setStatus('Abrindo seu aplicativo de e-mail…', 'ok');
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
    });
  }

  /* ---------- Ano do rodapé ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
