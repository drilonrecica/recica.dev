import { isVerbose, EVENT_NAME } from "@/lib/verbose";

class BlueprintLabel {
    private overlay: HTMLElement;
    private activeTarget: HTMLElement | null = null;
    private lastHoverTime: number = 0;
    private confirmedTarget: HTMLElement | null = null;

    constructor() {
        this.overlay = this.createOverlay();
        this.init();
    }

    // Creates the overlay DOM with accessible attributes and 'spotlight' shadow
    private createOverlay(): HTMLElement {
        const el = document.createElement("div");
        el.id = "blueprint-overlay";
        el.className = "verbose-only fixed inset-0 pointer-events-none z-[9999] hidden";
        el.setAttribute("aria-hidden", "true");
        // Inner structure
        el.innerHTML = `
            <div id="blueprint-box" class="absolute border border-dashed border-[var(--verbose-text)] bg-[var(--verbose-bg)]/10 transition-all duration-75 ease-out shadow-[0_0_0_9999vh_rgba(0,0,0,0.5)]"></div>
            <div id="blueprint-label" class="absolute left-0 text-[10px] font-mono bg-[var(--verbose-text)] text-black px-1.5 py-0.5 font-bold whitespace-nowrap shadow-sm"></div>
            <div id="blueprint-metrics" class="absolute left-0 text-[10px] font-mono text-[var(--verbose-text)] px-1 py-0.5 bg-black/80"></div>
            <div id="blueprint-crosshair" class="fixed w-full h-full pointer-events-none opacity-20">
                 <div class="absolute top-1/2 w-full border-t border-[var(--verbose-grid)]"></div>
                 <div class="absolute left-1/2 h-full border-l border-[var(--verbose-grid)]"></div>
            </div>
        `;
        document.body.appendChild(el);
        return el;
    }

    private init() {
        document.addEventListener("mouseover", (e) => this.handleHover(e));
        document.addEventListener("click", (e) => this.handleClick(e), { capture: true });

        window.addEventListener(EVENT_NAME, (e) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail.active && this.overlay) {
                this.hide();
            }
        });
    }

    private handleClick(e: MouseEvent) {
        if (!isVerbose()) return;

        const target = e.target as HTMLElement;
        const timeDiff = Date.now() - this.lastHoverTime;

        // Mobile Logic:
        // 1. If tapping the ALREADY inspected target -> ALLOW click (interact)
        if (target === this.confirmedTarget) {
            return;
        }

        // 2. If clicking/tapping outside (or on an ignored element) -> CLEAR selection
        if (this.isIgnoredElement(target)) {
            // If we clicked strictly outside any valid blueprint target, clear.
            this.hide();
            this.confirmedTarget = null;
            return;
        }

        // 3. "Touch Tap" heuristic (<100ms hover) OR clicking a NEW valid target -> INSPECT
        if (timeDiff < 100 || (target !== this.confirmedTarget)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            this.show(target);
            this.confirmedTarget = target;
        }
    }

    private handleHover(e: MouseEvent) {
        if (!isVerbose()) return;

        this.lastHoverTime = Date.now();
        const target = e.target as HTMLElement;

        if (this.isIgnoredElement(target)) {
            // If hovering void space (HTML/BODY), hide overlay.
            if (target.tagName === "BODY" || target.tagName === "HTML") {
                this.hide();
            }
            return;
        }

        e.stopPropagation();
        this.show(target);
    }

    // Filter out structural containers (unless explicitly tagged)
    private isIgnoredElement(target: HTMLElement): boolean {
        const ignoredTags = ["HTML", "BODY", "HEADER", "FOOTER", "MAIN", "SECTION"];

        if (ignoredTags.includes(target.tagName)) {
            // Exception: If it has explicit data-blueprint, don't ignore it
            return !target.hasAttribute("data-blueprint");
        }

        if (target.closest("#blueprint-overlay")) return true;
        if (target.id === "app") return true;

        return false;
    }

    private show(target: HTMLElement) {
        if (this.activeTarget === target) return;
        this.activeTarget = target;
        this.overlay.classList.remove("hidden");

        const rect = target.getBoundingClientRect();

        // Label Logic: Prefer data-blueprint, then ID, then Class, then Tag
        let labelText = `<${target.tagName.toLowerCase()}>`;

        if (target.hasAttribute("data-blueprint")) {
            // Explicit Component Label
            labelText = `<${target.getAttribute("data-blueprint")!} />`;
        } else if (target.id) {
            labelText += ` #${target.id}`;
        } else if (target.classList.length > 0) {
            const mainClass = target.classList[0];
            labelText += ` .${mainClass}`;
        }

        const metricsText = `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`;

        // Update UI
        const box = this.overlay.querySelector("#blueprint-box") as HTMLElement;
        const label = this.overlay.querySelector("#blueprint-label") as HTMLElement;
        const metrics = this.overlay.querySelector("#blueprint-metrics") as HTMLElement;

        // Position Box
        box.style.top = `${rect.top}px`;
        box.style.left = `${rect.left}px`;
        box.style.width = `${rect.width}px`;
        box.style.height = `${rect.height}px`;

        // Position Label
        label.textContent = labelText;
        label.style.top = `${rect.top - 24}px`; // Moved up slightly to clear border
        label.style.left = `${rect.left}px`;

        // Position Metrics
        metrics.textContent = metricsText;
        metrics.style.top = `${rect.bottom + 4}px`;
        metrics.style.left = `${rect.left}px`;
    }

    private hide() {
        this.activeTarget = null;
        this.overlay.classList.add("hidden");
    }
}

// Singleton init
if (typeof window !== "undefined") {
    new BlueprintLabel();
}
