import html from "MWL@2026:DOM/ShadowTemplate/parsers/html";

const root = document.documentElement;
root.classList.add( localStorage.getItem("color-scheme") ?? 'dark-mode');

const btn = html`<span class="color-scheme-gui-btn"></span>`;

btn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark-mode');
    root.classList.toggle('light-mode');

    localStorage.setItem("color-scheme", isDark ? 'dark-mode' : 'light-mode');
});

document.body.append(btn);

// force module recognition to avoid "Cannot redeclare block-scoped variable" error.
export {}