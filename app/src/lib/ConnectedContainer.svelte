<script lang="ts">
	import { workSpace } from '../utils/workSpace';

	let gifList = null,
		value = '';
	// const items = [
	// 	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	// 	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	// 	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	// 	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
	// ];

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

		try {
			await $workSpace.program.rpc.addGif(value, {
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
			console.log('Error sending GIF:', error);
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
			{#each gifList as { gifLink, userAddress }}
				<div class="gif-item">
					<img src={gifLink} alt={gifLink} />
					<p>{userAddress}</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
