import * as monaco from "monaco-editor";

// ========================
//  Available Themes
// ========================
export const themes = {
    "vs-light": "الوضع الفاتح",
    "vs-dark": "الوضع الداكن",
    "monokai": "Monokai",
    "dracula": "Dracula",
    "solarized-dark": "Solarized Dark",
    "solarized-light": "Solarized Light",
};

// ========================
//  Custom Theme Definitions
// ========================
export function registerThemes() {

    // Monokai
    monaco.editor.defineTheme("monokai", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "75715E" },
            { token: "keyword", foreground: "F92672" },
            { token: "string", foreground: "E6DB74" },
            { token: "number", foreground: "AE81FF" },
        ],
        colors: {
            "editor.background": "#272822",
            "editor.foreground": "#F8F8F2",
        },
    });

    // Dracula
    monaco.editor.defineTheme("dracula", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#282A36",
            "editor.foreground": "#F8F8F2",
        },
    });

    // Solarized Dark
    monaco.editor.defineTheme("solarized-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#002B36",
            "editor.foreground": "#839496",
        },
    });

    // Solarized Light
    monaco.editor.defineTheme("solarized-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#FDF6E3",
            "editor.foreground": "#657B83",
        },
    });
}

// ========================
//  Set Theme
// ========================
export function applyTheme(name = "vs-dark") {
    try {
        monaco.editor.setTheme(name);
    } catch (e) {
        console.error("Theme error:", e);
    }
}
