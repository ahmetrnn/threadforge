# X (Twitter) Account Connection Setup

This guide will help you set up X (Twitter) account authentication for ThreadForge.

## Prerequisites

- A Twitter Developer account
- Access to the Twitter Developer Portal

## Step 1: Create a Twitter App

1. Go to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create Project" or "Create App"
3. Fill in the required information:
   - App name: `ThreadForge` (or your preferred name)
   - Description: `Thread generation and publishing tool`
   - Website URL: Your application URL
   - Callback URL / Redirect URI: `YOUR_SUPABASE_URL/auth/v1/callback`
     - Find your Supabase URL in your Supabase project settings
     - Example: `https://your-project.supabase.co/auth/v1/callback`

## Step 2: Get OAuth 2.0 Credentials

1. In your Twitter app settings, navigate to "Keys and Tokens"
2. Under "OAuth 2.0 Client ID and Client Secret", click "Generate"
3. Copy the **Client ID** and **Client Secret** (you'll need these in the next step)
4. Make sure to enable "OAuth 2.0" in your app settings

## Step 3: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Twitter** in the list of providers
4. Enable Twitter authentication
5. Enter your Twitter OAuth credentials:
   - **Client ID**: Paste the Client ID from Step 2
   - **Client Secret**: Paste the Client Secret from Step 2
6. Click **Save**

## Step 4: Update Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
```

## Step 5: Update Database Schema

Run the following SQL in your Supabase SQL editor to add the necessary columns:

```sql
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS x_account_id text,
ADD COLUMN IF NOT EXISTS x_username text,
ADD COLUMN IF NOT EXISTS x_access_token text,
ADD COLUMN IF NOT EXISTS x_refresh_token text,
ADD COLUMN IF NOT EXISTS x_connected_at timestamptz,
ADD COLUMN IF NOT EXISTS x_token_expires_at timestamptz;
```

**Note:** If you're using the provided `supabase.sql` file, these columns are already included in the schema.

## Step 6: Configure Twitter App Permissions

1. In the Twitter Developer Portal, go to your app settings
2. Navigate to "User authentication settings"
3. Set the following permissions:
   - **App permissions**: Read and Write (to allow posting threads)
   - **Type of App**: Web App, Automated App or Bot
   - **Callback URI / Redirect URL**: Your Supabase callback URL (from Step 1)
   - **Website URL**: Your application URL

## Step 7: Test the Connection

1. Start your application
2. Navigate to the login page
3. Click "Continue with X"
4. You should be redirected to Twitter for authorization
5. After authorizing, you'll be redirected back to the dashboard
6. Your X account should now be connected!

## Troubleshooting

### "Authorization failed" error

- Verify your Client ID and Client Secret are correct
- Ensure the callback URL matches exactly in both Twitter and Supabase
- Check that OAuth 2.0 is enabled in your Twitter app settings

### "Failed to connect X account" error

- Make sure your database schema is up to date
- Check your Supabase project permissions
- Verify the environment variables are set correctly

### Token expiration issues

- Twitter OAuth 2.0 tokens expire after a certain period
- The app currently stores tokens but doesn't implement automatic refresh
- For production use, implement token refresh logic in `/app/api/twitter/connect/route.ts`

## Next Steps

Once X account connection is working:

1. Implement thread posting functionality
2. Add token refresh logic for long-lived connections
3. Implement error handling for X API rate limits
4. Add scheduling functionality for optimal posting times

## Security Notes

- Never commit your Twitter Client Secret to version control
- Use environment variables for all sensitive credentials
- Consider encrypting stored access tokens in the database
- Implement proper error handling to avoid leaking sensitive information

## Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [OAuth 2.0 Specification](https://oauth.net/2/)
