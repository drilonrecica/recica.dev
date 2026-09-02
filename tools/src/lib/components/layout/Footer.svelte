<script lang="ts">
	import { resolve } from '$app/paths';

	const year = new Date().getFullYear();
</script>

<footer class="app-footer">
	<div class="app-footer__shell">
		<div>
			<p>
				Every tool runs in this browser tab. No accounts, no uploads, no analytics. The flagship
				lives at recica.dev; public experiments at labs.recica.dev.
			</p>
			<p class="mt-1">&copy; {year} Drilon Reçica</p>
		</div>
		<nav class="footer-links" aria-label="Footer">
			<a href={resolve('/privacy')}>Privacy</a>
			<a href="https://recica.dev" target="_blank" rel="noreferrer">recica.dev</a>
			<a href="https://labs.recica.dev" target="_blank" rel="noreferrer">Labs</a>
			<a href="https://github.com/drilonrecica" target="_blank" rel="noreferrer">GitHub</a>
			<a href="https://linkedin.com/in/drilonrecica" target="_blank" rel="noreferrer">LinkedIn</a>
			<a href="mailto:drilonrecica.dev@gmail.com">Email</a>
		</nav>
	</div>
</footer>
