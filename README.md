# WorldPulse MVP

A modern, serverless MVP built with **DaisyUI** + **Tailwind CSS** for the frontend, **Google Apps Script** for the backend API, **Google Sheets** for the database, and **Looker Studio** for analytics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | DaisyUI + Tailwind CSS + Vanilla JavaScript |
| **Hosting** | GitHub Pages |
| **Backend** | Google Apps Script (serverless REST API) |
| **Database** | Google Sheets |
| **Analytics** | Looker Studio |

## Project Structure

```
worldpulse/
├── index.html                          # Main HTML page
├── js/
│   └── main.js                        # Frontend JavaScript
├── css/
│   └── custom.css                     # Custom styles (optional)
├── docs/
│   ├── GOOGLE_APPS_SCRIPT.md          # Backend setup guide
│   └── ANALYTICS_SETUP.md             # Analytics configuration
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Pages deployment
└── README.md                          # This file
```

## Quick Start

### Prerequisites

- GitHub account
- Google account (for Apps Script, Sheets, and Looker Studio)

### 1. Clone and Setup

```bash
git clone https://github.com/YOUR_USERNAME/worldpulse.git
cd worldpulse
```

### 2. Configure Backend

1. Follow [GOOGLE_APPS_SCRIPT.md](./docs/GOOGLE_APPS_SCRIPT.md) to:
   - Create Google Sheets database
   - Set up Google Apps Script
   - Deploy as web app
   - Get your API URL

2. Update `js/main.js` with your API URL:
   ```javascript
   const API_BASE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
   ```

### 3. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Select `main` branch as source
3. Your site will be live at `https://YOUR_USERNAME.github.io/worldpulse/`

### 5. Set Up Analytics

Follow [ANALYTICS_SETUP.md](./docs/ANALYTICS_SETUP.md) to create dashboards in Looker Studio.

## Features

✅ **Fully Responsive**: Works on mobile, tablet, and desktop  
✅ **No Backend Server**: All logic runs serverless  
✅ **Real-time Database**: Google Sheets synced data  
✅ **Easy Analytics**: Looker Studio dashboards  
✅ **Auto-deployed**: GitHub Pages with CI/CD  
✅ **Accessible**: DaisyUI components are WCAG compliant  

## Development

### Local Development

1. Install a local web server:
   ```bash
   python -m http.server 8000
   ```

2. Open `http://localhost:8000` in your browser

### Making Changes

1. Edit HTML, CSS, or JavaScript files
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys to GitHub Pages

### Adding Components

DaisyUI comes with pre-built components:
- Buttons, cards, modals, forms
- Navigation, dropdowns, menus
- Alerts, toasts, notifications
- And more...

See [DaisyUI documentation](https://daisyui.com/) for available components.

## API Reference

### Get Data
```javascript
GET /exec?action=getData
```

Response:
```json
[
  {
    "id": "uuid-1",
    "title": "Item 1",
    "description": "Description",
    "timestamp": "2026-02-03"
  }
]
```

### Add Data
```javascript
POST /exec
{
  "action": "addData",
  "title": "New Item",
  "description": "Description"
}
```

### Update Data
```javascript
POST /exec
{
  "action": "updateData",
  "id": "uuid-1",
  "title": "Updated Title"
}
```

### Delete Data
```javascript
POST /exec
{
  "action": "deleteData",
  "id": "uuid-1"
}
```

See [GOOGLE_APPS_SCRIPT.md](./docs/GOOGLE_APPS_SCRIPT.md) for detailed implementation.

## Deployment Checklist

- [ ] Google Apps Script deployed with Web App URL
- [ ] API URL added to `js/main.js`
- [ ] Google Sheet database configured
- [ ] GitHub repository created and pushed
- [ ] GitHub Pages enabled
- [ ] Looker Studio dashboard created
- [ ] Custom domain configured (optional)

## Performance Tips

1. **Minimize API Calls**: Cache data when possible
2. **Optimize Sheets**: Archive old data, use filters
3. **CDN Resources**: DaisyUI and Tailwind CSS loaded from CDN
4. **Lazy Loading**: Load components only when needed

## Security Considerations

⚠️ **Public API**: Google Apps Script deployment is public. For sensitive data:
- Add authentication layer
- Use environment variables for API keys
- Validate all inputs in Apps Script
- Implement rate limiting

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 404 | Check API URL in `js/main.js` matches deployment |
| CORS errors | Ensure Apps Script headers are set correctly |
| Sheets not updating | Verify Sheet ID and Sheet Name in Apps Script |
| GitHub Pages not deploying | Check `.github/workflows/deploy.yml` |
| Looker Studio can't connect | Verify Google Sheet is not restricted to private |

## Cost Analysis

- **Frontend Hosting**: FREE (GitHub Pages)
- **Backend**: FREE (Google Apps Script)
- **Database**: FREE (Google Sheets)
- **Analytics**: FREE (Looker Studio free tier)

**Total Cost: $0** for MVP

## Next Steps for Production

1. **Add Authentication**: Google Sign-in integration
2. **Custom Domain**: Point domain to GitHub Pages
3. **Error Monitoring**: Implement logging service
4. **Backup Strategy**: Regular Google Sheets backups
5. **Scaling**: Consider Firebase for larger datasets
6. **Paid Analytics**: Upgrade Looker Studio if needed

## Resources

- [DaisyUI Components](https://daisyui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Looker Studio Help](https://support.google.com/looker-studio)

## License

MIT License - feel free to use this as a template for your projects.

## Support

For issues or questions:
1. Check documentation files in `/docs`
2. Review GitHub Issues
3. Create a new issue with detailed description

---

**Built with ❤️ for rapid MVP development**
