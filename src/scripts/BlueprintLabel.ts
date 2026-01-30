import { isVerbose, EVENT_NAME } from "@/lib/verbose";

class BlueprintLabel {
    private overlay: HTMLElement;
    private activeTarget: HTMLElement | null = null;

    constructor() {
        this.overlay = this.createOverlay();
        this.init();
    }

    private createOverlay(): HTMLElement {
        const el = document.createElement("div");
        el.id = "blueprint-overlay";
        el.className = "verbose-only fixed pointer-events-none z-[9999] hidden";
        // Inner structure
        el.innerHTML = `
            <div id="blueprint-box" class="absolute border border-dashed border-[var(--verbose-text)] bg-[var(--verbose-bg)]/80 backdrop-blur-[2px]"></div>
            <div id="blueprint-label" class="absolute -top-6 left-0 text-[10px] uppercase font-mono bg-[var(--verbose-text)] text-black px-1.5 py-0.5 font-bold whitespace-nowrap"></div>
            <div id="blueprint-metrics" class="absolute -bottom-6 left-0 text-[10px] font-mono text-[var(--verbose-text)] px-1 py-0.5 bg-black/80"></div>
            <div id="blueprint-crosshair" class="fixed w-full h-full pointer-events-none opacity-20">
                 <div class="absolute top-1/2 w-full border-t border-[var(--verbose-grid)]"></div>
                 <div class="absolute left-1/2 h-full border-l border-[var(--verbose-grid)]"></div>
            </div>
        `;
        document.body.appendChild(el);
        return el;
    }

    private lastHoverTime: number = 0;
    private confirmedTarget: HTMLElement | null = null;

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

        // If specific target is locked (mobile tap), allow the second click
        const target = e.target as HTMLElement;
        const timeDiff = Date.now() - this.lastHoverTime;

        // "Touch Tap" heuristic: Mouseover fires <50ms before click on mobile.
        // On desktop, it usually fires way earlier.
        // We also check if we are already inspecting this target.
        if (timeDiff < 100 && target !== this.confirmedTarget) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Stop other handlers (like Links)

            this.show(target);
            this.confirmedTarget = target;
        }
    }

    private handleHover(e: MouseEvent) {
        if (!isVerbose()) return;

        this.lastHoverTime = Date.now();
        const target = e.target as HTMLElement;

        // Skip overlay itself, high-level wrappers, or SVG internals which can be noisy
        if (
            target.closest("#blueprint-overlay") ||
            target.tagName === "HTML" ||
            target.tagName === "BODY" ||
            target.id === "app"
        ) {
            return;
        }

        e.stopPropagation();
        this.show(target);
    }

    private show(target: HTMLElement) {
        if (this.activeTarget === target) return;
        this.activeTarget = target;
        this.overlay.classList.remove("hidden");

        const rect = target.getBoundingClientRect();

        let labelText = target.tagName.toLowerCase();
        if (target.id) labelText += `#${target.id}`;
        else if (target.classList.length > 0) labelText += `.${target.classList[0]}`;

        if (target.hasAttribute("data-blueprint")) {
            labelText = target.getAttribute("data-blueprint")!;
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
        label.style.top = `${rect.top - 20}px`;
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
