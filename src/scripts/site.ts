// Small enhancements shared by every page: mobile menu, copy buttons, tabs and the theme switch.
// The pages work without JavaScript; these only add convenience.

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
}

// Mobile navigation
const nav = document.querySelector<HTMLElement>('[data-nav]');
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
toggle?.addEventListener('click', () => {
  const open = nav?.dataset.open !== 'true';
  if (nav) nav.dataset.open = String(open);
  toggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.dataset.open === 'true') {
    nav.dataset.open = 'false';
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus();
  }
});

// Copy buttons: data-copy holds the text, or data-copy-target the id of an element to copy from
document.addEventListener('click', async (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('[data-copy], [data-copy-target]');
  if (!btn) return;
  const target = btn.dataset.copyTarget ? document.getElementById(btn.dataset.copyTarget) : null;
  const text = btn.dataset.copy ?? target?.innerText ?? '';
  try {
    await navigator.clipboard.writeText(text.trim());
  } catch {
    return;
  }
  const label = btn.querySelector('[data-copy-label]');
  const before = label?.textContent;
  btn.dataset.copied = 'true';
  if (label) label.textContent = 'Copied';
  btn.setAttribute('aria-label', 'Copied');
  setTimeout(() => {
    btn.dataset.copied = 'false';
    if (label && before) label.textContent = before;
    btn.setAttribute('aria-label', 'Copy to clipboard');
  }, 1600);
});

// Tabs (WAI-ARIA tabs pattern). A tab group can remember its choice with data-tabs-key.
for (const group of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
  const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const key = group.dataset.tabsKey;
  const select = (tab: HTMLButtonElement, focus = false) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !on;
    }
    if (focus) tab.focus();
    if (key) storageSet(`shot-tab-${key}`, tab.dataset.tab ?? null);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let j = -1;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j >= 0) {
        e.preventDefault();
        select(tabs[j], true);
      }
    });
  });
  const hash = location.hash.slice(1);
  const fromHash = tabs.find((t) => t.dataset.tab === hash);
  const saved = key ? tabs.find((t) => t.dataset.tab === storageGet(`shot-tab-${key}`)) : undefined;
  if (fromHash) select(fromHash);
  else if (saved) select(saved);
}

// Theme switch: system (no attribute), light or dark
const root = document.documentElement;
const switches = document.querySelectorAll<HTMLButtonElement>('[data-theme-value]');
const showTheme = () => {
  const current = root.getAttribute('data-theme') ?? 'system';
  switches.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeValue === current)));
};
switches.forEach((b) =>
  b.addEventListener('click', () => {
    const v = b.dataset.themeValue;
    if (v === 'light' || v === 'dark') {
      root.setAttribute('data-theme', v);
      storageSet('shot-theme', v);
    } else {
      root.removeAttribute('data-theme');
      storageSet('shot-theme', null);
    }
    showTheme();
  }),
);
showTheme();
