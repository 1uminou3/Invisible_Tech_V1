document.addEventListener("DOMContentLoaded", () => {
    const languageToggle = document.getElementById("pillowLanguage");
    const image = document.getElementById("pillowImage");
    const signatureImage = document.getElementById("signatureImage");
    const colorName = document.getElementById("pillowColorName");
    const art = document.querySelector(".pillow-art");
    const signatureArt = document.querySelector(".signature-art");
    const colorWord = document.getElementById("pillowColorWord");
    const product = document.body.dataset.product;
    const copy = {
        en: {
            navProducts: "Product",
            navAbout: "About us",
            buyLabel: "BUY",
            home: "Home",
            series: "SLEEPING WELLNESS",
            designEyebrow: "THE DESIGN",
            signatureEyebrow: "YOUR SIGNATURE",
            signatureTitle: "A palette of your own.",
            signatureCopy: "Explore concept colors for this upcoming product. Final color options will be announced closer to launch.",
            summaryEyebrow: "MADE FOR MORE",
            travelName: "Travel Pillow",
            sleepName: "Sleep Pillow",
            eyebrow: "SLEEPING WELLNESS · COMING SOON",
            preview: "CONCEPT PREVIEW",
            travelTitle: "Comfort, for the in-between moments.",
            sleepTitle: "Make room for a softer landing.",
            travelDescription: "A preview of our upcoming Travel Pillow. Product details will be shared soon.",
            sleepDescription: "A preview of our upcoming Sleep Pillow. Product details will be shared soon.",
            palette: "Preview palette",
            notice: "Concept artwork for preview only. Final product imagery and details will be added before launch.",
            back: "Explore the collection",
            comingTitle: "A little more comfort, coming soon.",
            comingCopy: "We’re preparing the full product story. Check back soon for more details.",
            otherProduct: product === "travel" ? "Meet the Sleep Pillow" : "Meet the Travel Pillow",
            footerTagline: "© Invisible Tech. Designed for your everyday.",
            footerExplore: "Explore",
            footerFollow: "Follow us",
            footerTop: "Back to top ↑",
            travelPageTitle: "Travel Pillow | Invisible Tech",
            sleepPageTitle: "Sleep Pillow | Invisible Tech",
            travelMeta: "Preview the upcoming Invisible Tech Travel Pillow. Product details will be shared soon.",
            sleepMeta: "Preview the upcoming Invisible Tech Sleep Pillow. Product details will be shared soon."
        },
        zh: {
            navProducts: "產品",
            navAbout: "關於我們",
            buyLabel: "購買",
            home: "首頁",
            series: "睡眠健康系列",
            designEyebrow: "產品設計",
            signatureEyebrow: "專屬色彩",
            signatureTitle: "選一種喜歡的色彩。",
            signatureCopy: "預覽這款即將推出產品的概念色系，正式顏色選擇將於推出前公布。",
            summaryEyebrow: "為更多美好而設",
            travelName: "旅行枕",
            sleepName: "睡眠枕",
            eyebrow: "睡眠健康系列 · 即將推出",
            preview: "概念預覽",
            travelTitle: "旅途之間，也有舒適相伴。",
            sleepTitle: "為柔軟休息，留一個位置。",
            travelDescription: "旅行枕即將推出，更多產品資訊將於稍後公布。",
            sleepDescription: "睡眠枕即將推出，更多產品資訊將於稍後公布。",
            palette: "預覽色系",
            notice: "此為概念預覽圖，正式產品圖片與詳細資訊將於推出前更新。",
            back: "探索產品系列",
            comingTitle: "更多舒適好物，敬請期待。",
            comingCopy: "完整產品介紹正在準備中，敬請留意最新消息。",
            otherProduct: product === "travel" ? "認識睡眠枕" : "認識旅行枕",
            footerTagline: "© Invisible Tech。為你的日常而設計。",
            footerExplore: "探索",
            footerFollow: "追蹤我們",
            footerTop: "返回頁首 ↑",
            travelPageTitle: "旅行枕｜Invisible Tech",
            sleepPageTitle: "睡眠枕｜Invisible Tech",
            travelMeta: "預覽即將推出的 Invisible Tech 旅行枕，更多產品資訊將於稍後公布。",
            sleepMeta: "預覽即將推出的 Invisible Tech 睡眠枕，更多產品資訊將於稍後公布。"
        }
    };
    let language = window.siteLanguage.get();
    let imageChangeTimer;

    const setLanguage = (nextLanguage) => {
        language = nextLanguage;
        const strings = copy[language];
        const pageKey = product === "travel" ? "travel" : "sleep";
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = strings[`${pageKey}PageTitle`];
        document.querySelector('meta[name="description"]').content = strings[`${pageKey}Meta`];
        document.querySelectorAll("[data-pillow-text]").forEach((element) => {
            const key = element.dataset.pillowText;
            if (strings[key] !== undefined) {
                element.textContent = strings[key];
            }
        });
        document.querySelectorAll(".pillow-swatch").forEach((button) => {
            button.setAttribute("aria-label", button.dataset[`name${language === "zh" ? "Zh" : "En"}`]);
        });
        const activeSwatch = document.querySelector(".pillow-swatch.is-active");
        colorName.textContent = activeSwatch.dataset[`name${language === "zh" ? "Zh" : "En"}`];
        image.alt = activeSwatch.dataset[`alt${language === "zh" ? "Zh" : "En"}`];
        signatureImage.alt = image.alt;
        colorWord.textContent = language === "zh" ? activeSwatch.dataset.wordZh : activeSwatch.dataset.word;
        document.querySelectorAll(".site-header nav").forEach((nav) => nav.setAttribute("aria-label", language === "en" ? "Main navigation" : "主要導覽"));
        document.querySelector(".pillow-breadcrumb").setAttribute("aria-label", language === "en" ? "Breadcrumb" : "導覽路徑");
        document.querySelectorAll(".footer-navigation").forEach((nav) => nav.setAttribute("aria-label", language === "en" ? "Footer navigation" : "頁尾導覽"));
        document.querySelectorAll(".pillow-brand").forEach((brand) => brand.setAttribute("aria-label", language === "en" ? "Invisible Tech home" : "Invisible Tech 首頁"));
        languageToggle.textContent = language === "en" ? "中文" : "EN";
        languageToggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
        document.querySelector(".pillow-swatches").setAttribute("aria-label", strings.palette);
    };

    document.querySelectorAll(".pillow-swatch").forEach((button) => {
        button.addEventListener("click", () => {
            window.clearTimeout(imageChangeTimer);
            image.classList.add("is-changing");
            imageChangeTimer = window.setTimeout(() => {
                image.src = button.dataset.image;
                image.alt = button.dataset[`alt${language === "zh" ? "Zh" : "En"}`];
                signatureImage.src = button.dataset.image;
                signatureImage.alt = image.alt;
                art.dataset.color = button.dataset.color;
                signatureArt.dataset.color = button.dataset.color;
                colorName.textContent = button.dataset[`name${language === "zh" ? "Zh" : "En"}`];
                colorWord.textContent = language === "zh" ? button.dataset.wordZh : button.dataset.word;
                image.classList.remove("is-changing");
            }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160);
            document.querySelectorAll(".pillow-swatch").forEach((swatch) => {
                const selected = swatch === button;
                swatch.classList.toggle("is-active", selected);
                swatch.setAttribute("aria-pressed", String(selected));
            });
        });
    });

    languageToggle.addEventListener("click", () => window.siteLanguage.set(language === "en" ? "zh" : "en"));
    window.siteLanguage.subscribe(setLanguage);
    setLanguage(language);
});
