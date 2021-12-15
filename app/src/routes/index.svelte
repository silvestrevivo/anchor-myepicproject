<script lang="ts">
	import WalletMultiButton from '$lib/WalletMultiButton.svelte';
	import { walletStore } from '../utils/walletStore';
	import { workSpace } from '../utils/workSpace';

	$: console.log('walletStore: ', $walletStore);
	$: console.log('workSpace: ', $workSpace);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="address">
	<WalletMultiButton />
</div>

<style>
	.address {
		position: absolute;
		right: 30px;
		top: 30px;
		border-radius: 5px;
		padding: 10px;
	}
</style>
