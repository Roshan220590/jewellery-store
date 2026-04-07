# 🚀 Quick Reference - Daily Website Management

## ⚡ 5-Minute Updates

### 💰 Change Price
1. Open `src/data/products.js`
2. Find product (Ctrl+F)
3. Change `price: 2999`
4. Save (Ctrl+S)

### 📦 Update Stock
1. Open `src/data/products.js`
2. Find product
3. Change `inStock: false`
4. Save

### 🏷️ Add Sale Badge
1. Open `src/data/products.js`
2. Add `originalPrice: 3999` (higher than price)
3. Add `badge: "SALE"`
4. Save

---

## 🖼️ Image Updates

### 📸 Change Product Image
```javascript
images: [
  "https://new-image-url.jpg"
]
```

### 🏷️ Change Category Image
```javascript
// In src/pages/Home.jsx
'necklaces': 'https://new-category-image.jpg'
```

---

## 🎨 Brand Updates

### 📝 Change Tagline
**File:** `src/components/Header.jsx` (line 78)
```javascript
"Your New Tagline"
```

### 🏷️ Change Brand Name
**File:** `src/components/Header.jsx` (lines 44, 66)
```javascript
<span>NEW</span>  // Line 44
<span>NAME</span> // Line 66
```

---

## 🚀 Deploy Website

### 📦 Build & Upload
```bash
npm run build
# Upload 'dist' folder to hosting
```

### 🔄 Daily Update Workflow
**IMPORTANT:** You MUST rebuild and upload after ANY changes!

#### ⚡ Quick Update Process:
1. Make changes (products, prices, etc.)
2. Test locally (`npm run dev`)
3. Build production (`npm run build`)
4. Upload `dist` folder to server
5. Changes are live!

#### 📅 Smart Schedule:
- **Daily:** Price changes, stock updates
- **Weekly:** New products, category updates  
- **Monthly:** Major content changes

#### ⏰ Time Investment:
- **Small updates:** 5-10 minutes
- **Medium updates:** 15-30 minutes
- **Large updates:** 30-60 minutes

#### 💡 Pro Tips:
- **Batch changes** - upload once for multiple updates
- **Test locally** before uploading
- **Keep backup** of working `dist` folder
- **Verify live site** after upload

---

## 🆘 Emergency Fixes

### 💥 Website Not Working
```bash
npm run dev
# Check for errors in terminal
```

### 🖼️ Images Not Showing
- Check image URLs
- Test links in browser
- Ensure correct file paths

### 📦 Products Missing
- Check for syntax errors
- Verify product IDs are unique
- Ensure category exists

---

## 📞 Important Files

| Purpose | File Location |
|---------|--------------|
| Products | `src/data/products.js` |
| Categories | Bottom of `src/data/products.js` |
| Header/Brand | `src/components/Header.jsx` |
| Home Page | `src/pages/Home.jsx` |
| Contact Info | `src/pages/Contact.jsx` |
| Shop Page | `src/pages/Shop.jsx` |

---

## ⌨️ Keyboard Shortcuts

| Action | Windows | Mac |
|--------|----------|-----|
| Save | Ctrl+S | Cmd+S |
| Find | Ctrl+F | Cmd+F |
| Replace | Ctrl+H | Cmd+H |
| Undo | Ctrl+Z | Cmd+Z |
| Refresh Browser | Ctrl+F5 | Cmd+Shift+R |

---

## 🎯 Daily Checklist

### ✅ Before Publishing
- [ ] Test all changes locally
- [ ] Check image links
- [ ] Verify prices are correct
- [ ] Test mobile view
- [ ] Check contact info

### ✅ After Publishing
- [ ] Test live website
- [ ] Check all pages load
- [ ] Verify images show
- [ ] Test contact forms
- [ ] Check mobile version

---

**📞 Need Help?** Check `WEBSITE_MANAGEMENT_GUIDE.md` for detailed instructions.
