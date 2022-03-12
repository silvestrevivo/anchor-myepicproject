<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { workSpace } from '@svelte-on-solana/wallet-adapter-anchor';

	let gifList = null,
		value = '';

	const createGifAccount = async () => {
		try {
			await $workSpace.program.rpc.initialize({
				accounts: {
					baseAccount: $workSpace.baseAccount.publicKey,
					user: $workSpace.provider.wallet.publicKey,
					systemProgram: $workSpace.systemProgram.programId
				},
				signers: [$workSpace.baseAccount]
			});
			console.log(
				'Created a new BaseAccount w/ address:',
				$workSpace.baseAccount.publicKey.toString()
			);
			gifList = [];
		} catch (error) {
			console.log('Error creating BaseAccount account:', error);
		}
	};

	async function sendGif() {
		if (value.length === 0) {
			console.log('No gif link given!');
			return;
		}

		let id = uuidv4();

		try {
			await $workSpace.program.rpc.addGif(value, id, {
				accounts: {
					baseAccount: $workSpace.baseAccount.publicKey,
					user: $workSpace.provider.wallet.publicKey
				}
			});

			const account = await $workSpace.program.account.baseAccount.fetch(
				$workSpace.baseAccount.publicKey
			);
			console.log('account: ', account);

			gifList = account.gifList;
			value = '';
		} catch (error) {
			console.log('Error sending GIF:', error);
		}
	}

	async function voteGif(id) {
		try {
			await $workSpace.program.rpc.voteGif(id, {
				accounts: {
					baseAccount: $workSpace.baseAccount.publicKey,
					user: $workSpace.provider.wallet.publicKey
				}
			});
			const account = await $workSpace.program.account.baseAccount.fetch(
				$workSpace.baseAccount.publicKey
			);
			console.log('account: ', account);

			gifList = account.gifList;
		} catch (error) {
			console.log('Error voting GIF:', error);
		}
	}
</script>

{#if gifList === null}
	<div class="connected-container">
		<button class="cta-button submit-gif-button" on:click={createGifAccount}>
			Do One-Time Initialization For GIF Program Account
		</button>
	</div>
{:else}
	<div class="connected-container">
		<form on:submit|preventDefault={sendGif}>
			<input type="text" placeholder="Enter gif link!" bind:value />
			<button type="submit" class="cta-button submit-gif-button"> Submit </button>
		</form>
		<div class="gif-grid">
			{#each gifList as { gifLink, userAddress, points, id }}
				<div class="gif-item">
					<img src={gifLink} alt={gifLink} />
					<div class="votes">
						<p>{`${userAddress}`.slice(0, 4) + '..' + `${userAddress}`.slice(-4)}</p>
						<span on:click={() => voteGif(id)}>{points}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
