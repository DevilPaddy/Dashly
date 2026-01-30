# Dashly Setup Guide

This guide will help you set up all the necessary environment variables and services to run Dashly.

## Quick Start

1. Copy the minimal environment file:
```bash
cp .env.local.example .env.local
```

2. Fill in the required values (see sections below)

3. Start the development server:
```bash
npm run dev
```

## Required Setup Steps

### 1. MongoDB Database

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env.local`

**Option B: Local MongoDB**
```bash
MONGODB_URI=mongodb://localhost:27017/dashly
```

### 2. NextAuth Secret

Generate a random secret key:
```bash
# Option 1: Use online generator
# Visit: https://generate-secret.vercel.app/32

# Option 2: Use OpenSSL
openssl rand -base64 32

# Option 3: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Create a new project or select existing one

3. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Enable these APIs:
     - Google+ API
     - Gmail API
     - Google Calendar API

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Dashly"

5. **Configure Redirect URIs**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

6. **Copy Credentials**
   - Copy Client ID and Client Secret to `.env.local`

### 4. Optional: Encryption Key

For additional security (recommended for production):
```bash
# Generate 32-character key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Environment Files

### Development
- Use `.env.local` for local development
- This file is ignored by git

### Production
- Use environment variables in your hosting platform
- Never commit actual secrets to version control

## Verification

After setup, verify everything works:

1. **Database Connection**
   - Check server logs for MongoDB connection success

2. **Authentication**
   - Visit `/login` and try signing in with Google

3. **API Endpoints**
   - Visit `/api/health` to check API status

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check your connection string format
- Ensure IP whitelist includes your IP (Atlas)
- Verify username/password

**Google OAuth Error**
- Verify redirect URIs match exactly
- Check that APIs are enabled
- Ensure credentials are correct

**NextAuth Error**
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set

### Getting Help

1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure all required APIs are enabled in Google Cloud Console

## Security Notes

- Never commit `.env` files to version control
- Use different credentials for development and production
- Regularly rotate secrets in production
- Enable 2FA on all service accounts