use anchor_lang::prelude::*;

declare_id!("FS7Mva1nUZCuNcevF4R53uXYbR8VMEBTDjojHTAJFrFr");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        // Initialize total_gifs.
        base_account.total_gifs = 0;
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String, id: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // Build the struct.
        let item = ItemStruct {
            id: id.to_string(),
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            points: 0,
        };

        // Add it to the gif_list vector.
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn vote_gif(ctx: Context<VoteGif>, id: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        // let user = &mut ctx.accounts.user;
        let list = &base_account.gif_list;

        // Map to add score.
        let new_list = list
            .iter()
            .map(|x| {
                if x.id == id {
                    ItemStruct {
                        id: (*x.id).to_string(),
                        gif_link: (*x.gif_link).to_string(),
                        user_address: x.user_address,
                        points: x.points + 1,
                    }
                } else {
                    ItemStruct {
                        id: (*x.id).to_string(),
                        gif_link: (*x.gif_link).to_string(),
                        user_address: x.user_address,
                        points: x.points,
                    }
                }
            })
            .collect();

        base_account.gif_list = new_list;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct VoteGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub id: String,
    pub gif_link: String,
    pub user_address: Pubkey,
    pub points: u64,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}
