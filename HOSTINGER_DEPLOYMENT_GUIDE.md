# Deploy QueryCraft AI to Hostinger

## Prerequisites
- Hostinger hosting account with domain
- Git installed on your computer
- Node.js installed (v18 or higher)

## Step-by-Step Deployment Guide

### Part 1: Clone and Build Locally

1. **Open Terminal/Command Prompt** on your computer

2. **Clone your repository:**
   ```bash
   git clone https://github.com/smike2023/querycraft-ai.git
   cd querycraft-ai
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build for production:**
   ```bash
   npm run build:prod
   ```

   This creates a `dist` folder with your production-ready files.

5. **Verify the build:**
   ```bash
   ls dist
   ```
   
   You should see: `index.html`, `assets/`, etc.

---

### Part 2: Upload to Hostinger

#### Option A: Using File Manager (Easiest)

1. **Login to Hostinger:**
   - Go to https://hpanel.hostinger.com
   - Click on your hosting account

2. **Open File Manager:**
   - Find "File Manager" in the hosting panel
   - Navigate to `public_html` (or your domain's root folder)

3. **Clear existing files (if any):**
   - Select all files in `public_html`
   - Delete them (back them up first if needed)

4. **Upload dist folder contents:**
   - Click "Upload" button
   - Select ALL files from your local `dist` folder
   - Upload them to `public_html`
   
   **Important:** Upload the FILES inside `dist`, not the `dist` folder itself.

5. **Verify upload:**
   You should see in `public_html`:
   ```
   index.html
   assets/
   .htaccess
   ```

#### Option B: Using FTP (FileZilla)

1. **Get FTP credentials from Hostinger:**
   - Go to File Manager section
   - Click "FTP Accounts"
   - Note: hostname, username, password

2. **Connect with FileZilla:**
   - Host: your-hostname (e.g., ftp.yourdomain.com)
   - Username: your-ftp-username
   - Password: your-ftp-password
   - Port: 21

3. **Navigate to public_html:**
   - In the right panel (remote), go to `public_html`

4. **Upload dist contents:**
   - In the left panel (local), navigate to your `dist` folder
   - Select ALL files inside `dist`
   - Drag them to the right panel (`public_html`)

---

### Part 3: Configure Domain

1. **Point domain to public_html:**
   - In Hostinger panel, go to "Domains"
   - Your domain should already point to `public_html`
   - If not, set document root to `public_html`

2. **Enable HTTPS:**
   - Go to SSL/TLS section
   - Install free Let's Encrypt certificate
   - Enable "Force HTTPS"

---

### Part 4: Test Your Site

1. **Visit your domain:**
   ```
   https://yourdomain.com
   ```

2. **Test all features:**
   - Sign up / Login
   - Try each of the 8 tools
   - Check MongoDB connections
   - Test AI features

---

## Troubleshooting

### Issue: Blank page or 404 errors when navigating

**Solution:** Make sure `.htaccess` file is uploaded to `public_html`

If not, create it manually:

1. In File Manager, click "New File"
2. Name it `.htaccess`
3. Edit and paste:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteCond %{REQUEST_FILENAME} !-l
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. Save

### Issue: Features not working / API errors

**Check:** Environment variables were included in build.

Make sure `.env.production` existed when you ran `npm run build:prod`.

### Issue: Slow loading

**Solution:** Enable caching in Hostinger:
- Go to Advanced → Performance
- Enable "Website Cache"
- Enable "Browser Cache"

---

## Updating Your Site

When you make changes:

1. **Make changes locally:**
   ```bash
   cd querycraft-ai
   # make your code changes
   ```

2. **Commit to GitHub:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

3. **Rebuild:**
   ```bash
   npm run build:prod
   ```

4. **Re-upload:**
   - Upload new `dist` contents to Hostinger
   - Overwrite existing files

---

## Environment Variables

Your app uses these (already configured in `.env.production`):

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase public key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

These are baked into the build when you run `npm run build:prod`.

**Security Note:** The anon key is safe to expose (it's public). The OpenAI key should ideally be moved to Supabase Edge Functions for production.

---

## Cost

**Hostinger hosting:** Whatever you're already paying
**No additional costs** for this deployment!

---

## Domain Example

If your Hostinger domain is `mycoolsite.com`, your app will be at:
```
https://mycoolsite.com
```

If you want a subdomain like `querycraft.mycoolsite.com`:
1. In Hostinger, create subdomain
2. Point it to a new folder (e.g., `public_html/querycraft`)
3. Upload dist contents there

---

## Support

**Hostinger Support:**
- Live chat available 24/7
- Can help with FTP, domain, SSL issues

**React/Code Issues:**
- Check GitHub repository issues
- Supabase dashboard for backend logs

---

## Quick Reference: File Structure on Hostinger

```
public_html/
├── index.html           (your main app)
├── .htaccess           (routing configuration)
├── assets/
│   ├── index-[hash].js  (your React app)
│   ├── index-[hash].css (styles)
│   └── [other assets]
└── [other static files]
```

---

## Next Steps After Deployment

1. Test all 8 tools thoroughly
2. Share URL with potential employers/clients
3. Monitor Supabase usage (free tier limits)
4. Consider moving OpenAI API key to Edge Functions for better security

---

**Need help?** Issues with Hostinger upload? Let me know which step you're stuck on!
