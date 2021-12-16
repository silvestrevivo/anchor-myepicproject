<script context="module" lang="ts">
	import { Buffer } from 'buffer';
	import process from 'process';

	globalThis.Buffer = Buffer;
	globalThis.process = process;
</script>

<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { Wallet, WalletError } from '@solana/wallet-adapter-base';

	export let localStorageKey: string,
		wallets: Wallet[],
		autoConnect = false,
		onError = (error: WalletError) => console.error(error);

	let initializeWallet, walletStoreMounted;

	onMount(async () => {
		const { initialize, walletStore } = await import('../utils/walletStore');
		initializeWallet = initialize;
		walletStoreMounted = walletStore;
	});

	$: wallets &&
		initializeWallet &&
		initializeWallet({ wallets, autoConnect, localStorageKey, onError });

	$: walletStoreMounted && setContext('walletStore', walletStoreMounted);
</script>

<svelte:head>
	<script>
		window.global = window;
	</script>
</svelte:head>

<slot walletStoreMounted={$walletStoreMounted} />
