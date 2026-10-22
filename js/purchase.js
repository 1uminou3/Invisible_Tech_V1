document.addEventListener("DOMContentLoaded", () => {
    const translations = {
        en: {
            pageTitle: "Choose your product | Invisible Tech",
            description: "Choose a color and quantity for your Invisible Tech product, then check out securely with Stripe.",
            navProducts: "Product", navAbout: "About us", menuKicker: "PRODUCT SERIES", menuSeries: "Sleeping Wellness",
            menuEyeMask: "Eye Mask", menuTravelPillow: "Travel Pillow", menuSleepPillow: "Sleep Pillow", menuComing: "More comfort, coming soon.",
            back: "Back to the collection", errorTitle: "That product isn’t available here.",
            errorCopy: "Please return to the collection and choose a product to continue.", explore: "Explore the collection",
            artIndex: "INVISIBLE TECH · OBJECT STUDY 01", eyebrow: "A THOUGHTFUL CHOICE",
            chooseProduct: "Choose your product", description: "Find the finish that feels like yours, then choose how many to add to your bag.",
            colorLabel: "COLOR", quantityLabel: "QUANTITY", decrease: "Decrease quantity", increase: "Increase quantity",
            subtotal: "Estimated subtotal", addToBag: "Add to bag",
            demoNote: "Secure payment is handled by Stripe. Shipping address and phone number are collected at checkout.",
            checkoutSuccessTitle: "Checkout complete.",
            checkoutSuccessCopy: "Your payment is being verified securely. We’ll confirm the order once verification is complete.",
            checkoutCancelledTitle: "Your checkout was cancelled.",
            checkoutCancelledCopy: "Your bag is still saved, and you can return to checkout whenever you are ready.",
            returnToBag: "Return to your bag", shoppingDetails: "Shopping details",
            stepOne: "01 — CHOOSE A COLOR", stepTwo: "02 — FIND YOUR QUANTITY", stepThree: "03 — REVIEW YOUR BAG",
            colors: { "Astra Blue": "Astra Blue", "Soft Nude": "Soft Nude", "Graphite Grey": "Graphite Grey", Cloud: "Cloud", "Soft Sand": "Soft Sand", Slate: "Slate", "Mist Blue": "Mist Blue" }
        },
        zh: {
            pageTitle: "選擇產品｜Invisible Tech",
            description: "選擇 Invisible Tech 產品的顏色和數量，再透過 Stripe 安全結帳。",
            navProducts: "產品", navAbout: "關於我們", menuKicker: "產品系列", menuSeries: "睡眠健康系列",
            menuEyeMask: "聲熱眼罩", menuTravelPillow: "旅行枕", menuSleepPillow: "睡眠枕", menuComing: "更多舒適好物，敬請期待。",
            back: "返回產品系列", errorTitle: "目前無法選擇此產品。",
            errorCopy: "請返回產品系列並選擇產品以繼續。", explore: "探索產品系列",
            artIndex: "INVISIBLE TECH · 產品概念 01", eyebrow: "為你細心挑選",
            chooseProduct: "選擇產品", description: "挑選喜歡的顏色，再選擇加入購物袋的數量。",
            colorLabel: "顏色", quantityLabel: "數量", decrease: "減少數量", increase: "增加數量",
            subtotal: "預計小計", addToBag: "加入購物袋",
            demoNote: "付款由 Stripe 安全處理，並於結帳時收集送貨地址及電話號碼。",
            checkoutSuccessTitle: "結帳完成。",
            checkoutSuccessCopy: "付款正在安全驗證中，驗證完成後我們會確認訂單。",
            checkoutCancelledTitle: "結帳已取消。",
            checkoutCancelledCopy: "購物袋內容已保留，準備好後可再次前往結帳。",
            returnToBag: "返回購物袋", shoppingDetails: "購物資訊",
            stepOne: "01 — 選擇顏色", stepTwo: "02 — 選擇數量", stepThree: "03 — 查看購物袋",
            colors: { "Astra Blue": "極光藍", "Soft Nude": "柔霧裸色", "Graphite Grey": "石墨灰", Cloud: "雲朵白", "Soft Sand": "柔沙色", Slate: "石板灰", "Mist Blue": "霧藍色" }
        }
    };
    const languageToggle = document.getElementById("purchaseLanguageToggle");
    const setStaticLanguage = (language) => {
        const copy = translations[language];
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = copy.pageTitle;
        document.querySelector('meta[name="description"]').content = copy.description;
        document.querySelectorAll("[data-purchase-text]").forEach((element) => {
            const value = copy[element.dataset.purchaseText];
            if (value !== undefined) element.textContent = value;
        });
        document.querySelectorAll("[data-purchase-aria]").forEach((element) => {
            element.setAttribute("aria-label", copy[element.dataset.purchaseAria]);
        });
        languageToggle.setAttribute("aria-label", language === "zh" ? "切換至英文" : "Switch to Chinese");
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
        languageToggle.textContent = language === "zh" ? "EN" : "中文";
    };
    languageToggle.addEventListener("click", () => {
        const language = window.siteLanguage.get();
        window.siteLanguage.set(language === "en" ? "zh" : "en");
    });
    window.siteLanguage.subscribe(setStaticLanguage);
    setStaticLanguage(window.siteLanguage.get());
    const checkoutStatus = new URLSearchParams(window.location.search).get("checkout");
    if (checkoutStatus === "success" || checkoutStatus === "cancelled") {
        const checkoutResult = document.getElementById("checkoutResult");
        const updateCheckoutResult = (language) => {
            const copy = translations[language];
            document.title = checkoutStatus === "success"
                ? `${copy.checkoutSuccessTitle} | Invisible Tech`
                : `${copy.checkoutCancelledTitle} | Invisible Tech`;
            document.getElementById("checkoutResultTitle").textContent = checkoutStatus === "success"
                ? copy.checkoutSuccessTitle
                : copy.checkoutCancelledTitle;
            document.getElementById("checkoutResultCopy").textContent = checkoutStatus === "success"
                ? copy.checkoutSuccessCopy
                : copy.checkoutCancelledCopy;
            document.getElementById("returnToBag").textContent = copy.returnToBag;
        };
        checkoutResult.hidden = false;
        document.getElementById("purchaseLayout").hidden = true;
        document.querySelector(".purchase-afterword").hidden = true;
        document.querySelector(".purchase-back").hidden = true;
        document.getElementById("returnToBag").hidden = checkoutStatus !== "cancelled";
        updateCheckoutResult(window.siteLanguage.get());
        window.siteLanguage.subscribe(updateCheckoutResult);
        return;
    }
    const productId = new URLSearchParams(window.location.search).get("product");
    const product = Object.prototype.hasOwnProperty.call(window.shopProducts, productId) ? window.shopProducts[productId] : undefined;
    const layout = document.getElementById("purchaseLayout");
    if (!product) {
        layout.hidden = true;
        document.getElementById("purchaseError").hidden = false;
        document.querySelector(".purchase-afterword").hidden = true;
        return;
    }

    const image = document.getElementById("purchaseImage");
    const colorName = document.getElementById("purchaseColorName");
    const colorLabel = document.getElementById("purchaseColorLabel");
    const colorsContainer = document.getElementById("purchaseColors");
    const quantityInput = document.getElementById("purchaseQuantity");
    const total = document.getElementById("purchaseTotal");
    let selectedColor = product.colors[0];
    let imageChangeTimer;

    image.src = selectedColor.image;

    const getQuantity = () => {
        const quantity = Number(quantityInput.value);
        return Number.isInteger(quantity) ? Math.min(99, Math.max(1, quantity)) : 1;
    };

    const updateTotal = () => {
        const safeQuantity = getQuantity();
        total.textContent = `HKD ${(product.price * safeQuantity).toLocaleString("en-HK")}`;
    };

    const setLanguage = (language) => {
        const copy = translations[language];
        const title = productId === "mask" ? (language === "zh" ? "聲熱眼罩" : "Acoustic & Heat Eye Mask")
            : productId === "travel" ? (language === "zh" ? "旅行枕" : "Travel Pillow")
                : (language === "zh" ? "睡眠枕" : "Sleep Pillow");
        setStaticLanguage(language);
        document.title = `${title} | ${language === "zh" ? "選擇產品" : "Choose your product"} | Invisible Tech`;
        document.getElementById("purchaseTitle").textContent = title;
        document.getElementById("purchasePrice").textContent = `HKD ${product.price.toLocaleString("en-HK")}`;
        colorName.textContent = copy.colors[selectedColor.name];
        colorLabel.textContent = copy.colors[selectedColor.name].toUpperCase();
        image.alt = `${title} · ${copy.colors[selectedColor.name]}`;
        colorsContainer.setAttribute("aria-label", language === "zh" ? "選擇顏色" : "Choose a color");
        colorsContainer.querySelectorAll(".purchase-color").forEach((button) => {
            button.setAttribute("aria-label", copy.colors[button.dataset.color]);
        });
        document.getElementById("quantityDecrease").setAttribute("aria-label", copy.decrease);
        document.getElementById("quantityIncrease").setAttribute("aria-label", copy.increase);
        updateTotal();
    };

    const normalizeQuantity = () => {
        quantityInput.value = String(getQuantity());
        updateTotal();
    };

    product.colors.forEach((color, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `purchase-color${index === 0 ? " is-active" : ""}`;
        button.dataset.color = color.name;
        button.setAttribute("aria-pressed", String(index === 0));
        const swatchImage = document.createElement("img");
        swatchImage.src = color.image;
        swatchImage.alt = "";
        button.append(swatchImage);
        button.addEventListener("click", () => {
            selectedColor = color;
            image.classList.add("is-changing");
            window.clearTimeout(imageChangeTimer);
            imageChangeTimer = window.setTimeout(() => {
                image.src = color.image;
                const currentCopy = translations[window.siteLanguage.get()];
                const title = document.getElementById("purchaseTitle").textContent;
                image.alt = `${title} · ${currentCopy.colors[color.name]}`;
                colorName.textContent = currentCopy.colors[color.name];
                colorLabel.textContent = currentCopy.colors[color.name].toUpperCase();
                image.classList.remove("is-changing");
            }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150);
            colorsContainer.querySelectorAll(".purchase-color").forEach((swatch) => {
                const active = swatch === button;
                swatch.classList.toggle("is-active", active);
                swatch.setAttribute("aria-pressed", String(active));
            });
        });
        colorsContainer.append(button);
    });

    quantityInput.addEventListener("input", updateTotal);
    quantityInput.addEventListener("change", normalizeQuantity);
    quantityInput.addEventListener("blur", normalizeQuantity);
    document.getElementById("quantityDecrease").addEventListener("click", () => {
        quantityInput.value = String(getQuantity() - 1);
        normalizeQuantity();
    });
    document.getElementById("quantityIncrease").addEventListener("click", () => {
        quantityInput.value = String(getQuantity() + 1);
        normalizeQuantity();
    });
    document.getElementById("addToBag").addEventListener("click", () => {
        normalizeQuantity();
        window.dispatchEvent(new CustomEvent("shop:add-to-bag", {
            detail: { productId, color: selectedColor.name, quantity: getQuantity() }
        }));
    });
    window.siteLanguage.subscribe(setLanguage);
    setLanguage(window.siteLanguage.get());
    updateTotal();
});
