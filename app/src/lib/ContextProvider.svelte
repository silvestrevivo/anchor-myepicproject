<script lang="ts">
	import { setContext } from 'svelte';
	export let walletStoreMounted;
	$: console.log('walletStoreMounted in Provider: ', walletStoreMounted);

	$: walletStoreMounted && setContext('walletStore', walletStoreMounted);
</script>

<slot />
