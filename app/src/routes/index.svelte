<script lang="ts">
	import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
	import ConnectedContainer from '$lib/ConnectedContainer.svelte';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';

	$: ({ connected } = $walletStore);

	// Constants
	const TWITTER_HANDLE = 'silvestrevivo';
	const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
</script>

<div class="address">
	<WalletMultiButton />
</div>

<div class="App">
	<div class="container">
		<div class="header-container">
			<p class="header">🖼 GIF Portal</p>
			<p class="sub-text">View your GIF collection in the metaverse ✨</p>
			{#if connected}
				<ConnectedContainer />
			{/if}
		</div>
		<div class="footer-container">
			<img alt="Twitter Logo" class="twitter-logo" src="twitter-logo.svg" />
			<a class="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer"
				>{`built by @${TWITTER_HANDLE}`}</a
			>
		</div>
	</div>
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
