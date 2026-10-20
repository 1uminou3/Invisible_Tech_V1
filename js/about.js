document.addEventListener("DOMContentLoaded", () => {
    const languageToggle = document.getElementById("aboutLanguageToggle");
    const translations = {
        en: {
            title: "About Invisible Tech",
            description: "Learn about Invisible Tech, a university-supported innovator in smart audio, IoT, and products designed to improve everyday well-being.",
            navProducts: "Eye Mask",
            navAbout: "About",
            heroEyebrow: "ABOUT INVISIBLE TECH",
            heroTitle: "Technology for<br>better everyday living.",
            heroDescription: "Invisible Tech is a university-supported technology innovator focused on smart audio, IoT, and solutions that support human well-being.",
            heroCta: "Explore our Acoustic &amp; Heat Eye Mask",
            missionEyebrow: "OUR MISSION",
            missionTitle: "Technology with purpose",
            missionCopyOne: "We bring IoT and audio technology into thoughtfully designed products to support quality of life, health, and well-being.",
            missionCopyTwo: "Our work spans research and development, production, and distribution. We consider ESG priorities and social needs, including opportunities to engage older and social-enterprise workforces.",
            valuesEyebrow: "HOW WE WORK",
            valuesTitle: "Core values",
            valueOneTitle: "Customization",
            valueOneCopy: "We adapt products to the needs, preferences, and conditions of the people who use them.",
            valueTwoTitle: "Performance",
            valueTwoCopy: "We aim for dependable performance and thoughtful value in the solutions we develop.",
            valueThreeTitle: "Innovation",
            valueThreeCopy: "We bring together audio, AI, and smart IoT capabilities to create useful experiences.",
            productEyebrow: "OUR PRODUCT",
            productTitle: "Acoustic &amp; Heat Eye Mask",
            productCopy: "A personal eye mask bringing together lightweight comfort, gentle warming, personal sound, and 99.9% light shielding.",
            productLink: "Explore the product experience",
            footerTagline: "© Invisible Tech. Designed for your everyday.",
            footerExplore: "Explore",
            footerProduct: "Product collection",
            footerAbout: "About Invisible Tech",
            footerTop: "Back to top ↑",
            footerFollow: "Follow us",
            mainNav: "Main navigation",
            footerNav: "Footer navigation"
        },
        zh: {
            title: "關於 Invisible Tech",
            description: "認識 Invisible Tech：以智能音訊、物聯網及改善日常生活體驗為重點的大學支持科技創新企業。",
            navProducts: "聲熱眼罩",
            navAbout: "關於我們",
            heroEyebrow: "關於 INVISIBLE TECH",
            heroTitle: "以科技創新，<br>改善日常生活。",
            heroDescription: "Invisible Tech 是一間獲大學支持的科技創新企業，專注智能音訊、物聯網及促進身心健康的方案。",
            heroCta: "探索聲熱眼罩",
            missionEyebrow: "我們的使命",
            missionTitle: "以科技實踐使命",
            missionCopyOne: "我們將物聯網與音訊科技融入精心設計的產品，致力提升生活質素、健康與身心福祉。",
            missionCopyTwo: "業務涵蓋研發、生產及產品分銷，並關注 ESG 及社會需要，包括支持社會企業及年長人士就業。",
            valuesEyebrow: "我們的理念",
            valuesTitle: "核心價值",
            valueOneTitle: "度身訂造",
            valueOneCopy: "按使用者的需要、喜好及實際情況，靈活設計產品。",
            valueTwoTitle: "卓越效能",
            valueTwoCopy: "致力提供可靠效能，並兼顧方案的實用價值。",
            valueThreeTitle: "創新",
            valueThreeCopy: "結合音訊、人工智能與智能物聯網技術，創造實用體驗。",
            productEyebrow: "我們的產品",
            productTitle: "聲熱眼罩",
            productCopy: "個人眼罩結合輕巧舒適、溫熱功能、個人音訊及 99.9% 遮光體驗。",
            productLink: "探索產品體驗",
            footerTagline: "© Invisible Tech。為你的日常而設計。",
            footerExplore: "探索",
            footerProduct: "產品總覽",
            footerAbout: "關於 Invisible Tech",
            footerTop: "返回頁首 ↑",
            footerFollow: "追蹤我們",
            mainNav: "主要導覽",
            footerNav: "頁尾導覽"
        }
    };
    let language = "en";

    if (!languageToggle) {
        return;
    }

    languageToggle.addEventListener("click", () => {
        language = language === "en" ? "zh" : "en";
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = translations[language].title;
        document.querySelector('meta[name="description"]').content = translations[language].description;
        document.querySelectorAll("[data-about-i18n]").forEach((element) => {
            element.innerHTML = translations[language][element.dataset.aboutI18n];
        });
        document.querySelectorAll("[data-about-aria]").forEach((element) => {
            element.setAttribute("aria-label", translations[language][element.dataset.aboutAria]);
        });
        languageToggle.textContent = language === "en" ? "中文" : "EN";
        languageToggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
    });
});
