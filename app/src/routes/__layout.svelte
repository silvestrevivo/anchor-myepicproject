<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import WalletProvider from '../lib/WalletProvider.svelte';
	import AnchorConnectionProvider from '../lib/AnchorConnectionProvider.svelte';
	import idl from '../../../target/idl/myepicproject.json';
	import '../styles/styles.css';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('devnet');

	let wallets;

	onMount(async () => {
		const { getPhantomWallet } = await import('@solana/wallet-adapter-wallets');
		const walletsMap = [getPhantomWallet()];
		wallets = walletsMap;
	});
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect let:walletStoreMounted>
	{#if walletStoreMounted}
		<AnchorConnectionProvider {network} {idl} />
		<div>
			<slot />
		</div>
	{:else}
		<p>mounting wallet...</p>
	{/if}
</WalletProvider>
