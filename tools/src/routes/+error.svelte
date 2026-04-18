<script lang="ts">
	/* eslint-disable svelte/valid-prop-names-in-kit-pages */
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';

	export let error: Error | { message?: string };
	export let status: number;

	const title = status === 404 ? 'Page not found' : 'Something went wrong';
	const description =
		status === 404
			? 'That URL does not exist on this site. Let’s get you back to the toolbox.'
			: 'An unexpected issue occurred while loading this page. Refresh or return to the homepage to continue.';
	const details = error?.message ? String(error.message) : '';
</script>

<SeoHead {title} {description} noindex={true} />

<section class="min-h-[calc(100vh-6rem)] px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto flex max-w-5xl flex-col gap-8">
		<div class="surface-panel p-8 shadow-[0_30px_70px_rgba(9,85,77,0.08)]">
			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<span class="status-pill status-error">{status}</span>
						<h1
							class="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-5xl"
						>
							{title}
						</h1>
					</div>
					<div class="flex flex-wrap gap-3">
						<a href={resolve('/')} class="button-base button-primary inline-flex"> Back to home </a>
						<button
							type="button"
							on:click={() => history.back()}
							class="button-base button-secondary inline-flex"
						>
							Go back
						</button>
					</div>
				</div>

				<p class="max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
					{description}
				</p>

				{#if details}
					<div
						class="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 text-sm leading-7 text-[var(--text)]"
					>
						<strong class="mb-2 block text-sm font-semibold">Error details</strong>
						<p class="break-words whitespace-pre-wrap text-[var(--text)]">{details}</p>
					</div>
				{/if}

				<div
					class="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--text-secondary)]"
				>
					<p>
						If the problem persists, try refreshing the page or revisiting the toolbox from the
						homepage. If you think this is a bug, the footer includes direct links back to the
						Recica ecosystem and contact email.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
