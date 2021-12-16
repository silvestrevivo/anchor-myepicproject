<script context="module" lang="ts">
	import { Buffer } from 'buffer';
	import process from 'process';

	globalThis.Buffer = Buffer;
	globalThis.process = process;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Wallet, WalletError } from '@solana/wallet-adapter-base';
	// import { initialize } from '../utils/walletStore';
	// import type { WalletStore } from '../utils/walletStore';

	export let localStorageKey: string,
		wallets: Wallet[],
		autoConnect = false,
		onError = (error: WalletError) => console.error(error);

	let initializeWallet, walletStoreMounted;

	onMount(async () => {
		const { initialize, walletStore } = await import('../utils/walletStore');

		// wallets = walletsMap;
		// initialize({ wallets, autoConnect, localStorageKey, onError });
		initializeWallet = initialize;

		setTimeout(() => {
			walletStoreMounted = walletStore;
		}, 5000);
	});
	$: wallets &&
		initializeWallet &&
		initializeWallet({ wallets, autoConnect, localStorageKey, onError });
</script>

<svelte:head>
	<script>
		window.global = window;
	</script>
</svelte:head>

<slot walletStoreMounted={$walletStoreMounted} />
