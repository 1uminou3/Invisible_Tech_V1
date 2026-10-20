document.addEventListener("DOMContentLoaded", () => {
    const rotationChapter = document.getElementById("rotation");
    const rotationStage = document.getElementById("rotationStage");
    const sequenceImage = document.getElementById("sequenceImage");
    const colorChapter = document.getElementById("colors");
    const colorStage = document.getElementById("colorStage");
    const summaryChapter = document.getElementById("features");
    const summaryStage = document.getElementById("summaryStage");

    if (!rotationChapter || !rotationStage || !sequenceImage || !colorChapter || !colorStage || !summaryChapter || !summaryStage) {
        return;
    }

    const productFeatures = [
        {
            en: {
                overline: "ULTRA-LIGHT COMFORT",
                title: "Light as air.<br>Comfort all day.",
                description: "Soft, breathable padding and an ergonomic fit weigh less than 0.1 kg, made for sleep, travel, and rest.",
                value: "<100g",
                metric: "weight",
                label: "Lightweight design",
                visualLabel: "FEATHERLIGHT COMFORT"
            },
            zh: {
                overline: "超輕盈舒適",
                title: "輕若無物，<br>舒適相伴。",
                description: "柔軟透氣的厚墊搭配符合人體工學的設計，重量低於 0.1 公斤，適合睡眠、旅途與休息時佩戴。",
                value: "<100克",
                metric: "weight",
                label: "輕量化設計",
                visualLabel: "輕盈舒適，隨時相伴"
            },
            frame: 15
        },
        {
            en: {
                overline: "GENTLE EYE WARMING",
                title: "A little warmth.<br>A deeper exhale.",
                description: "Choose a gentle warming level of 40°C, 45°C, or 50°C for soothing comfort and eye relaxation.",
                value: "40°C / 45°C / 50°C",
                metric: "temperature",
                label: "Three warmth settings",
                visualLabel: "WARMTH AT YOUR PACE"
            },
            zh: {
                overline: "溫熱眼部舒緩",
                title: "一抹溫熱，<br>放鬆每一刻。",
                description: "提供 40°C、45°C 與 50°C 三段溫熱選擇，以柔和暖意帶來舒適的眼部放鬆體驗。",
                value: "40°C / 45°C / 50°C",
                metric: "temperature",
                label: "三段溫度選擇",
                visualLabel: "依照你的節奏，溫柔暖敷"
            },
            frame: 28
        },
        {
            en: {
                overline: "BLUETOOTH PERSONAL SOUND",
                title: "Your sound.<br>Your quiet space.",
                description: "Pair with major smart devices for personal sound delivered to your ears without disturbing companions. SyNap Flow offers neural sound therapy for sleep, relaxation, and meditation.",
                value: "Bluetooth 5.1",
                metric: "bluetooth",
                label: "Personal listening",
                visualLabel: "SOUND THAT STAYS YOURS"
            },
            zh: {
                overline: "藍牙個人音訊",
                title: "你的聲音，<br>專屬靜謐時光。",
                description: "可連接主流智慧裝置，享受不打擾身邊同伴的個人音訊；SyNap Flow 提供神經音效療癒，支援睡眠、放鬆與冥想。",
                value: "Bluetooth 5.1",
                metric: "bluetooth",
                label: "個人聆聽體驗",
                visualLabel: "專屬於你的聲音時光"
            },
            frame: 40
        },
        {
            en: {
                overline: "99.9% LIGHT SHIELDING",
                title: "Block the light.<br>Let the world fade.",
                description: "Precision 3D contours provide 99.9% light shielding to create a dark, immersive environment for rest.",
                value: "99.9%",
                metric: "light",
                label: "Light shielding",
                visualLabel: "DARKNESS, DESIGNED FOR REST"
            },
            zh: {
                overline: "99.9% 遮光",
                title: "隔絕光線，<br>沉浸自在休息。",
                description: "精準貼合臉部的 3D 立體剪裁，提供 99.9% 遮光效果，打造適合休息的沉浸式暗黑空間。",
                value: "99.9%",
                metric: "light",
                label: "遮光效果",
                visualLabel: "為安心休息而設計的黑暗空間"
            },
            frame: 5
        }
    ];

    const rotationFeatures = productFeatures;
    const summaryFeatures = productFeatures;
    const colors = [
        { name: { en: "Astra Blue", zh: "極光藍" }, english: "ASTRA BLUE", word: "BLUE", description: { en: "Deep navy blue meets a soft inner lining for a confident, understated look.", zh: "沉靜海軍藍與柔和內裡相映，展現俐落而低調的風格。" }, file: "assets/product-blue/Blue.png" },
        { name: { en: "Soft Nude", zh: "柔霧裸色" }, english: "SOFT NUDE", word: "NUDE", description: { en: "A warm, sandy fabric with a gentle texture—quietly soft and easy to love.", zh: "溫暖沙色織面揉合細緻質感，低調柔和又耐看。" }, file: "assets/product-nude/Nude.png" },
        { name: { en: "Graphite Grey", zh: "石墨灰" }, english: "GRAPHITE GREY", word: "GREY", description: { en: "A composed charcoal finish gives the clean silhouette a confident edge.", zh: "沉穩炭灰色調勾勒俐落輪廓，展現簡約而鮮明的個性。" }, file: "assets/product-gray/grey.png" }
    ];

    const translations = {
        en: {
            pageTitle: "Acoustic & Heat Eye Mask | Product Experience",
            metaDescription: "Explore the Acoustic & Heat Eye Mask through its signature colors, 3D view, and four comfort-focused features.",
            navCollection: "Eye Mask",
            navAbout: "About",
            designEyebrow: "THE DESIGN",
            rotationHeading: "A closer look,<br>from every angle.",
            rotationScrollHint: "Scroll to explore the details",
            colorHeading: "A color that feels like you.",
            colorIntro: "Scroll to discover the signature colors of the Acoustic & Heat Eye Mask.",
            swatchHint: "Scroll to explore or select a color directly.",
            summaryHeading: "Comfort, designed around you.",
            summaryIntro: "Thoughtful details for rest, travel, and everyday comfort.",
            summaryEyebrow: "MADE FOR MORE",
            summaryScrollHint: "SCROLL TO EXPLORE",
            appEyebrow: "SOUND FOR YOUR ROUTINE",
            appTeaser: "Pair your listening routine with science-backed sound for sleep, calm, and focus.",
            appLink: "Discover the app",
            footerTagline: "© Invisible Tech. Designed for your everyday.",
            footerExplore: "Explore",
            footerBack: "Eye Mask",
            footerAbout: "About Invisible Tech",
            footerTop: "Back to top ↑",
            footerFollow: "Follow us",
            modelEyebrow: "ACOUSTIC & HEAT EYE MASK · BLUE",
            modelTitle: "Explore the 3D model",
            modelHint: "Drag to rotate · Scroll or pinch to zoom",
            modelLoading: "Loading the 3D model…",
            modelError: "The 3D viewer could not load. Check your internet connection and make sure the GLB model file is available.",
            colorCaption: "SIGNATURE COLOR",
            chooseColor: "Choose a product color",
            modelTrigger: "View the Astra Blue product in 3D",
            modelUnavailable: "3D preview is currently available for Astra Blue only.",
            imageAlt: "Acoustic & Heat Eye Mask in {color}. Select to open the 3D model.",
            featureProgress: "Feature exploration progress",
            chooseFeature: "Choose a product feature",
            switchToChinese: "Switch to Chinese",
            switchToEnglish: "Switch to English"
        },
        zh: {
            pageTitle: "聲熱眼罩｜產品體驗",
            metaDescription: "以互動方式探索聲熱眼罩：認識產品設計、精選色系與四大舒適特色。",
            navCollection: "聲熱眼罩",
            navAbout: "關於我們",
            designEyebrow: "產品設計",
            rotationHeading: "由每一個角度，<br>重新認識聲熱眼罩。",
            rotationScrollHint: "向下捲動，探索產品細節",
            colorHeading: "一種色彩，一種個性。",
            colorIntro: "繼續向下捲動，探索聲熱眼罩的精選色系。",
            swatchHint: "可捲動瀏覽，或選擇色點直接查看",
            summaryHeading: "為你而設的舒適體驗。",
            summaryIntro: "為休息、旅途與日常舒適，細心打造每個細節。",
            summaryEyebrow: "為更多美好而設",
            summaryScrollHint: "向下捲動，探索特色",
            appEyebrow: "為日常帶來好聲音",
            appTeaser: "以科學實證音景，陪伴睡眠、放鬆與專注時刻。",
            appLink: "探索應用程式",
            footerTagline: "© Invisible Tech。為你的日常而設計。",
            footerExplore: "探索",
            footerBack: "聲熱眼罩",
            footerAbout: "關於 Invisible Tech",
            footerTop: "返回頁首 ↑",
            footerFollow: "追蹤我們",
            modelEyebrow: "聲熱眼罩 · 藍色",
            modelTitle: "探索 3D 產品模型",
            modelHint: "拖曳以旋轉 · 滾動或捏合以縮放",
            modelLoading: "3D 模型載入中…",
            modelError: "無法載入 3D 檢視器。請確認網路連線，並確保 GLB 模型檔案可供讀取。",
            colorCaption: "精選色系",
            chooseColor: "選擇產品色系",
            modelTrigger: "以 3D 檢視極光藍產品",
            modelUnavailable: "目前僅提供極光藍的 3D 預覽。",
            imageAlt: "藍色聲熱眼罩，選擇以開啟 3D 模型。",
            featureProgress: "產品特色探索進度",
            chooseFeature: "選擇產品特色",
            switchToChinese: "切換至中文",
            switchToEnglish: "切換至英文"
        }
    };

    const swatches = Array.from(document.querySelectorAll(".color-swatch"));
    const summaryDots = Array.from(document.querySelectorAll(".summary-dot"));
    const languageToggle = document.getElementById("languageToggle");
    const modelTrigger = document.getElementById("colorModelTrigger");
    const modelDialog = document.getElementById("modelDialog");
    const modelViewer = document.getElementById("blueModelViewer");
    const modelViewerStatus = document.getElementById("modelViewerStatus");
    const frameCache = new Map();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const modelViewerUrl = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    const meshoptDecoderUrl = "https://cdn.jsdelivr.net/npm/meshoptimizer@0.22.0/meshopt_decoder.js";
    let scrollFrame = 0;
    let desiredFrame = -1;
    let activeLanguage = "en";
    let activeRotationFeature = -1;
    let activeColor = -1;
    let activeSummaryFeature = -1;
    let metricAnimationFrame = 0;
    let metricAnimationTimeout = 0;
    let modelViewerModulePromise;
    let modelViewerPollingTimer;
    let modelViewerState = "loading";
    let rotationCopyTimer;
    let colorCopyTimer;
    let summaryCopyTimer;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const pageScrollY = () => window.scrollY || document.documentElement.scrollTop;

    const chapterProgress = (chapter, stage) => {
        const scrollLength = chapter.offsetHeight - stage.clientHeight;
        if (scrollLength <= 0) {
            return 0;
        }

        const start = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
        return clamp((start - chapter.getBoundingClientRect().top) / scrollLength);
    };

    const framePath = (frame) => `assets/product-blue/frame_${String(frame).padStart(2, "0")}.png`;

    const showFrame = (frame) => {
        if (frame === desiredFrame) {
            return;
        }
        desiredFrame = frame;
        const path = framePath(frame);
        let image = frameCache.get(frame);

        if (!image) {
            image = new Image();
            frameCache.set(frame, image);
            image.src = path;
        }

        const applyFrame = () => {
            if (desiredFrame === frame) {
                sequenceImage.src = image.src;
            }
        };

        if (image.complete && image.naturalWidth > 0) {
            applyFrame();
        } else {
            image.addEventListener("load", applyFrame, { once: true });
        }

    };

    const setRotationFeature = (index) => {
        if (index === activeRotationFeature) {
            return;
        }
        activeRotationFeature = index;
        const feature = rotationFeatures[index][activeLanguage];
        const copy = document.querySelector(".rotation-feature-copy");
        if (copy) {
            copy.classList.add("is-changing");
            window.clearTimeout(rotationCopyTimer);
        }

        rotationCopyTimer = window.setTimeout(() => {
            if (index !== activeRotationFeature) {
                return;
            }
            document.getElementById("rotationFeatureOverline").textContent = feature.overline;
            document.getElementById("rotationFeatureTitle").innerHTML = feature.title;
            document.getElementById("rotationFeatureDescription").textContent = feature.description;
            rotationStage.style.setProperty("--feature-accent", ["#739d8b", "#bb8850", "#3189a7", "#6872b7"][index]);
            if (copy) {
                copy.classList.remove("is-changing");
            }
        }, copy ? (reducedMotion.matches ? 0 : 150) : 0);
    };

    const setColor = (index) => {
        if (index === activeColor) {
            return;
        }
        activeColor = index;
        const color = colors[index];
        const copy = document.querySelector(".color-copy");
        const image = document.getElementById("colorProductImage");
        const wordArt = document.querySelector(".color-word-art");
        if (copy) {
            copy.classList.add("is-changing");
        }
        image.classList.add("is-changing");
        wordArt.classList.add("is-changing");
        window.clearTimeout(colorCopyTimer);
        colorStage.dataset.color = ["blue", "nude", "gray"][index];
        const language = translations[activeLanguage];
        const colorName = color.name[activeLanguage];
        document.getElementById("colorEnglish").textContent = color.english;
        document.getElementById("colorName").textContent = colorName;
        document.getElementById("colorDescription").textContent = color.description[activeLanguage];
        document.getElementById("colorWordFill").textContent = color.word;
        document.getElementById("colorWordOutline").textContent = color.word;
        image.src = color.file;
        image.alt = language.imageAlt.replace("{color}", colorName);
        modelTrigger.disabled = index !== 0;
        modelTrigger.setAttribute("aria-label", index === 0 ? language.modelTrigger : language.modelUnavailable);
        modelTrigger.title = index === 0 ? language.modelTrigger : language.modelUnavailable;
        swatches.forEach((swatch, swatchIndex) => {
            const selected = swatchIndex === index;
            swatch.classList.toggle("is-active", selected);
            swatch.setAttribute("aria-pressed", String(selected));
            swatch.setAttribute("aria-label", colors[swatchIndex].name[activeLanguage]);
        });
        colorCopyTimer = window.setTimeout(() => {
            if (index !== activeColor) {
                return;
            }
            if (copy) {
                copy.classList.remove("is-changing");
            }
            image.classList.remove("is-changing");
            wordArt.classList.remove("is-changing");
        }, reducedMotion.matches ? 0 : 180);
    };

    const setSummaryFeature = (index) => {
        if (index === activeSummaryFeature) {
            return;
        }
        activeSummaryFeature = index;
        const feature = summaryFeatures[index][activeLanguage];
        const copy = document.querySelector(".summary-feature");
        const image = document.getElementById("summaryProductImage");
        if (copy) {
            copy.classList.add("is-changing");
        }
        image.classList.add("is-changing");
        window.clearTimeout(summaryCopyTimer);
        window.cancelAnimationFrame(metricAnimationFrame);
        window.clearTimeout(metricAnimationTimeout);
        summaryStage.dataset.feature = String(index);
        document.getElementById("summaryFeatureOverline").textContent = feature.overline;
        document.getElementById("summaryFeatureTitle").innerHTML = feature.title;
        document.getElementById("summaryFeatureDescription").textContent = feature.description;
        const metric = document.getElementById("summarySpecValue");
        const metricContainer = document.getElementById("summarySpec");
        const percentage = feature.value.match(/^(\d+(?:\.\d+)?)%$/);
        const finalValue = feature.metric === "weight"
            ? activeLanguage === "zh" ? "<100克" : "<100g"
            : feature.metric === "temperature"
                ? "40°C / 45°C / 50°C"
                : feature.value;
        metricContainer.dataset.metric = feature.metric || "default";
        metricContainer.setAttribute("aria-label", `${finalValue}, ${feature.label}`);

        if (feature.metric === "bluetooth") {
            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("class", "bluetooth-icon");
            icon.setAttribute("viewBox", "0 0 24 24");
            icon.setAttribute("aria-hidden", "true");
            const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            iconPath.setAttribute("d", "M7 7l10 10-5 5V2l5 5L7 17");
            icon.append(iconPath);
            metric.replaceChildren(icon);
            const letters = document.createElement("span");
            letters.className = "bluetooth-label";
            [..."Bluetooth 5.1"].forEach((character) => {
                const letter = document.createElement("span");
                letter.className = "bluetooth-letter";
                letter.textContent = character === " " ? "\u00a0" : character;
                letter.classList.toggle("is-visible", reducedMotion.matches);
                letters.append(letter);
            });
            metric.append(letters);
            if (!reducedMotion.matches) {
                let nextLetter = 0;
                const revealLetter = () => {
                    const letter = letters.children[nextLetter];
                    if (!letter) {
                        return;
                    }
                    letter.classList.add("is-visible");
                    nextLetter += 1;
                    metricAnimationTimeout = window.setTimeout(revealLetter, 55);
                };
                metricAnimationTimeout = window.setTimeout(revealLetter, 80);
            }
        } else if (reducedMotion.matches) {
            metric.textContent = finalValue;
        } else if (feature.metric === "weight") {
            const duration = 1100;
            const startedAt = performance.now();
            metric.textContent = "<500g";
            const animateWeight = (now) => {
                const progress = Math.min(1, (now - startedAt) / duration);
                const grams = Math.round(500 - 400 * (1 - (1 - progress) ** 3));
                metric.textContent = `<${Math.max(100, grams)}g`;
                if (progress < 1) {
                    metricAnimationFrame = window.requestAnimationFrame(animateWeight);
                }
            };
            metricAnimationFrame = window.requestAnimationFrame(animateWeight);
        } else if (feature.metric === "temperature") {
            const levels = [40, 45, 50];
            metric.replaceChildren();
            levels.forEach((level, levelIndex) => {
                if (levelIndex > 0) {
                    const separator = document.createElement("span");
                    separator.className = "temperature-separator";
                    separator.textContent = " / ";
                    metric.append(separator);
                }
                const temperature = document.createElement("span");
                temperature.className = `temperature-value temperature-${level}`;
                temperature.textContent = levelIndex === 0 ? "40" : String(level);
                metric.append(temperature);
            });
            const unit = document.createElement("span");
            unit.className = "temperature-unit";
            unit.textContent = "°C";
            metric.append(unit);
            const temperatures = Array.from(metric.querySelectorAll(".temperature-value"));
            const separators = Array.from(metric.querySelectorAll(".temperature-separator"));
            temperatures.slice(1).forEach((temperature) => temperature.classList.add("is-hidden"));
            separators.forEach((separator) => separator.classList.add("is-hidden"));
            const holdDuration = 320;
            const countDuration = 650;
            const startedAt = performance.now();
            const animateTemperature = (now) => {
                const elapsed = now - startedAt;
                if (elapsed >= holdDuration) {
                    const progress = Math.min(1, (elapsed - holdDuration) / countDuration);
                    temperatures[1].classList.remove("is-hidden");
                    separators[0].classList.remove("is-hidden");
                    temperatures[1].textContent = String(Math.round(40 + progress * 5));
                    if (progress >= 1) {
                        const secondStep = Math.min(1, (elapsed - holdDuration - countDuration) / countDuration);
                        if (secondStep > 0) {
                            temperatures[2].classList.remove("is-hidden");
                            separators[1].classList.remove("is-hidden");
                            temperatures[2].textContent = String(Math.round(45 + secondStep * 5));
                        }
                    }
                }
                if (elapsed < holdDuration + countDuration * 2) {
                    metricAnimationFrame = window.requestAnimationFrame(animateTemperature);
                }
            };
            metricAnimationFrame = window.requestAnimationFrame(animateTemperature);
        } else if (percentage) {
            const target = Number(percentage[1]);
            const duration = 850;
            const startedAt = performance.now();
            metric.textContent = "1.0%";
            const animateMetric = (now) => {
                const progress = Math.min(1, (now - startedAt) / duration);
                const easedProgress = 1 - (1 - progress) ** 3;
                metric.textContent = `${(1 + (target - 1) * easedProgress).toFixed(1)}%`;
                if (progress < 1) {
                    metricAnimationFrame = window.requestAnimationFrame(animateMetric);
                }
            };
            metricAnimationFrame = window.requestAnimationFrame(animateMetric);
        } else {
            metric.textContent = feature.value;
        }
        document.getElementById("summarySpecLabel").textContent = feature.label;
        document.getElementById("summaryVisualLabel").textContent = feature.visualLabel;
        summaryDots.forEach((dot, dotIndex) => {
            const selected = dotIndex === index;
            dot.classList.toggle("is-active", selected);
            dot.setAttribute("aria-pressed", String(selected));
            dot.setAttribute("aria-label", summaryFeatures[dotIndex][activeLanguage].overline);
        });

        const imagePath = framePath(summaryFeatures[index].frame);
        const cachedImage = frameCache.get(summaryFeatures[index].frame);
        if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
            image.src = cachedImage.src;
        } else {
            image.src = imagePath;
        }
        summaryCopyTimer = window.setTimeout(() => {
            if (index !== activeSummaryFeature) {
                return;
            }
            if (copy) {
                copy.classList.remove("is-changing");
            }
            image.classList.remove("is-changing");
        }, reducedMotion.matches ? 0 : 180);
    };

    const updateModelViewerStatus = () => {
        modelViewerStatus.textContent = translations[activeLanguage][modelViewerState === "error" ? "modelError" : "modelLoading"];
        modelViewerStatus.hidden = modelViewerState === "loaded";
    };

    const markModelViewerLoaded = () => {
        if (!modelViewer.loaded || !modelViewer.modelIsVisible) {
            return false;
        }
        window.clearInterval(modelViewerPollingTimer);
        modelViewerPollingTimer = undefined;
        modelViewerState = "loaded";
        updateModelViewerStatus();
        return true;
    };

    const setLanguage = (language) => {
        activeLanguage = language;
        const copy = translations[language];
        document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
        document.title = copy.pageTitle;
        document.querySelector('meta[name="description"]').content = copy.metaDescription;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const translation = copy[element.dataset.i18n];
            if (translation !== undefined) {
                element.textContent = translation;
            }
        });
        document.querySelectorAll("[data-i18n-html]").forEach((element) => {
            const translation = copy[element.dataset.i18nHtml];
            if (translation !== undefined) {
                element.innerHTML = translation;
            }
        });
        languageToggle.textContent = language === "en" ? "中文" : "EN";
        languageToggle.setAttribute("aria-label", language === "en" ? copy.switchToChinese : copy.switchToEnglish);
        languageToggle.setAttribute("aria-pressed", String(language === "zh"));
        document.getElementById("mainNavigation").setAttribute("aria-label", language === "en" ? "Main navigation" : "主要導覽");
        document.querySelector(".brand").setAttribute("aria-label", language === "en" ? "Invisible Tech home" : "Invisible Tech 首頁");
        document.querySelector(".chapter-progress").setAttribute("aria-label", copy.featureProgress);
        document.getElementById("colorSwatches").setAttribute("aria-label", copy.chooseColor);
        document.getElementById("summaryDots").setAttribute("aria-label", copy.chooseFeature);
        document.getElementById("modelDialogClose").setAttribute("aria-label", language === "en" ? "Close 3D viewer" : "關閉 3D 檢視器");
        modelViewer.alt = language === "en"
            ? "Interactive 3D model of the Acoustic & Heat Eye Mask in blue"
            : "藍色聲熱眼罩的互動式 3D 模型";
        updateModelViewerStatus();

        const rotationIndex = activeRotationFeature < 0 ? 0 : activeRotationFeature;
        const colorIndex = activeColor < 0 ? 0 : activeColor;
        const summaryIndex = activeSummaryFeature < 0 ? 0 : activeSummaryFeature;
        activeRotationFeature = -1;
        activeColor = -1;
        activeSummaryFeature = -1;
        setRotationFeature(rotationIndex);
        setColor(colorIndex);
        setSummaryFeature(summaryIndex);
    };

    const loadModelViewer = () => {
        if (!modelViewerModulePromise) {
            const viewerDefined = customElements.get("model-viewer")
                ? Promise.resolve(customElements.get("model-viewer"))
                : import(modelViewerUrl).then(() => customElements.whenDefined("model-viewer"));
            modelViewerModulePromise = viewerDefined
                .then((ModelViewerElement) => {
                    ModelViewerElement.meshoptDecoderLocation = meshoptDecoderUrl;
                    return ModelViewerElement;
                })
                .catch((error) => {
                    modelViewerModulePromise = undefined;
                    throw error;
                });
        }
        return modelViewerModulePromise;
    };

    const openModelViewer = async () => {
        modelDialog.showModal();
        modelViewerState = "loading";
        updateModelViewerStatus();
        try {
            await loadModelViewer();
            if (modelDialog.open && !modelViewer.hasAttribute("src")) {
                modelViewer.setAttribute("src", "assets/product-blue/Blue_3D.glb");
            }
            if (modelDialog.open) {
                modelViewer.autoRotate = !reducedMotion.matches;
                if (!markModelViewerLoaded()) {
                    window.clearInterval(modelViewerPollingTimer);
                    modelViewerPollingTimer = window.setInterval(markModelViewerLoaded, 250);
                }
            }
        } catch (error) {
            console.error("Unable to load the 3D model viewer.", error);
            if (modelDialog.open) {
                modelViewerState = "error";
                updateModelViewerStatus();
            }
        }
    };

    const updateOnScroll = () => {
        scrollFrame = 0;
        const rotationProgress = chapterProgress(rotationChapter, rotationStage);
        const frame = Math.round(rotationProgress * 89);
        const featureIndex = Math.min(3, Math.floor(rotationProgress * 4));
        const rotationSegment = rotationProgress === 1 ? 1 : rotationProgress * 4 - featureIndex;
        showFrame(frame);
        setRotationFeature(featureIndex);
        rotationStage.dataset.feature = String(featureIndex);
        const rotationCopy = document.querySelector(".rotation-feature-copy");
        rotationCopy.style.setProperty("--scroll-opacity", String(0.88 + 0.12 * Math.sin(rotationSegment * Math.PI)));
        rotationCopy.style.setProperty("--scroll-offset", `${(0.5 - rotationSegment) * 16}px`);
        document.querySelector(".rotation-feature").style.setProperty("--scroll-opacity", String(0.94 + 0.06 * Math.sin(rotationSegment * Math.PI)));
        document.querySelector(".rotation-product").style.setProperty("--scroll-offset", `${(0.5 - rotationProgress) * 20}px`);
        document.querySelector(".chapter-heading").style.setProperty("--scroll-offset", `${-rotationProgress * 18}px`);
        document.getElementById("rotationProgress").style.width = `${rotationProgress * 100}%`;

        const colorProgress = chapterProgress(colorChapter, colorStage);
        const colorIndex = Math.min(2, Math.floor(colorProgress * 3));
        const colorSegment = colorProgress === 1 ? 1 : colorProgress * 3 - colorIndex;
        setColor(colorIndex);
        const colorCopy = document.querySelector(".color-copy");
        colorCopy.style.setProperty("--scroll-opacity", String(0.88 + 0.12 * Math.sin(colorSegment * Math.PI)));
        colorCopy.style.setProperty("--scroll-offset", `${(0.5 - colorSegment) * 16}px`);
        document.querySelector(".color-heading").style.setProperty("--scroll-offset", `${-colorProgress * 16}px`);
        const colorProduct = document.querySelector(".color-product");
        colorProduct.style.setProperty("--scroll-opacity", String(0.92 + 0.08 * Math.sin(colorSegment * Math.PI)));
        colorProduct.style.setProperty("--scroll-offset", `${(0.5 - colorSegment) * 22}px`);
        document.getElementById("colorProgress").style.width = `${colorProgress * 100}%`;

        const summaryProgress = chapterProgress(summaryChapter, summaryStage);
        const summaryIndex = Math.min(3, Math.floor(summaryProgress * 4));
        const summarySegment = summaryProgress === 1 ? 1 : summaryProgress * 4 - summaryIndex;
        setSummaryFeature(summaryIndex);
        const summaryCopy = document.querySelector(".summary-feature");
        summaryCopy.style.setProperty("--scroll-opacity", String(0.88 + 0.12 * Math.sin(summarySegment * Math.PI)));
        summaryCopy.style.setProperty("--scroll-offset", `${(0.5 - summarySegment) * 16}px`);
        document.querySelector(".summary-heading").style.setProperty("--scroll-offset", `${-summaryProgress * 16}px`);
        document.querySelector(".summary-visual").style.setProperty("--scroll-offset", `${(0.5 - summaryProgress) * 22}px`);
    };

    const requestScrollUpdate = () => {
        if (!scrollFrame) {
            scrollFrame = window.requestAnimationFrame(updateOnScroll);
        }
    };

    const scrollToChapterProgress = (chapter, stage, progress) => {
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
        const chapterTop = pageScrollY() + chapter.getBoundingClientRect().top - headerHeight;
        const scrollLength = Math.max(0, chapter.offsetHeight - stage.clientHeight);
        window.scrollTo({
            top: chapterTop + scrollLength * progress,
            behavior: reducedMotion.matches ? "auto" : "smooth"
        });
    };

    swatches.forEach((swatch) => {
        swatch.addEventListener("click", () => {
            const index = Number(swatch.dataset.colorIndex);
            if (Number.isInteger(index) && index >= 0 && index < colors.length) {
                scrollToChapterProgress(colorChapter, colorStage, index / (colors.length - 1));
            }
        });
    });

    summaryDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = Number(dot.dataset.featureIndex);
            if (Number.isInteger(index) && index >= 0 && index < summaryFeatures.length) {
                scrollToChapterProgress(summaryChapter, summaryStage, index / (summaryFeatures.length - 1));
            }
        });
    });

    languageToggle.addEventListener("click", () => {
        setLanguage(activeLanguage === "en" ? "zh" : "en");
    });

    modelTrigger.addEventListener("click", openModelViewer);
    document.getElementById("modelDialogClose").addEventListener("click", () => modelDialog.close());
    modelDialog.addEventListener("click", (event) => {
        if (event.target === modelDialog) {
            modelDialog.close();
        }
    });
    modelDialog.addEventListener("close", () => {
        if (customElements.get("model-viewer")) {
            modelViewer.autoRotate = false;
        }
    });
    modelViewer.addEventListener("load", () => {
        markModelViewerLoaded();
    });
    modelViewer.addEventListener("error", (event) => {
        window.clearInterval(modelViewerPollingTimer);
        modelViewerPollingTimer = undefined;
        console.error("Unable to render the Acoustic & Heat Eye Mask 3D model.", event);
        modelViewerState = "error";
        updateModelViewerStatus();
    });

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    setLanguage("en");
    updateOnScroll();
});
