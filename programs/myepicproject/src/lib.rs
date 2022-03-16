use anchor_lang::prelude::*;

declare_id!("6Ai67BaED9LKdtg5bCSSaadgqApcpEtND4zQVkKddR8e");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let author = &ctx.accounts.author;
        let id = post.key();

        require!(gif_link.chars().count() <= 200, ErrorCode::LinkTooLong);

        post.id = id;
        post.gif_link = gif_link;
        post.author = *author.key;
        post.points = 0;

        Ok(())
    }

    pub fn vote_gif(ctx: Context<VoteGif>) -> ProgramResult {
        let post = &mut ctx.accounts.post;

        post.points = post.points + 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(init, payer = author, space = Post::LEN)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteGif<'info> {
    #[account(mut)]
    pub post: Account<'info, Post>,
}

#[account]
pub struct Post {
    pub id: Pubkey,
    pub author: Pubkey,
    pub gif_link: String,
    pub points: u64,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const GIFT_LINK_LENGTH: usize = 200 * 4; // 200 chars max.
const POINTS_LENGTH: usize = 8;

impl Post {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // id.
        + PUBLIC_KEY_LENGTH // Author.
        + STRING_LENGTH_PREFIX + GIFT_LINK_LENGTH // Gift link.
        + POINTS_LENGTH; // Points.
}

#[error]
pub enum ErrorCode {
    #[msg("The provided link should be 200 characters long maximum.")]
    LinkTooLong,
}
