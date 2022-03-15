const assert = require("assert");
const anchor = require('@project-serum/anchor');

describe('myepicproject', () => {

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  // Define program
  const program = anchor.workspace.Myepicproject;

  // we define an initial post outside to be reused on another test
  const postTest = anchor.web3.Keypair.generate();

  it('Adds a new GIF!', async () => {
    await program.rpc.addGif('link address', {
      accounts: {
        post: postTest.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [postTest]
    });

    // Fetch the account details of the created post.
    const postAccount = await program.account.post.fetch(postTest.publicKey);

    // assertions
    assert.equal(postAccount.id.toBase58(), postTest.publicKey.toBase58());
    assert.equal(postAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(postAccount.gifLink, 'link address');
    assert.ok(postAccount.points);
  });

  it('Adds a second GIF!', async () => {
    const post = anchor.web3.Keypair.generate();

    await program.rpc.addGif('second link address', {
      accounts: {
        post: post.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [post]
    });

    // Fetch the account details of the created post.
    const postAccount = await program.account.post.fetch(post.publicKey);

    // assertions
    assert.equal(postAccount.id.toBase58(), post.publicKey.toBase58());
    assert.equal(postAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(postAccount.gifLink, 'second link address');
    assert.ok(postAccount.points);
  });

  it('cannot provide a link with more than 200 characters', async () => {
    const post = anchor.web3.Keypair.generate();

    const linkWith201Chars = 'x'.repeat(201);
    try {
      await program.rpc.addGif(linkWith201Chars, {
        accounts: {
          post: post.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [post]
      });
    } catch (error) {
      return;
    }

    assert.fail('The instruction should have failed with a 201-character link.');
  });

  it('can fetch all posts', async () => {
    const postAccounts = await program.account.post.all();

    assert.equal(postAccounts.length, 2);
  });

  it('Vote the post test!', async () => {
    await program.rpc.voteGif({
      accounts: {
        post: postTest.publicKey,
      },
    });

    // Fetch the account details of the updated post.
    const updatedPostAccount = await program.account.post.fetch(postTest.publicKey);
    console.log('updatedPostAccount: ', updatedPostAccount);

    assert.equal(updatedPostAccount.id.toBase58(), postTest.publicKey.toBase58());
    assert.equal(updatedPostAccount.points, 1);
  });
});
