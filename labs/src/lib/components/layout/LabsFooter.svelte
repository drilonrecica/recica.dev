<script lang="ts">
	import { resolve } from '$app/paths';

	export let dark = false;
</script>

<footer class="px-4 pb-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class={`footer-shell ${dark ? 'footer-shell--dark' : ''}`}>
			<div class="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
				<div class="space-y-3">
					<p class="eyebrow">Recica ecosystem</p>
					<h2 class="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
						Public experiments with a stable flagship and tools layer behind them.
					</h2>
					<p class="max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
						Labs is where product ideas get tested in public. The flagship lives at `recica.dev`.
						Stable utilities live at `tools.recica.dev`.
					</p>
				</div>

				<div class="grid gap-3 text-sm text-[var(--ink-soft)] sm:grid-cols-2">
					<a href="https://recica.dev" class="footer-link">recica.dev</a>
					<a href="https://tools.recica.dev" class="footer-link">tools.recica.dev</a>
					<a href={resolve('/parental-gate-lab')} class="footer-link">Parental Gate Lab</a>
					<a href="https://github.com/drilonrecica" class="footer-link" rel="noreferrer">GitHub</a>
					<a href="https://www.linkedin.com/in/drilonrecica" class="footer-link" rel="noreferrer">
						LinkedIn
					</a>
					<a href="mailto:hi@recica.dev" class="footer-link">Email</a>
				</div>
			</div>
		</div>
	</div>
</footer>
