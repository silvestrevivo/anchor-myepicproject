<script lang="ts">
	import { onMount } from 'svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import WalletProvider from '../lib/WalletProvider.svelte';
	import AnchorConnectionProvider from '../lib/AnchorConnectionProvider.svelte';

	import idl from '../../../target/idl/myepicproject.json';
	import '../styles/styles.css';

	const localStorageKey = 'walletAdapter';
	// const network = 'http://127.0.0.1:8899';
	const network = clusterApiUrl('devnet');

	let wallets;

	onMount(async () => {
		const { getPhantomWallet } = await import('@solana/wallet-adapter-wallets');
		const walletsMap = [getPhantomWallet()];
		wallets = walletsMap;
	});
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<AnchorConnectionProvider {network} {idl} />
<div>
	<slot><!-- optional fallback --></slot>
</div>
