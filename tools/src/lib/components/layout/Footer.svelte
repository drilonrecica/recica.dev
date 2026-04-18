<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
	<div
		class="surface-panel flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-end sm:justify-between"
	>
		<div class="space-y-2">
			<p class="kicker">Recica ecosystem</p>
			<p class="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
				Recica Tools stays focused on practical browser utilities. The flagship lives at
				<a class="text-[var(--primary)] hover:underline" href="https://recica.dev">recica.dev</a>.
				Public experiments live at
				<a class="text-[var(--primary)] hover:underline" href="https://labs.recica.dev">
					labs.recica.dev
				</a>.
			</p>
			<p class="text-xs text-[var(--text-muted)]">© {year} Drilon Reçica</p>
		</div>

		<nav class="footer-links" aria-label="Footer">
			<a href="https://recica.dev" rel="noreferrer">recica.dev</a>
			<a href="https://labs.recica.dev" rel="noreferrer">labs.recica.dev</a>
			<a href="https://github.com/drilonrecica" rel="noreferrer">GitHub</a>
			<a href="https://linkedin.com/in/drilonrecica" rel="noreferrer">LinkedIn</a>
			<a href="mailto:drilonrecica.dev@gmail.com">Email</a>
		</nav>
	</div>
</footer>
