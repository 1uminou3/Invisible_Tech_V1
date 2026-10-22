document.addEventListener("DOMContentLoaded", () => {
    const languageToggle = document.getElementById("homeLanguageToggle");
    const heroImage = document.getElementById("heroProductImage");
    const heroVisual = document.getElementById("heroVisual");
    const heroName = document.getElementById("heroProductName");
    const heroPrice = document.getElementById("heroProductPrice");
    const heroCount = document.getElementById("heroCount");
    const heroNext = document.getElementById("heroNext");
    const heroDots = Array.from(document.querySelectorAll(".hero-dot"));
    const search = document.getElementById("productSearch");
    const products = Array.from(document.querySelectorAll(".product-item"));
    const emptyState = document.getElementById("emptyState");
    const resultsCount = document.getElementById("resultsCount");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const translations = {
        en: {
            title: "Invisible Tech | Sleeping Wellness",
            description: "Discover thoughtful comfort for sleep and travel from Invisible Tech.",
            announcement: "Sleeping Wellness · Thoughtful comfort for everyday moments",
            navProducts: "Product",
            navAbout: "About us",
            menuSeriesLabel: "PRODUCT SERIES",
            menuSeries: "Sleeping Wellness",
            menuEyeMask: "Eye Mask",
            menuTravelPillow: "Travel Pillow",
            menuSleepPillow: "Sleep Pillow",
            menuComingSoon: "More comfort, coming soon.",
            latestProducts: "LATEST PRODUCTS",
            heroTitle: "A little more comfort.",
            heroVisual: "Explore {product}",
            nextProduct: "Show next product",
            nextLabel: "NEXT",
            chooseFeatured: "Choose a featured product",
            featuredEyeMask: "Eye Mask",
            featuredTravelPillow: "Travel Pillow",
            featuredSleepPillow: "Sleep Pillow",
            collectionEyebrow: "THE COLLECTION",
            collectionTitle: "Find your kind of comfort.",
            searchLabel: "Search products",
            searchPlaceholder: "Search products",
            productSeries: "SLEEPING WELLNESS",
            productName: "Acoustic & Heat Eye Mask",
            colorBlue: "Astra Blue",
            travelPillow: "Travel Pillow",
            sleepPillow: "Sleep Pillow",
            placeholderColor: "Preview palette",
            noProducts: "No products found.",
            resultCount: "{count} product",
            footerTagline: "© Invisible Tech. Designed for your everyday.",
            footerExplore: "Explore",
            footerProduct: "Sleeping Wellness",
            footerAbout: "About Invisible Tech",
            footerTop: "Back to top ↑",
            footerFollow: "Follow us",
            mainNav: "Main navigation",
            footerNav: "Footer navigation"
        },
        zh: {
            title: "Invisible Tech｜睡眠健康系列",
            description: "探索 Invisible Tech 為休息與旅途帶來的貼心舒適產品。",
            announcement: "睡眠健康系列 · 為日常時刻帶來貼心舒適",
            navProducts: "產品",
            navAbout: "關於我們",
            menuSeriesLabel: "產品系列",
            menuSeries: "睡眠健康系列",
            menuEyeMask: "聲熱眼罩",
            menuTravelPillow: "旅行枕",
            menuSleepPillow: "睡眠枕",
            menuComingSoon: "更多舒適好物，敬請期待。",
            latestProducts: "最新產品",
            heroTitle: "為日常，多添一點舒適。",
            heroVisual: "探索{product}",
            nextProduct: "顯示下一款產品",
            nextLabel: "下一款",
            chooseFeatured: "選擇焦點產品",
            featuredEyeMask: "聲熱眼罩",
            featuredTravelPillow: "旅行枕",
            featuredSleepPillow: "睡眠枕",
            collectionEyebrow: "精選系列",
            collectionTitle: "找到適合你的舒適。",
            searchLabel: "搜尋產品",
            searchPlaceholder: "搜尋產品",
            productSeries: "睡眠健康系列",
            productName: "聲熱眼罩",
            colorBlue: "極光藍",
            travelPillow: "旅行枕",
            sleepPillow: "睡眠枕",
            placeholderColor: "預覽色系",
            noProducts: "找不到相關產品。",
            resultCount: "{count} 款產品",
            footerTagline: "© Invisible Tech。為你的日常而設計。",
            footerExplore: "探索",
            footerProduct: "睡眠健康系列",
            footerAbout: "關於 Invisible Tech",
            footerTop: "返回頁首 ↑",
            footerFollow: "追蹤我們",
            mainNav: "主要導覽",
            footerNav: "頁尾導覽"
        }
    };

    const featuredProducts = [
        {
            name: { en: "Acoustic & Heat Eye Mask", zh: "聲熱眼罩" },
            image: "assets/product-blue/Blue.png",
            alt: { en: "Acoustic & Heat Eye Mask in Astra Blue", zh: "極光藍聲熱眼罩" },
            href: "eye-mask.html",
            price: "HKD 398",
            type: "mask",
            tone: "blue"
        },
        {
            name: { en: "Travel Pillow", zh: "旅行枕" },
            image: "assets/product-travel-pillow/travel-pillow-sand.svg",
            alt: { en: "Travel Pillow product preview", zh: "旅行枕產品預覽" },
            href: "travel-pillow.html",
            price: "HKD 580",
            type: "travel",
            tone: "sand"
        },
        {
            name: { en: "Sleep Pillow", zh: "睡眠枕" },
            image: "assets/product-sleep-pillow/sleep-pillow-cloud.svg",
            alt: { en: "Sleep Pillow product preview", zh: "睡眠枕產品預覽" },
            href: "sleep-pillow.html",
            price: "HKD 1,199",
            type: "sleep",
            tone: "cloud"
        }
    ];

    let language = window.siteLanguage.get();
    let activeSlide = 0;
    let carouselTimer;
    let heroSwapTimer;

    const showSlide = (index, immediate = false) => {
        activeSlide = (index + featuredProducts.length) % featuredProducts.length;
        const product = featuredProducts[activeSlide];
        window.clearTimeout(heroSwapTimer);
        heroVisual.classList.add("is-changing");
        const update = () => {
            heroImage.src = product.image;
            heroImage.alt = product.alt[language];
            heroVisual.href = product.href;
            heroVisual.setAttribute("aria-label", translations[language].heroVisual.replace("{product}", product.name[language]));
            heroName.textContent = product.name[language];
            heroPrice.textContent = product.price;
            heroVisual.dataset.product = product.type;
            heroVisual.dataset.tone = product.tone;
            heroCount.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(featuredProducts.length).padStart(2, "0")}`;
            heroDots.forEach((dot, dotIndex) => {
                const selected = dotIndex === activeSlide;
                dot.classList.toggle("is-active", selected);
                dot.setAttribute("aria-pressed", String(selected));
                    dot.setAttribute("aria-label", translations[language][["featuredEyeMask", "featuredTravelPillow", "featuredSleepPillow"][dotIndex]]);
                });
            heroVisual.classList.remove("is-changing");
        };
        if (immediate || reducedMotion.matches) {
                update();
        } else {
                heroSwapTimer = window.setTimeout(update, 180);
        }
    };

    const startCarousel = () => {
        window.clearInterval(carouselTimer);
        if (!reducedMotion.matches && !document.hidden && !heroSection.contains(document.activeElement)) {
            carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 3000);
        }
    };

    const setLanguage = (nextLanguage) => {
        language = nextLanguage;
        const copy = translations[language];
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = copy.title;
        document.querySelector('meta[name="description"]').content = copy.description;
        document.querySelectorAll("[data-home-i18n]").forEach((element) => {
            const value = copy[element.dataset.homeI18n];
            if (value !== undefined) {
                element.textContent = value;
            }
        });
        document.querySelectorAll("[data-home-aria]").forEach((element) => {
            const value = copy[element.dataset.homeAria];
            if (value !== undefined) {
                element.setAttribute("aria-label", value);
            }
        });
        document.querySelectorAll("[data-home-placeholder]").forEach((element) => {
            element.placeholder = copy[element.dataset.homePlaceholder];
        });
        document.querySelectorAll(".product-swatch").forEach((button) => {
            const color = button.dataset[`color${language === "zh" ? "Zh" : "En"}`];
            if (color) {
                button.setAttribute("aria-label", color);
            }
        });
        document.querySelectorAll(".product-swatches").forEach((group) => {
            const product = group.closest(".product-item");
            const productName = product.querySelector("h3").textContent;
            group.setAttribute("aria-label", language === "en" ? `Choose ${productName} color` : `選擇${productName}色系`);
            const selectedSwatch = group.querySelector(".product-swatch.is-active");
            product.querySelector(".product-meta p").textContent = selectedSwatch.dataset[`color${language === "zh" ? "Zh" : "En"}`];
            product.querySelector(".product-card-link").setAttribute("aria-label", product.querySelector(".product-card-link").dataset[`link${language === "zh" ? "Zh" : "En"}`]);
        });
        heroDots.forEach((dot, index) => {
            dot.setAttribute("aria-label", copy[["featuredEyeMask", "featuredTravelPillow", "featuredSleepPillow"][index]]);
        });
        languageToggle.textContent = language === "en" ? "中文" : "EN";
        languageToggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
        heroVisual.setAttribute("aria-label", copy.heroVisual.replace("{product}", featuredProducts[activeSlide].name[language]));
        showSlide(activeSlide, true);
        updateResultCount();
    };

    const updateResultCount = () => {
        const count = products.filter((product) => !product.hidden).length;
        const plural = language === "en" && count !== 1 ? "s" : "";
        resultsCount.textContent = `${translations[language].resultCount.replace("{count}", count)}${plural}`;
        emptyState.hidden = count > 0;
    };

    heroNext.addEventListener("click", () => {
        showSlide(activeSlide + 1);
        startCarousel();
    });

    heroDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            startCarousel();
        });
    });

    const heroSection = document.querySelector(".hero-section");
    heroSection.addEventListener("mouseenter", () => window.clearInterval(carouselTimer));
    heroSection.addEventListener("mouseleave", startCarousel);
    heroSection.addEventListener("focusin", () => window.clearInterval(carouselTimer));
    heroSection.addEventListener("focusout", (event) => {
        if (!heroSection.contains(event.relatedTarget)) {
            startCarousel();
        }
    });
    document.addEventListener("visibilitychange", startCarousel);
    reducedMotion.addEventListener("change", startCarousel);

    search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase(language === "zh" ? "zh-Hant" : "en");
        products.forEach((product) => {
            const searchableText = `${product.dataset.name} ${product.textContent}`.toLocaleLowerCase(language === "zh" ? "zh-Hant" : "en");
            product.hidden = !searchableText.includes(query);
        });
        updateResultCount();
    });

    document.querySelectorAll(".product-swatch").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-item");
            const image = card.querySelector("[data-product-image]");
            image.src = button.dataset.image;
            image.alt = button.dataset[`alt${language === "zh" ? "Zh" : "En"}`];
            card.querySelector(".product-meta p").textContent = button.dataset[`color${language === "zh" ? "Zh" : "En"}`];
            card.querySelectorAll(".product-swatch").forEach((swatch) => {
                const selected = swatch === button;
                swatch.classList.toggle("is-active", selected);
                swatch.setAttribute("aria-pressed", String(selected));
            });
        });
    });

    languageToggle.addEventListener("click", () => window.siteLanguage.set(language === "en" ? "zh" : "en"));
    window.siteLanguage.subscribe(setLanguage);
    setLanguage(language);
    startCarousel();
});
