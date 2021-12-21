<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { Connection } from '@solana/web3.js';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { workSpace } from '../utils/workSpace';
	import * as pkg from '@project-serum/anchor';
	import type { WalletStore } from '../utils/walletStore';

	const { web3, Provider, Program } = pkg;

	const walletStore: SvelteStore<WalletStore> = getContext('walletStore');

	export let idl,
		network: string,
		config: Commitment | ConnectionConfig | undefined = 'processed';

	const { PublicKey } = web3;
	const programID = new PublicKey(idl.metadata.address);
	const baseAccount = web3.Keypair.generate();
	const systemProgram = web3.SystemProgram;
	const connection = new Connection(network, config);

	function defineProgramAndProvider(walletStore) {
		console.log('defineProgramAndProvider: ', defineProgramAndProvider);
		let { sendTransaction, signTransaction, signAllTransactions, signMessage, publicKey } =
			walletStore;
		const providerWallet = {
			sendTransaction,
			signTransaction,
			signAllTransactions,
			signMessage,
			publicKey
		};
		const provider = new Provider(connection, providerWallet, {
			preflightCommitment: 'processed'
		});
		const program = new Program(idl, programID, provider);
		console.log('program: ', program);
		workSpace.set({ baseAccount, connection, provider, program, systemProgram, network });
		return { baseAccount, connection, provider, program, systemProgram, network };
	}

	$: $walletStore && $walletStore.publicKey && defineProgramAndProvider($walletStore);
	$: $walletStore &&
		$walletStore.publicKey &&
		setContext('workSpace', defineProgramAndProvider($walletStore));
</script>

<slot />
