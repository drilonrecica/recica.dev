<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CodeField from '$lib/components/workbench/CodeField.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import { resources } from '$lib/constants/resources';
	import { tools } from '$lib/constants/tools';
	import { searchTools } from '$lib/search/tools';
	import type { ToolDefinition } from '$lib/types/tool';
	import { SITE_ORIGIN } from '$lib/utils/site-indexing';
	import {
		buildCollectionPageSchema,
		buildOrganizationSchema,
		buildToolListSchema,
		buildWebsiteSchema
	} from '$lib/utils/seo';
	import { detectContent, type Detection } from '$lib/workbench/detect';
	import { stageHandoff } from '$lib/workbench/handoff';
	import { createDebounced } from '$lib/workbench/live';
	import { prefs } from '$lib/workbench/prefs';

	const homeDescription =
		'Privacy-first browser tools for JSON formatting, QR code generation, regex testing, Base64 encoding, URL inspection, timestamps, hashing, SQL work, and more. Runs locally with no accounts or uploads.';

	const categories = [...new Set(tools.map((tool) => tool.category))];
	const toolById = new Map(tools.map((tool) => [tool.id, tool]));
	const PASTE_LIMIT = 1024 * 1024;

	let query = $state('');
	let selectedCategories = $state<string[]>([]);
	let pasted = $state('');
	let detections = $state<Detection[]>([]);

	const detectLater = createDebounced(() => {
		detections = detectContent(pasted);
	}, 120);

	function handlePasteInput() {
		detectLater.call();
	}

	function openDetection(detection: Detection) {
		const tool = toolById.get(detection.toolId);
		if (!tool) return;
		stageHandoff({ toolId: tool.id, payload: pasted.trim(), from: 'home' });
		void goto(resolve(tool.route));
	}

	function handlePasteKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			detectLater.flush();
			const first = detections[0];
			if (first) openDetection(first);
		}
	}

	function clearCategoryFilters() {
		selectedCategories = [];
	}

	function toggleCategory(category: string) {
		selectedCategories = selectedCategories.includes(category)
			? selectedCategories.filter((value) => value !== category)
			: [...selectedCategories, category];
	}

	const searchedTools = $derived(searchTools(query));
	const filteredTools = $derived(
		selectedCategories.length
			? searchedTools.filter((tool) => selectedCategories.includes(tool.category))
			: searchedTools
	);
	const grouped = $derived(
		categories
			.map((category) => ({
				category,
				tools: filteredTools.filter((tool) => tool.category === category)
			}))
			.filter((group) => group.tools.length)
	);
	const favoriteTools = $derived(
		$prefs.favorites.map((id) => toolById.get(id)).filter((tool): tool is ToolDefinition => !!tool)
	);
	const recentTools = $derived(
		$prefs.recents
			.map((id) => toolById.get(id))
			.filter((tool): tool is ToolDefinition => !!tool && !$prefs.favorites.includes(tool.id))
	);

	const schemas = [
		buildWebsiteSchema(SITE_ORIGIN, homeDescription),
		buildOrganizationSchema(SITE_ORIGIN),
		buildCollectionPageSchema(SITE_ORIGIN, homeDescription),
		buildToolListSchema(SITE_ORIGIN, tools)
	];

	onMount(() => {
		prefs.init();
		return () => detectLater.cancel();
	});
</script>

<SeoHead
	title="Free Browser Tools for JSON, QR Codes, Regex, Base64, URLs, and More"
	description={homeDescription}
	keywords={[
		'free developer tools',
		'json formatter',
		'qr code generator',
		'regex tester',
		'base64 encoder',
		'url tools',
		'timestamp converter',
		'privacy-first browser tools'
	]}
	{schemas}
	imageAlt="Recica Tools social card showing privacy-first browser tools"
/>

<div class="grid gap-8">
	<section class="frontdoor" aria-labelledby="frontdoor-title">
		<div class="grid gap-2">
			<p class="kicker kicker--accent">Utility Switchboard</p>
			<h1 id="frontdoor-title">Free browser tools for developers and everyday technical work.</h1>
			<p class="frontdoor__lede">
				Paste anything below and the right tool is one keystroke away. JSON, JWTs, Base64, URLs,
				timestamps, colors, SQL, dotenv, and more. Everything runs locally with no accounts,
				uploads, or tracking.
			</p>
		</div>

		<CodeField
			id="frontdoor-input"
			label="Paste anything"
			bind:value={pasted}
			rows={5}
			maxBytes={PASTE_LIMIT}
			placeholder={'{"paste":"json"}  ·  eyJhbGci…  ·  https://…?a=1  ·  1735689600  ·  #0f7a4c'}
			help="Detection runs in this tab. Press Ctrl+Enter or ⌘Enter to open the top suggestion."
			oninput={handlePasteInput}
			onkeydown={handlePasteKeydown}
		/>

		<div class="suggest" role="group" aria-live="polite" aria-label="Suggested tools">
			{#if detections.length}
				{#each detections as detection, index (detection.toolId)}
					{@const tool = toolById.get(detection.toolId)}
					{#if tool}
						<button
							type="button"
							class={`suggest__chip${index === 0 ? ' suggest__chip--top' : ''}`}
							onclick={() => openDetection(detection)}
						>
							<span>{detection.label}</span>
							<span class="tool-code">{tool.route}</span>
						</button>
					{/if}
				{/each}
			{:else if pasted.trim()}
				<span class="tool-code">No specific match. Pick a tool from the index below.</span>
			{/if}
		</div>
	</section>

	{#if favoriteTools.length || recentTools.length}
		<section class="grid gap-3" aria-label="Your tools">
			{#if favoriteTools.length}
				<div class="grid gap-2">
					<p class="kicker">Favorites</p>
					<div class="quickrow">
						{#each favoriteTools as tool (tool.id)}
							<a href={resolve(tool.route)}>{tool.name}</a>
						{/each}
					</div>
				</div>
			{/if}
			{#if recentTools.length}
				<div class="grid gap-2">
					<p class="kicker">Recent</p>
					<div class="quickrow">
						{#each recentTools as tool (tool.id)}
							<a href={resolve(tool.route)}>{tool.name}</a>
						{/each}
					</div>
				</div>
			{/if}
		</section>
	{/if}

	<section class="grid gap-5" aria-labelledby="index-title">
		<div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] md:items-end">
			<div>
				<p class="kicker">Tool Index</p>
				<h2 id="index-title" class="mt-1 text-xl font-semibold">Browse all tools</h2>
			</div>
			<label class="field">
				<span class="field__label">Find a tool</span>
				<input
					class="input-base"
					type="search"
					placeholder="Search by task, tool, or keyword"
					bind:value={query}
					aria-describedby="index-count"
				/>
				<span class="field__help" id="index-count"
					>{filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} available</span
				>
			</label>
		</div>

		<div class="flex flex-wrap items-center gap-2" aria-label="Filter by category">
			<span class="tool-code mr-1">Filter by category</span>
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
			<span class="tool-code ml-auto">{filteredTools.length} shown</span>
		</div>

		{#if grouped.length}
			<div class="index">
				{#each grouped as group (group.category)}
					<div class="index__group">
						<h2>{group.category}</h2>
						{#each group.tools as tool (tool.id)}
							<div class="index__row" data-tool-number={tool.number}>
								<a href={resolve(tool.route)}>
									<strong>{tool.name}</strong>
									<p>{tool.description}</p>
								</a>
								<div class="index__side">
									<span class="tool-code hidden sm:inline">{tool.route}</span>
									<button
										type="button"
										class="star"
										aria-pressed={$prefs.favorites.includes(tool.id)}
										aria-label={`Favorite ${tool.name}`}
										onclick={() => prefs.toggleFavorite(tool.id)}
									>
										<svg
											aria-hidden="true"
											viewBox="0 0 24 24"
											class="h-4 w-4"
											fill={$prefs.favorites.includes(tool.id) ? 'currentColor' : 'none'}
											stroke="currentColor"
											stroke-width="1.6"
										>
											<path
												d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.8 6.7 19.6l1.1-5.8L3.5 9.7l5.9-.8z"
											/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{:else}
			<div class="result-empty">
				<div>
					<div class="text-base font-semibold text-[var(--ink)]">No tool matches that search.</div>
					<div class="mt-2 text-sm">
						Try broader terms like json, qr, regex, sql, hash, or timestamp.
					</div>
				</div>
			</div>
		{/if}
	</section>

	<section class="about" aria-label="About Recica Tools">
		<div data-span="2">
			<h2>Built for speed, designed for privacy</h2>
			<p>
				Your data stays on your device. No accounts, no cloud storage, no tracking pixels. Inputs
				never leave browser memory; only your theme and favorite tools are remembered.
			</p>
			<p class="mt-2">
				Crafted by <a href="https://recica.dev" target="_blank" rel="noreferrer">Drilon Reçica</a>,
				Senior Mobile &amp; Product Engineer.
			</p>
		</div>
		<div>
			<h2>External resources</h2>
			<ul>
				{#each resources as resource (resource.href)}
					<li>
						<svelte:element this={'a'} href={resource.href} target="_blank" rel="noreferrer"
							>{resource.label}</svelte:element
						>
						<span class="tool-code"> · off-site</span><br />{resource.description}
					</li>
				{/each}
			</ul>
		</div>
	</section>
</div>
