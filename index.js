// Terbium Browser – Fixed Scramjet Path Version

(async () => {
    const user = await window.parent.tb.user.get();
    const settingsRaw = await Filer.promises.readFile(`/home/${user}/settings.json`, "utf8");
    const settings = JSON.parse(settingsRaw);

    const main = document.querySelector("main");
    const tabsContainer = document.querySelector(".tabs");
    const searchbars = document.querySelector(".searchbars");

    function createIframe() {
        const iframe = document.createElement("iframe");
        iframe.className = "tab-content";
        iframe.allow = "fullscreen";
        return iframe;
    }

    function encodeURL(url) {
        return window.parent.tb.proxy.encode(url, "XOR");
    }

    async function loadURL(iframe, url) {
        const encoded = await encodeURL(url);

        if (settings.proxy === "Scramjet") {
            iframe.src = `${window.location.origin}/scram/${encoded}`;
        } else {
            iframe.src = `${window.location.origin}/uv/service/${encoded}`;
        }
    }

    function createTab(url) {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.textContent = url;
        tabsContainer.appendChild(tab);

        const iframe = createIframe();
        main.innerHTML = "";
        main.appendChild(iframe);

        loadURL(iframe, url);

        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            main.innerHTML = "";
            main.appendChild(iframe);
        });

        tab.classList.add("active");
        return { tab, iframe };
    }

    // New Tab Button
    document.querySelector(".new-tab").addEventListener("click", () => {
        createTab("https://example.com");
    });

    // Search Bar
    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search or enter URL";
    searchbars.appendChild(searchInput);

    searchInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            let url = searchInput.value.trim();
            if (!url.startsWith("http")) url = "https://" + url;

            const activeIframe = document.querySelector(".tab-content");
            if (activeIframe) {
                loadURL(activeIframe, url);
            }
        }
    });

    // Load default tab
    createTab("https://example.com");
})();
