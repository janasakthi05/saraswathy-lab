# Deployment Guide for Saraswathy Lab & Medicals

This guide walks you through deploying your Next.js application to **Vercel** with a free, persistent cloud **PostgreSQL** database (via **Neon.tech** or **Supabase**).

---

## Architecture Overview
- **Frontend & API**: Hosted on **Vercel** (Free global CDN, serverless functions, automatic HTTPS/SSL).
- **Database**: Hosted on **Neon.tech** (Free Serverless PostgreSQL, automatic scaling, no credit card required).
- **Repository**: Hosted on **GitHub** (Private or Public).

---

## Step 1: Push Project to GitHub

1. Open your browser, go to [GitHub.com](https://github.com), and log in.
2. Click the **+** icon in the top right and select **New repository**.
3. Name your repository (e.g., `saraswathy-lab`).
4. Keep it **Private** (or Public) and do **NOT** check "Initialize with README", .gitignore, or license (we already created these).
5. Click **Create repository**.
6. In your terminal in this project folder, run:

```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/saraswathy-lab.git
git push -u origin main
```
*(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*

---

## Step 2: Create a Free Cloud Database (Neon.tech)

Vercel functions are serverless and ephemeral, so your database must live in the cloud to ensure all enquiries, reviews, and admin updates persist safely.

1. Go to [neon.tech](https://neon.tech) and sign up/log in with your GitHub account.
2. Click **Create Project**.
   - Project Name: `saraswathylab-db`
   - Region: Select the closest region (e.g. `ap-southeast-1` or `eu-central-1` / `us-east-2`).
3. Click **Create Project**.
4. You will immediately see a **Connection Details** box.
5. Copy the connection string under **Prisma** or **PostgreSQL connection string**. It looks like this:
   ```env
   postgresql://username:password@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## Step 3: Create Tables & Seed Data to Cloud Database

From your local machine, run the following commands to create all database tables in Neon and seed the entire diagnostic catalog:

```powershell
# Set your Neon database URL for this terminal session:
$env:DATABASE_URL="your_copied_neon_postgresql_url_here"

# Push Prisma schema to create all tables:
npx prisma db push

# Seed the full catalog (14 categories, 100+ tests, X-Rays, ECGs, Admin account):
npx prisma db seed
```

---

## Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in using your **GitHub** account.
2. Click the **Add New...** button and choose **Project**.
3. Find your `saraswathy-lab` repository and click **Import**.
4. In the **Configure Project** screen:
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./` (leave default).
5. Expand the **Environment Variables** section and add the following keys:

| Environment Variable | Value | Notes |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Your Neon PostgreSQL connection string |
| `AUTH_SECRET` | *(Random 32-character string)* | e.g. `saraswathy_prod_auth_secret_secure_key_99` |
| `ADMIN_EMAIL` | `your_admin_email@example.com` | Your Admin login email |
| `ADMIN_PASSWORD` | `your_admin_password_here` | Your Admin login password |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Updated to your live Vercel URL |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `SMTP_PORT` | `465` | SSL Port |
| `SMTP_USER` | `janasakthip2005@gmail.com` | Your Gmail address |
| `SMTP_PASSWORD` | `your_smtp_password_here` | Google App Password |
| `EMAIL_FROM` | `Saraswathy Lab <onboarding@resend.dev>` | Sender email header |
| `RESEND_API_KEY` | `re_your_resend_api_key_here` | Resend API key |
| `GOOGLE_PLACES_API_KEY`| *(Optional)* | For live Google Reviews sync |
| `GOOGLE_PLACE_ID` | *(Optional)* | Google Places ID for Saraswathy Lab |

6. Click **Deploy**.
7. Vercel will install dependencies, run `prisma generate`, compile the Next.js production build, and assign you a live HTTPS URL (e.g. `https://saraswathy-lab.vercel.app`) in under 2 minutes!

---

## Step 5: Adding a Custom Domain (Optional)

If you own a custom domain (e.g. `saraswathylab.com` from GoDaddy, Namecheap, Hostinger):
1. In your Vercel project dashboard, go to **Settings** → **Domains**.
2. Type your domain name and click **Add**.
3. Vercel will provide 2 simple DNS records:
   - **A Record**: Point `@` to `76.76.21.21`
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Enter these in your domain provider's DNS management panel. Vercel will automatically provision a free SSL certificate.
