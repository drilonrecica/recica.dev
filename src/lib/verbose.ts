export const VERBOSE_KEY = 'recica.verbose';
export const EVENT_NAME = 'verbose-change';

export function isVerbose(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(VERBOSE_KEY) === 'true';
}

export function setVerbose(active: boolean) {
    if (active) {
        document.documentElement.setAttribute('data-mode', 'verbose');
        localStorage.setItem(VERBOSE_KEY, 'true');
    } else {
        document.documentElement.removeAttribute('data-mode');
        localStorage.setItem(VERBOSE_KEY, 'false');
    }

    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { active } }));
}

export function toggleVerbose() {
    setVerbose(!isVerbose());
}

if (typeof window !== 'undefined') {
    if (isVerbose()) {
        document.documentElement.setAttribute('data-mode', 'verbose');
    }
}
