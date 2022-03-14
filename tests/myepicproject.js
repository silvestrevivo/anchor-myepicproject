const assert = require("assert");
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
    console.log('👀 GIF List', account.gifList)
    console.log('👀 Account', account)
    assert.ok(account.totalGifs.eq(new anchor.BN(0)));
    assert.equal(account.gifList.toString(), []);
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
    assert.ok(account.totalGifs.toString() == 1);
    assert.ok(account.gifList.toString() == [
      { id,
        gif_link: 'this is the url of my image',
        user_address: provider.wallet.publicKey.toString(),
        points: 0 }
      ]
    );
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
    assert.ok(account.totalGifs.eq(new anchor.BN(1)));
    assert.equal(account.gifList.toString(), [
      { id,
        gif_link: 'this is the url of my image',
        user_address: provider.wallet.publicKey.toString(),
        points: 1 }
      ]);
  });
});
