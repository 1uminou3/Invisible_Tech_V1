document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("synapLanguageToggle");
    const translations = {
        en: {
            title: "SyNap Flow | Sound for sleep, calm & focus",
            description: "Meet SyNap Flow: science-backed sound for sleep, calm, and focus, with 12 months of complimentary Premium for new listeners.",
            navProducts: "Product", navAbout: "About us", menuKicker: "PRODUCT SERIES",
            menuSeries: "Sleeping Wellness", menuEyeMask: "Eye Mask", menuTravelPillow: "Travel Pillow",
            menuSleepPillow: "Sleep Pillow", menuComing: "More comfort, coming soon.",
            heroEyebrow: "SOUND FOR YOUR ROUTINE", heroLead: "Science-backed sound for sleep, calm & focus.",
            heroDescription: "Choose a session, check in with how you feel, and unwind with soundscapes made for rest and attention. Not sure what to play? Answer a few questions and we’ll match a soundscape for you.",
            download: "Download on the App Store", premiumNote: "New listeners get 12 months of complimentary Premium when they create an account.",
            appIconAlt: "SyNap Flow app icon", featuresEyebrow: "YOUR SPACE TO RESET",
            featuresTitle: "A soundscape for every moment.", featureOneTitle: "Find your flow",
            featureOneCopy: "Explore 22 sessions across Sleep, Relax, Focus, and Meditation.",
            featureTwoTitle: "Settle in", featureTwoCopy: "Use the player’s sleep timer and keep audio playing in the background.",
            featureThreeTitle: "Make it yours", featureThreeCopy: "Optional mood check-ins, session history, and favourites synced to your account.",
            featureFourTitle: "Listen your way", featureFourCopy: "Enjoy a focused listening experience with dark mode.",
            premiumEyebrow: "A YEAR TO EXPLORE", premiumTitle: "12 months of Premium, complimentary.",
            premiumCopy: "Create an account to enjoy 12 months of complimentary Premium. After that, subscribe to keep access to the full library.",
            monthly: "Monthly", annual: "Annual",
            subscriptionNote: "Auto-renewing subscriptions billed through Apple. Payment is charged to your Apple ID. Subscriptions renew unless cancelled at least 24 hours before the period ends. Manage in Settings → Apple ID → Subscriptions.",
            wellnessTitle: "Wellness, not medicine.",
            wellnessCopy: "SyNap Flow is for general relaxation only. It is not a medical device and does not diagnose or treat any condition.",
            terms: "Terms of Use (EULA)", privacy: "Privacy Policy",
            footerTagline: "© Invisible Tech. Designed for your everyday.", footerExplore: "Explore",
            footerMask: "Acoustic & Heat Eye Mask", footerAbout: "About Invisible Tech",
            footerTop: "Back to top ↑", footerFollow: "Follow us",
            mainNav: "Main navigation", footerNav: "Footer navigation"
        },
        zh: {
            title: "SyNap Flow｜睡眠、放鬆與專注音景",
            description: "認識 SyNap Flow：以科學為本的睡眠、放鬆與專注音景，新用戶註冊可免費享用 12 個月 Premium。",
            navProducts: "產品", navAbout: "關於我們", menuKicker: "產品系列",
            menuSeries: "睡眠健康系列", menuEyeMask: "聲熱眼罩", menuTravelPillow: "旅行枕",
            menuSleepPillow: "睡眠枕", menuComing: "更多舒適好物，敬請期待。",
            heroEyebrow: "為日常打造的音景", heroLead: "以科學為本，陪伴睡眠、放鬆與專注。",
            heroDescription: "選擇音景、了解當下感受，透過專為休息與專注打造的聲音放鬆身心。不知道播放甚麼？回答幾個問題，讓我們為你配對合適音景。",
            download: "於 App Store 下載", premiumNote: "新用戶建立帳戶即可免費享用 12 個月 Premium。",
            appIconAlt: "SyNap Flow 應用程式圖示", featuresEyebrow: "給自己一段重整時光",
            featuresTitle: "每個時刻，都有合適音景。", featureOneTitle: "找到你的節奏",
            featureOneCopy: "探索睡眠、放鬆、專注與冥想四大類別，共 22 種音景。",
            featureTwoTitle: "安心放鬆", featureTwoCopy: "使用睡眠計時器，並可在背景播放音訊。",
            featureThreeTitle: "打造專屬體驗", featureThreeCopy: "可選擇記錄心情、聆聽紀錄與最愛音景，並同步至帳戶。",
            featureFourTitle: "隨心聆聽", featureFourCopy: "以深色模式享受專注的聆聽體驗。",
            premiumEyebrow: "免費體驗一年", premiumTitle: "免費享用 12 個月 Premium。",
            premiumCopy: "建立帳戶即可免費享用 12 個月 Premium。期滿後可訂閱，繼續使用完整音景庫。",
            monthly: "月費", annual: "年費",
            subscriptionNote: "訂閱由 Apple 自動續訂及收費，款項將從 Apple ID 扣除。除非在訂閱期結束前至少 24 小時取消，否則訂閱將自動續訂。請於「設定 → Apple ID → 訂閱項目」管理。",
            wellnessTitle: "健康體驗，並非醫療服務。",
            wellnessCopy: "SyNap Flow 只供一般放鬆用途，並非醫療器材，不會診斷或治療任何疾病。",
            terms: "使用條款（EULA）", privacy: "私隱政策",
            footerTagline: "© Invisible Tech。為你的日常而設計。", footerExplore: "探索",
            footerMask: "聲熱眼罩", footerAbout: "關於 Invisible Tech",
            footerTop: "返回頁首 ↑", footerFollow: "追蹤我們",
            mainNav: "主要導覽", footerNav: "頁尾導覽"
        }
    };

    const setLanguage = (language) => {
        const copy = translations[language];
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = copy.title;
        document.querySelector('meta[name="description"]').content = copy.description;
        document.querySelectorAll("[data-synap-text]").forEach((element) => {
            element.textContent = copy[element.dataset.synapText];
        });
        document.querySelectorAll("[data-synap-alt]").forEach((element) => {
            element.alt = copy[element.dataset.synapAlt];
        });
        document.querySelectorAll(".site-header nav").forEach((nav) => {
            nav.setAttribute("aria-label", copy.mainNav);
        });
        document.querySelectorAll(".footer-navigation").forEach((nav) => {
            nav.setAttribute("aria-label", copy.footerNav);
        });
    };

    toggle.addEventListener("click", () => {
        const language = window.siteLanguage.get();
        window.siteLanguage.set(language === "en" ? "zh" : "en");
    });
    window.siteLanguage.subscribe(setLanguage);
    setLanguage(window.siteLanguage.get());
});
