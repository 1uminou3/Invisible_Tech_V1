(() => {
    const storageKey = "invisibletech-language";
    const listeners = new Set();
    let currentLanguage = localStorage.getItem(storageKey) || "en";

    const updateToggles = () => {
        document.querySelectorAll(".language-toggle").forEach((button) => {
            button.setAttribute("aria-label", currentLanguage === "en" ? "Switch to Chinese" : "Switch to English");
            button.setAttribute("aria-pressed", String(currentLanguage === "zh"));
            button.textContent = currentLanguage === "en" ? "中文" : "EN";
        });
    };

    if (currentLanguage !== "en" && currentLanguage !== "zh") {
        currentLanguage = "en";
    }

    const siteLanguage = {
        get() {
            return currentLanguage;
        },
        set(language) {
            if (language !== "en" && language !== "zh") {
                throw new Error(`Unsupported site language: ${language}`);
            }
            if (language === currentLanguage) {
                return;
            }
            currentLanguage = language;
            localStorage.setItem(storageKey, language);
            document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
            updateToggles();
            listeners.forEach((listener) => listener(language));
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };

    updateToggles();

    window.addEventListener("storage", (event) => {
        if (event.key === storageKey && (event.newValue === "en" || event.newValue === "zh")) {
            currentLanguage = event.newValue;
            document.documentElement.lang = currentLanguage === "zh" ? "zh-Hant" : "en";
            updateToggles();
            listeners.forEach((listener) => listener(currentLanguage));
        }
    });

    document.documentElement.lang = currentLanguage === "zh" ? "zh-Hant" : "en";
    window.siteLanguage = siteLanguage;
})();
