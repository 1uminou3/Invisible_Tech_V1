(() => {
    const products = {
        mask: {
            title: "Acoustic & Heat Eye Mask",
            price: 398,
            colors: [
                { name: "Astra Blue", image: "assets/product-blue/Blue.png" },
                { name: "Soft Nude", image: "assets/product-nude/Nude.png" },
                { name: "Graphite Grey", image: "assets/product-gray/grey.png" }
            ]
        },
        sleep: {
            title: "Sleep Pillow",
            price: 1199,
            colors: [
                { name: "Cloud", image: "assets/product-sleep-pillow/sleep-pillow-cloud.svg" },
                { name: "Soft Sand", image: "assets/product-sleep-pillow/sleep-pillow-sand.svg" },
                { name: "Slate", image: "assets/product-sleep-pillow/sleep-pillow-slate.svg" }
            ]
        },
        travel: {
            title: "Travel Pillow",
            price: 580,
            colors: [
                { name: "Soft Sand", image: "assets/product-travel-pillow/travel-pillow-sand.svg" },
                { name: "Mist Blue", image: "assets/product-travel-pillow/travel-pillow-blue.svg" },
                { name: "Slate", image: "assets/product-travel-pillow/travel-pillow-slate.svg" }
            ]
        }
    };
    const storageKey = "invisibletech-shopping-bag";
    const bagCopy = {
        en: {
            title: "Your bag", close: "Close shopping bag", open: "Open shopping bag",
            product: (count) => `Open shopping bag, ${count} product${count === 1 ? "" : "s"}`,
            empty: "Your bag is waiting for something lovely.", quantity: "Quantity", remove: "Remove",
            subtotal: "Subtotal", demoNote: "Shipping address and phone number are collected securely by Stripe at checkout.",
            checkout: "Continue to secure checkout", checkoutLoading: "Connecting to secure checkout…",
            checkoutUnavailable: "Secure checkout is not configured yet. Please try again later.",
            checkoutFailed: "We could not start checkout. Your bag is still saved; please try again.",
            colors: { "Astra Blue": "Astra Blue", "Soft Nude": "Soft Nude", "Graphite Grey": "Graphite Grey", Cloud: "Cloud", "Soft Sand": "Soft Sand", Slate: "Slate", "Mist Blue": "Mist Blue" },
            products: { mask: "Acoustic & Heat Eye Mask", sleep: "Sleep Pillow", travel: "Travel Pillow" }
        },
        zh: {
            title: "你的購物袋", close: "關閉購物袋", open: "開啟購物袋",
            product: (count) => `開啟購物袋，${count} 款產品`,
            empty: "購物袋空空如也，選一件喜歡的產品吧。",
            quantity: "數量", remove: "移除", subtotal: "小計",
            demoNote: "結帳時 Stripe 會安全地收集送貨地址及電話號碼。",
            checkout: "前往安全結帳", checkoutLoading: "正在連接安全結帳…",
            checkoutUnavailable: "安全結帳尚未完成設定，請稍後再試。",
            checkoutFailed: "目前無法開始結帳。購物袋已保留，請再試一次。",
            colors: { "Astra Blue": "極光藍", "Soft Nude": "柔霧裸色", "Graphite Grey": "石墨灰", Cloud: "雲朵白", "Soft Sand": "柔沙色", Slate: "石板灰", "Mist Blue": "霧藍色" },
            products: { mask: "聲熱眼罩", sleep: "睡眠枕", travel: "旅行枕" }
        }
    };
    let language = window.siteLanguage.get();
    const bag = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    const validBag = Array.isArray(bag) && bag.every((item) =>
        item && typeof item.productId === "string" && Object.prototype.hasOwnProperty.call(products, item.productId) &&
        Number.isInteger(item.quantity) && item.quantity > 0 &&
        products[item.productId].colors.some((color) => color.name === item.color)
    );
    if (!validBag) {
        throw new Error("The shopping bag data in this browsing session is invalid.");
    }

    window.shopProducts = products;
    const bagButtons = Array.from(document.querySelectorAll("[data-bag-open]"));
    const bagCounts = Array.from(document.querySelectorAll("[data-bag-count]"));

    const money = (amount) => `HKD ${amount.toLocaleString("en-HK")}`;
    const saveBag = () => sessionStorage.setItem(storageKey, JSON.stringify(bag));
    const currentCopy = () => bagCopy[language];
    const productTitle = (productId) => currentCopy().products[productId];
    const colorLabel = (colorName) => currentCopy().colors[colorName];
    const updateBadge = () => {
        const count = new Set(bag.map((item) => item.productId)).size;
        bagCounts.forEach((badge) => {
            badge.textContent = String(count);
            badge.hidden = count === 0;
        });
        bagButtons.forEach((button) => {
            button.setAttribute("aria-label", count ? currentCopy().product(count) : currentCopy().open);
        });
    };

    const dialog = document.createElement("dialog");
    dialog.className = "bag-dialog";
    dialog.setAttribute("aria-labelledby", "bagTitle");
    dialog.innerHTML = `
        <div class="bag-panel">
            <div class="bag-heading"><h2 id="bagTitle">Your bag</h2><button class="bag-close" type="button" aria-label="Close shopping bag"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg></button></div>
            <div class="bag-items" aria-live="polite"></div>
            <div class="bag-summary"></div>
            <button class="bag-checkout" type="button">Continue to secure checkout</button>
            <p class="bag-checkout-message" role="alert" hidden></p>
        </div>`;
    document.body.append(dialog);

    const itemsContainer = dialog.querySelector(".bag-items");
    const summaryContainer = dialog.querySelector(".bag-summary");
    const checkoutMessage = dialog.querySelector(".bag-checkout-message");
    const checkoutButton = dialog.querySelector(".bag-checkout");
    const updateDialogCopy = () => {
        const copy = currentCopy();
        dialog.querySelector("#bagTitle").textContent = copy.title;
        dialog.querySelector(".bag-close").setAttribute("aria-label", copy.close);
        checkoutButton.textContent = copy.checkout;
    };
    const renderBag = () => {
        updateDialogCopy();
        itemsContainer.replaceChildren();
        checkoutMessage.hidden = true;
        checkoutMessage.textContent = "";
        checkoutButton.hidden = bag.length === 0;
        if (!bag.length) {
            const empty = document.createElement("p");
            empty.className = "bag-empty";
            empty.textContent = currentCopy().empty;
            itemsContainer.append(empty);
            summaryContainer.replaceChildren();
            return;
        }

        let subtotal = 0;
        bag.forEach((item, index) => {
            const product = products[item.productId];
            const color = product.colors.find((option) => option.name === item.color);
            const lineTotal = product.price * item.quantity;
            subtotal += lineTotal;

            const row = document.createElement("article");
            row.className = "bag-item";
            const image = document.createElement("img");
            image.src = color.image;
            image.alt = `${productTitle(item.productId)} · ${colorLabel(color.name)}`;
            const detail = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = productTitle(item.productId);
            const description = document.createElement("p");
            description.textContent = `${colorLabel(color.name)} · ${currentCopy().quantity} ${item.quantity}`;
            const remove = document.createElement("button");
            remove.className = "bag-remove";
            remove.type = "button";
            remove.textContent = currentCopy().remove;
            remove.setAttribute("aria-label", `${currentCopy().remove} ${productTitle(item.productId)}`);
            remove.addEventListener("click", () => {
                bag.splice(index, 1);
                saveBag();
                updateBadge();
                renderBag();
            });
            const price = document.createElement("span");
            price.className = "bag-item-price";
            price.textContent = money(lineTotal);
            detail.append(title, description, remove);
            row.append(image, detail, price);
            itemsContainer.append(row);
        });

        const label = document.createElement("span");
        label.textContent = currentCopy().subtotal;
        const amount = document.createElement("strong");
        amount.textContent = money(subtotal);
        const row = document.createElement("p");
        row.className = "bag-summary-row";
        row.append(label, amount);
        const note = document.createElement("p");
        note.className = "bag-summary-note";
        note.textContent = currentCopy().demoNote;
        summaryContainer.replaceChildren(row, note);

    };

    const openBag = () => {
        renderBag();
        if (!dialog.open) dialog.showModal();
    };

    const getSupabaseProjectUrl = (value) => {
        if (typeof value !== "string") return null;
        try {
            const url = new URL(value);
            if (
                url.protocol !== "https:" ||
                !/^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname) ||
                !["", "/", "/rest/v1", "/rest/v1/"].includes(url.pathname) ||
                url.search ||
                url.hash
            ) {
                return null;
            }
            return url.origin;
        } catch {
            return null;
        }
    };

    bagButtons.forEach((button) => button.addEventListener("click", openBag));
    checkoutButton.textContent = currentCopy().checkout;
    dialog.querySelector(".bag-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") dialog.close();
    });
    checkoutButton.addEventListener("click", async () => {
        const config = window.invisibleTechCheckoutConfig;
        const supabaseProjectUrl = getSupabaseProjectUrl(config?.supabaseUrl);
        if (
            !supabaseProjectUrl ||
            typeof config.supabaseAnonKey !== "string" ||
            config.supabaseAnonKey.trim().length < 20
        ) {
            checkoutMessage.textContent = currentCopy().checkoutUnavailable;
            checkoutMessage.hidden = false;
            return;
        }

        checkoutButton.disabled = true;
        checkoutButton.textContent = currentCopy().checkoutLoading;
        checkoutMessage.hidden = true;
        try {
            const response = await fetch(`${supabaseProjectUrl}/functions/v1/stripe-checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": config.supabaseAnonKey,
                    "Authorization": `Bearer ${config.supabaseAnonKey}`
                },
                body: JSON.stringify({
                    items: bag.map(({ productId, color, quantity }) => ({ productId, color, quantity }))
                })
            });
            const result = await response.json();
            if (!response.ok || typeof result.url !== "string" || !result.url.startsWith("https://checkout.stripe.com/")) {
                throw new Error("Secure checkout returned an invalid response.");
            }
            window.location.assign(result.url);
        } catch (error) {
            console.error("Could not start secure checkout:", error);
            checkoutMessage.textContent = currentCopy().checkoutFailed;
            checkoutMessage.hidden = false;
            checkoutButton.disabled = false;
            checkoutButton.textContent = currentCopy().checkout;
        }
    });
    window.siteLanguage.subscribe((nextLanguage) => {
        language = nextLanguage;
        updateBadge();
        if (dialog.open) renderBag();
    });

    const menuTrigger = document.getElementById("productMenuTrigger");
    const menuPanel = document.getElementById("productMenuPanel");
    if (menuTrigger && menuPanel) {
        const closeMenu = () => {
            menuPanel.hidden = true;
            menuTrigger.setAttribute("aria-expanded", "false");
        };
        menuTrigger.addEventListener("click", () => {
            const isOpen = menuTrigger.getAttribute("aria-expanded") === "true";
            menuPanel.hidden = isOpen;
            menuTrigger.setAttribute("aria-expanded", String(!isOpen));
        });
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".product-menu")) closeMenu();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !menuPanel.hidden) {
                closeMenu();
                menuTrigger.focus();
            }
        });
    }

    window.addEventListener("shop:add-to-bag", (event) => {
        const detail = event.detail;
        const product = detail && Object.prototype.hasOwnProperty.call(products, detail.productId) ? products[detail.productId] : undefined;
        const color = product && product.colors.find((option) => option.name === detail.color);
        if (!product || !color || !Number.isInteger(detail.quantity) || detail.quantity < 1 || detail.quantity > 99) {
            throw new Error("Cannot add this product selection to the shopping bag.");
        }
        const existing = bag.find((item) => item.productId === detail.productId && item.color === detail.color);
        if (existing) {
            existing.quantity += detail.quantity;
        } else {
            bag.push({ productId: detail.productId, color: detail.color, quantity: detail.quantity });
        }
        saveBag();
        updateBadge();
    });

    updateBadge();
})();
