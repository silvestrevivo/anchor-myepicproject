<script lang="ts">
	import WalletMultiButton from '$lib/WalletMultiButton.svelte';
	import { onMount, getContext } from 'svelte';
	// import { walletStore } from '../utils/walletStore';
	import { workSpace } from '../utils/workSpace';

	$: myWallet = getContext('walletStore');
	$: console.log('myWallet passed by ContextAPI: ', myWallet);

	// $: console.log('walletStore en index!!!!: ', walletStore);
	// $: console.log('walletStore: ', $walletStore);
	// $: console.log('workSpace: ', $workSpace);
	// $: console.log('getContext', getContext('walletStore'));

	// setTimeout(() => {
	// 	console.log('getContext', getContext('walletStore'));
	// }, 2000);
	// $: console.log('wallet in index!: ', $wallet);
	// let wallet;

	// onMount(async () => {
	// 	const { walletStore } = await import('../utils/walletStore');
	// 	wallet = walletStore;
	// });
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
