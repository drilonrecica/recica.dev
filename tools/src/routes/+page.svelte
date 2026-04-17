<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import ToolCard from '$lib/components/tools/ToolCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import { resources } from '$lib/constants/resources';
	import { featuredToolIds, tools } from '$lib/constants/tools';
	import { searchTools } from '$lib/search/tools';
	import { resolveSiteOrigin } from '$lib/utils/site-indexing';
	import {
		buildCollectionPageSchema,
		buildOrganizationSchema,
		buildToolListSchema,
		buildWebsiteSchema
	} from '$lib/utils/seo';

	let query = '';
	let selectedCategories: string[] = [];

	const featuredTools = tools.filter((tool) =>
		featuredToolIds.includes(tool.id as (typeof featuredToolIds)[number])
	);
	const categories = [...new Set(tools.map((tool) => tool.category))];

	function clearCategoryFilters() {
		selectedCategories = [];
	}

	function toggleCategory(category: string) {
		if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter((value) => value !== category);
			return;
		}

		selectedCategories = [...selectedCategories, category];
	}

	$: searchedTools = searchTools(query);
	$: filteredTools = selectedCategories.length
		? searchedTools.filter((tool) => selectedCategories.includes(tool.category))
		: searchedTools;
	$: canonicalOrigin = resolveSiteOrigin(env.PUBLIC_SITE_URL, $page.url);
	$: schemas = [
		buildWebsiteSchema(
			canonicalOrigin,
			'Essential browser tools for developers: QR codes, JSON formatter, Base64 encoder, URL tools, timestamps, hashing, and more. Privacy-first, no accounts, works offline.'
		),
		buildOrganizationSchema(canonicalOrigin),
		buildCollectionPageSchema(
			canonicalOrigin,
			'Essential browser tools for developers: QR codes, JSON formatter, Base64 encoder, URL tools, timestamps, hashing, and more. Privacy-first, no accounts, works offline.'
		),
		buildToolListSchema(canonicalOrigin, tools),
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'Are these tools secure and private?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Yes, all tools run entirely in your browser. Your data never leaves your device, and no accounts or tracking are required.'
					}
				},
				{
					'@type': 'Question',
					name: 'Do I need to install anything?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'No installation required. All tools work directly in your web browser with no downloads or setup.'
					}
				},
				{
					'@type': 'Question',
					name: 'Are these tools free to use?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Yes, all tools are completely free with no limitations, ads, or premium features.'
					}
				}
			]
		}
	];
</script>

<SeoHead
	title="Free Local Browser Tools for Developers and Everyday Tasks"
	description="Essential browser tools for developers: QR codes, JSON formatter, Base64 encoder, URL tools, timestamps, hashing, and more. Privacy-first, no accounts, works offline."
	{schemas}
	imageAlt="Recica Tools social card showing free local browser tools"
/>

<section class="space-y-14">
	<div class="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
		<div class="space-y-6">
			<div class="kicker">Recica Lab</div>
			<h1
				class="max-w-[12ch] text-5xl font-semibold tracking-[-0.06em] text-[var(--text)] sm:text-6xl"
			>
				Essential tools for developers and creators.
			</h1>
			<p class="prose-note max-w-2xl">
				Powerful browser-based utilities for QR codes, JSON, Base64, URLs, timestamps, hashing, and
				more. Privacy-first, no accounts required, no data leaves your device.
			</p>

			<div class="surface-panel-elevated max-w-2xl p-4 sm:p-5">
				<div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
					<TextInput
						id="home-search"
						label="Find a tool"
						placeholder="Search by task, tool, or keyword"
						help={`${filteredTools.length} tool${filteredTools.length === 1 ? '' : 's'} available`}
						bind:value={query}
					/>
					{#if query}
						<Button variant="ghost" on:click={() => (query = '')}>Clear</Button>
					{/if}
				</div>
			</div>
		</div>

		<section class="surface-panel p-6">
			<div class="kicker">Featured Tools</div>
			<div class="mt-5 space-y-3">
				{#each featuredTools as tool (tool.id)}
					<a
						href={resolve(tool.route)}
						class="group flex items-start justify-between gap-4 rounded-[14px] border border-transparent px-1 py-3 transition hover:border-[var(--border-subtle)] hover:bg-[var(--surface-elevated)]"
					>
						<div>
							<div class="text-sm font-semibold text-[var(--text)]">{tool.name}</div>
							<div class="mt-1 max-w-[30ch] text-sm leading-6 text-[var(--text-secondary)]">
								{tool.description}
							</div>
						</div>
						<div class="tool-code transition group-hover:text-[var(--primary)]">{tool.route}</div>
					</a>
				{/each}
			</div>
		</section>
	</div>

	<section class="space-y-5">
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<div class="kicker">Tool Index</div>
				<h2 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">
					Browse all tools
				</h2>
			</div>
			<p class="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
				From JSON formatting and QR generation to SQL queries, regex testing, and file diffs—every
				tool is designed for one job, works instantly, and respects your privacy.
			</p>
		</div>

		<div class="surface-panel-elevated p-4 sm:p-5">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div class="text-sm font-semibold text-[var(--text)]">Filter by category</div>
					<div class="mt-1 text-sm text-[var(--text-secondary)]">
						Focus on specific tool types to find what you need faster.
					</div>
				</div>
				<div class="text-sm text-[var(--text-muted)]">{filteredTools.length} shown</div>
			</div>

			<div class="mt-4 flex flex-wrap gap-2">
				<Toggle
					label="All"
					checked={selectedCategories.length === 0}
					on:change={clearCategoryFilters}
				/>
				{#each categories as category (category)}
					<Toggle
						label={category}
						checked={selectedCategories.includes(category)}
						on:change={() => toggleCategory(category)}
					/>
				{/each}
			</div>
		</div>

		{#if filteredTools.length}
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each filteredTools as tool (tool.id)}
					<ToolCard {tool} />
				{/each}
			</div>
		{:else}
			<div class="result-empty">
				<div>
					<div class="text-base font-semibold text-[var(--text)]">No tool matches that search.</div>
					<div class="mt-2 text-sm text-[var(--text-muted)]">
						Try broader terms like json, qr, regex, sql, hash, or timestamp.
					</div>
				</div>
			</div>
		{/if}
	</section>

	<section class="surface-panel p-6">
		<div class="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
			<div>
				<div class="kicker">External Resources</div>
				<h2 class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
					Handpicked links for when you need more.
				</h2>
			</div>
			<div class="space-y-3">
				{#each resources as resource (resource.href)}
					<svelte:element
						this={'a'}
						href={resource.href}
						target="_blank"
						rel="noreferrer"
						class="group flex items-start justify-between gap-4 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 transition hover:border-[var(--border-strong)]"
					>
						<div>
							<div class="text-sm font-semibold text-[var(--text)]">{resource.label}</div>
							<div class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
								{resource.description}
							</div>
						</div>
						<div class="tool-code transition group-hover:text-[var(--primary)]">off-site</div>
					</svelte:element>
				{/each}
			</div>
		</div>
	</section>

	<section class="surface-panel p-6">
		<div class="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
			<div>
				<div class="kicker">Why Recica Tools</div>
				<h2 class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
					Built for speed. Designed for privacy.
				</h2>
			</div>
			<p class="prose-note">
				Your data stays on your device. No accounts, no cloud storage, no tracking pixels. Just
				fast, reliable tools that work when you need them, exactly how you expect.
			</p>
			<div class="mt-4 text-xs text-[var(--text-muted)]">
				Crafted with care by <a
					href="https://recica.dev"
					class="text-[var(--primary)] hover:underline">Drilon Reçica</a
				>, Senior Mobile & Product Engineer
			</div>
		</div>
	</section>
</section>
