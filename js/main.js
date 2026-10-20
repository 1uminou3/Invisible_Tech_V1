document.addEventListener("DOMContentLoaded", () => {
    const languageToggle = document.getElementById("homeLanguageToggle");
    const translations = {
        en: {
            title: "Invisible Tech | Acoustic & Heat Eye Mask",
            description: "Discover the Acoustic & Heat Eye Mask from Invisible Tech, designed around comfort, personal sound, and everyday rest.",
            announcement: "Acoustic & Heat Eye Mask · Thoughtful comfort for everyday moments",
            navProducts: "Eye Mask",
            navAbout: "About",
            heroTitle: "Thoughtful comfort,<br>designed for everyday.",
            heroDescription: "A considered blend of lightweight design, gentle warmth, personal sound, and light shielding.",
            heroExplore: "View the eye mask",
            heroNote: "Designed for your everyday<br><strong>Invisible Tech</strong>",
            visualCaption: "ACOUSTIC &amp; HEAT<br><strong>PERSONAL EYE MASK</strong>",
            collectionTitle: "Discover the eye mask",
            collectionDescription: "Explore the product design, thoughtful details, and color options.",
            colorBlue: "Astra Blue",
            productName: "Acoustic &amp; Heat Eye Mask",
            storyTitle: "Comfort, thoughtfully<br>designed.",
            storyCopy: "Lightweight comfort, gentle warmth, personal sound, and 99.9% light shielding.",
            featureOne: "Super-light design",
            featureTwo: "Gentle warmth · 40°C / 45°C / 50°C",
            featureThree: "Bluetooth personal sound",
            featureFour: "99.9% light shielding",
            footerTagline: "© Invisible Tech. Designed for your everyday.",
            footerExplore: "Explore",
            footerProduct: "Acoustic & Heat Eye Mask",
            footerAbout: "About Invisible Tech",
            footerTop: "Back to top ↑",
            footerFollow: "Follow us",
            mainNav: "Main navigation",
            heroVisual: "Acoustic & Heat Eye Mask",
            footerNav: "Footer navigation"
        },
        zh: {
            title: "Invisible Tech｜聲熱眼罩",
            description: "探索 Invisible Tech 聲熱眼罩，結合舒適、個人音訊與日常休息體驗。",
            announcement: "聲熱眼罩 · 為日常時刻帶來貼心舒適",
            navProducts: "聲熱眼罩",
            navAbout: "關於我們",
            heroTitle: "貼心舒適，<br>為日常而設。",
            heroDescription: "結合輕巧設計、溫熱功能、個人音訊與遮光體驗。",
            heroExplore: "探索聲熱眼罩",
            heroNote: "為你的日常而設計<br><strong>Invisible Tech</strong>",
            visualCaption: "聲熱眼罩<br><strong>個人舒適體驗</strong>",
            collectionTitle: "探索聲熱眼罩",
            collectionDescription: "認識產品設計、細緻特色與精選色系。",
            colorBlue: "極光藍",
            productName: "聲熱眼罩",
            storyTitle: "為舒適體驗，<br>細心設計。",
            storyCopy: "輕巧舒適、溫熱功能、個人音訊與 99.9% 遮光體驗。",
            featureOne: "超輕巧設計",
            featureTwo: "溫熱功能 · 40°C / 45°C / 50°C",
            featureThree: "藍牙個人音訊",
            featureFour: "99.9% 遮光",
            footerTagline: "© Invisible Tech。為你的日常而設計。",
            footerExplore: "探索",
            footerProduct: "聲熱眼罩產品體驗",
            footerAbout: "關於 Invisible Tech",
            footerTop: "返回頁首 ↑",
            footerFollow: "追蹤我們",
            mainNav: "主要導覽",
            heroVisual: "聲熱眼罩",
            footerNav: "頁尾導覽"
        }
    };
    let language = "en";

    if (!languageToggle) {
        return;
    }

    const setLanguage = (nextLanguage) => {
        language = nextLanguage;
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = translations[language].title;
        document.querySelector('meta[name="description"]').content = translations[language].description;
        document.querySelectorAll("[data-home-i18n]").forEach((element) => {
            const key = element.dataset.homeI18n;
            element.innerHTML = translations[language][key];
        });
        document.querySelectorAll("[data-home-aria]").forEach((element) => {
            const key = element.dataset.homeAria;
            element.setAttribute("aria-label", translations[language][key]);
        });
        languageToggle.textContent = language === "en" ? "中文" : "EN";
        languageToggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
    };

    languageToggle.addEventListener("click", () => setLanguage(language === "en" ? "zh" : "en"));
    setLanguage("en");
});
