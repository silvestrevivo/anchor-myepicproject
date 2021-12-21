const anchor = require('@project-serum/anchor');
const { v4: uuidv4 } = require('uuid');

describe('myepicproject', () => {

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  // Define program
  const program = anchor.workspace.Myepicproject;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Need the system program, will talk about this soon.
  const { SystemProgram } = anchor.web3;
  let id = uuidv4();

  it('Is initialized!', async () => {
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log("Your transaction signature", tx);

    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())
  });

  it('adds a new gif', async () => {
    const tx = await program.rpc.addGif('this is the url of my image', id, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      }
    })

    console.log("Your transaction signature adding gif", tx);
    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())
    console.log('👀 GIF List', account.gifList)
    console.log('👀 Account', account)
  });

  it('vote a gif', async () => {
    const tx = await program.rpc.voteGif( id, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      }
    })

    console.log("Your transaction signature adding gif", tx);
    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())
    console.log('👀 GIF List', account.gifList)
    console.log('👀 Account', account)
  });
});
