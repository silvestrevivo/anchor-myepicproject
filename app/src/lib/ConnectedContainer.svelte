<script lang="ts">
	import { workSpace } from '@svelte-on-solana/wallet-adapter-anchor';
	import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
	import { web3 } from '@project-serum/anchor';
	import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

	const connection = new Connection($workSpace.network, 'confirmed');

	let gifList = [],
		value = '',
		balance = 0;

	const addGif = async () => {
		let postAccount = web3.Keypair.generate();

		try {
			await $workSpace.program.rpc.addGif(value, {
				accounts: {
					post: postAccount.publicKey,
					author: $workSpace.provider.wallet.publicKey,
					systemProgram: $workSpace.systemProgram.programId
				},
				signers: [postAccount]
			});
		} catch (error) {
			console.log('Error', error);
		}

		const post = await $workSpace.program.account.post.fetch(postAccount.publicKey);

		gifList = gifList.concat(post);
	};

	async function voteGif(id) {
		let postPublicKey = new PublicKey(id);
		try {
			await $workSpace.program.rpc.voteGif({
				accounts: {
					post: postPublicKey
				}
			});
			const post = await $workSpace.program.account.post.fetch(postPublicKey);

			gifList = gifList.map((i) => {
				if (i.id.toString() === post.id.toString()) {
					return { ...i, points: post.points };
				} else {
					return i;
				}
			});
		} catch (error) {
			console.log('Error voting GIF:', error);
		}
	}

	async function getBalance(walletStore) {
		let wallet = walletStore.publicKey;
		balance = (await connection.getBalance(wallet)) / LAMPORTS_PER_SOL;
	}

	async function airdrop() {
		let airdropSignature = await connection.requestAirdrop(
			$walletStore.publicKey,
			LAMPORTS_PER_SOL
		);
		await connection.confirmTransaction(airdropSignature);
		getBalance($walletStore);
	}

	$: getBalance($walletStore);
</script>

{#if balance === null}
	{#if $walletStore.connected && balance <= 0.1}
		<div class="faucet">
			<p>You don't have enough SOL..</p>
			<button on:click={airdrop}>Click to put some money in your wallet</button>
		</div>
	{/if}
{:else}
	<div class="connected-container">
		<form on:submit|preventDefault={addGif}>
			<input type="text" placeholder="Enter gif link!" bind:value />
			<button type="submit" class="cta-button submit-gif-button"> Submit </button>
		</form>
		<div class="gif-grid">
			{#each gifList as { gifLink, author, points, id }}
				<div class="gif-item">
					<img src={gifLink} alt={gifLink} />
					<div class="votes">
						<p>{`${author}`.slice(0, 4) + '..' + `${author}`.slice(-4)}</p>
						<span on:click={() => voteGif(id)}>{points}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
