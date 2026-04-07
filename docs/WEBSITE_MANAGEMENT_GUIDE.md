# R&S Jewellery Website - Complete Management Guide

## 📋 Table of Contents
1. [Daily Operations](#daily-operations)
2. [Product Management](#product-management)
3. [Image Management](#image-management)
4. [Category Management](#category-management)
5. [Website Deployment](#website-deployment)
6. [Backup & Safety](#backup--safety)
7. [Troubleshooting](#troubleshooting)

---

## 🔄 Daily Operations

### Quick Updates (5-10 minutes)
- **Change Prices:** Edit `src/data/products.js`
- **Update Stock:** Change `inStock: true/false`
- **Modify Descriptions:** Edit product descriptions
- **Add Sales:** Set `originalPrice` higher than `price`

### Regular Updates (30 minutes)
- **Add New Products:** Follow product management steps
- **Update Categories:** Modify category information
- **Change Brand Info:** Edit header components
- **Update Contact Info:** Edit contact page

---

## 📦 Product Management

### 📍 Location: `src/data/products.js`

### 🔧 Add New Product
```javascript
{
  id: 123, // Unique number (increment from last product)
  name: "Product Name",
  category: "necklaces", // Must match category ID
  price: 2999,
  originalPrice: 3999, // Optional (for sale items)
  description: "Beautiful product description...",
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg" // Optional second image
  ],
  inStock: true,
  isNewArrival: true, // Optional (for new items)
  badge: "NEW", // Optional: "NEW", "SALE", "LIMITED"
  badgeColor: "bg-green-500", // Optional badge color
  rating: 4.8, // 1-5 star rating
  sizes: ["Free Size"], // Optional: ["S", "M", "L", "Free Size"]
  materials: ["Gold Plated"], // Optional materials
  occasions: ["Party", "Daily"] // Optional occasions
}
```

### ✏️ Edit Existing Product
1. **Find Product:** Search by product ID or name
2. **Make Changes:** Edit any field (price, description, stock, etc.)
3. **Save File:** Ctrl+S to save
4. **Refresh Website:** Changes appear automatically

### 🗑️ Delete Product
1. **Find Product:** Locate the product object
2. **Remove Entire Block:** Delete from `{` to `},`
3. **Check Commas:** Ensure proper comma placement
4. **Save & Test:** Refresh website

### 📝 Update Multiple Products
- **Find & Replace:** Ctrl+F for batch updates
- **Price Changes:** Update all prices at once
- **Stock Updates:** Change `inStock` status
- **Category Moves:** Change `category` field

---

## 🖼️ Image Management

### 📁 Image Locations
- **Hero Images:** `public/images/home/`
- **Category Images:** `public/images/categories/`
- **Product Images:** Use URLs (recommended) or `public/images/products/`

### 🔄 Update Product Images
```javascript
// Option 1: Use Image URLs (Recommended)
images: [
  "https://your-cdn.com/product1.jpg",
  "https://your-cdn.com/product2.jpg"
]

// Option 2: Use Local Images
images: [
  "/images/products/necklace1.jpg",
  "/images/products/necklace2.jpg"
]
```

### 📸 Add Category Images
1. **Go to:** `src/pages/Home.jsx`
2. **Find:** `categoryImages` object (line ~7)
3. **Add/Update:**
```javascript
const categoryImages = {
  'necklaces': 'https://your-image-url.jpg',
  'earrings': 'https://your-image-url.jpg',
  // Add new categories here
};
```

### 🌐 Recommended Image Sources
- **Unsplash:** Free high-quality images
- **Pexels:** Free stock photos
- **Your Own Photos:** Upload to imgur.com or similar
- **CDN Services:** Cloudinary, AWS S3 (for production)

### 📏 Image Specifications
- **Product Images:** 800x800px (square)
- **Category Images:** 300x400px (portrait)
- **Hero Images:** 1920x1080px (landscape)
- **File Size:** Under 500KB for fast loading

---

## 🏷️ Category Management

### 📍 Location: `src/data/products.js` (bottom of file)

### ➕ Add New Category
```javascript
export const categories = [
  // ... existing categories ...
  {
    id: 'new-category',
    name: 'New Category Name',
    icon: '💎', // Choose emoji icon
    link: '/shop?category=new-category'
  }
];
```

### ✏️ Edit Category
1. **Find Category:** Search for category name
2. **Update Fields:** Change name, icon, or link
3. **Update Products:** Ensure products have correct category ID
4. **Update Images:** Add image in Home.jsx categoryImages

### 🗑️ Delete Category
1. **Remove from Categories Array:** Delete category object
2. **Update Products:** Change or remove products in this category
3. **Remove Image:** Delete from categoryImages in Home.jsx

---

## 🎨 Brand & Content Updates

### 🏷️ Change Brand Name
**Location:** `src/components/Header.jsx` (lines 44, 54, 66)
```javascript
<span>R</span>  // Line 44 - Change R
<span>&amp;</span>  // Line 54 - Keep or remove &
<span>S</span>  // Line 66 - Change S
```

### 📝 Update Tagline
**Location:** `src/components/Header.jsx` (line 78)
```javascript
"Elite Imitation Jewellery" // Change this text
```

### 📞 Update Contact Information
**Location:** `src/pages/Contact.jsx`
- Find and update phone numbers, emails, addresses
- Update social media links
- Change map location (if using)

### 🏠 Update Home Page Content
**Location:** `src/pages/Home.jsx`
- **Hero Text:** Lines 37-42
- **Trust Badges:** Lines 120-147
- **Section Headings:** Search for text to update

---

## 🚀 Website Deployment

### 📦 Development (Local)
```bash
# Start development server
npm run dev

# Website runs at: http://localhost:5173
# Changes appear automatically (hot reload)
```

### 🏗️ Build for Production
```bash
# Create production build
npm run build

# Output folder: 'dist'
# Ready for hosting
```

### 🌐 Hosting Options

#### 1. **Netlify (Easiest - Free)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### 2. **Vercel (Easy - Free)**
- Connect GitHub repository
- Automatic deployment on changes
- Custom domain support

#### 3. **Traditional Hosting**
- Upload `dist` folder via FTP
- Ensure server supports static sites
- Configure domain DNS

### 🔄 Update Live Website
1. **Make Changes:** Edit files locally
2. **Test Locally:** `npm run dev` to verify
3. **Build:** `npm run build`
4. **Deploy:** Upload `dist` folder to hosting
5. **Verify:** Check live website

---

## 💾 Backup & Safety

### 📁 Daily Backup
```bash
# Copy entire project folder
Copy "jewellery-store" folder to backup location

# Or use Git (recommended)
git add .
git commit -m "Daily backup"
git push
```

### 🛡️ Before Making Changes
1. **Backup Current Files:** Copy to safe location
2. **Test Changes:** Use development server first
3. **Save Frequently:** Ctrl+S while editing
4. **Check Syntax:** Ensure brackets and commas are correct

### ⚠️ Common Mistakes to Avoid
- **Missing Commas:** Ensure objects end with commas
- **Mismatched Brackets:** Check { } and [ ] balance
- **Duplicate IDs:** Ensure product IDs are unique
- **Wrong Category IDs:** Match category exactly
- **Broken Image URLs:** Test all image links

---

## 🛠️ Troubleshooting

### 🔧 Website Not Loading
```bash
# Restart development server
Ctrl+C (stop)
npm run dev (start again)

# Clear cache
npm run build
npm run dev
```

### 🖼️ Images Not Showing
1. **Check URLs:** Ensure image URLs are correct
2. **Test Links:** Open image URLs in browser
3. **Check File Names:** Case-sensitive file names
4. **Verify Paths:** Check `/images/` folder structure

### 📦 Products Not Displaying
1. **Check Syntax:** Ensure JSON is valid
2. **Verify IDs:** Check for duplicate product IDs
3. **Category Match:** Ensure category IDs exist
4. **Stock Status:** Check `inStock: true`

### 🎨 Styling Issues
1. **Refresh Browser:** Hard refresh (Ctrl+F5)
2. **Clear Cache:** Clear browser cache
3. **Check CSS:** Ensure no syntax errors in styles
4. **Restart Server:** Stop and start dev server

---

## 📞 Quick Reference

### 🎯 Most Common Files
- **Products:** `src/data/products.js`
- **Categories:** Bottom of `src/data/products.js`
- **Header:** `src/components/Header.jsx`
- **Home Page:** `src/pages/Home.jsx`
- **Contact:** `src/pages/Contact.jsx`
- **Shop Page:** `src/pages/Shop.jsx`

### ⚡ Quick Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build
```

### 📱 Test Website
- **Local:** http://localhost:5173
- **Mobile:** Use browser dev tools (F12) → Mobile view
- **Production:** After building and deploying

---

## 🎓 Learning Resources

### 📚 Learn Basic JavaScript
- **Free Code Camp:** javascript basics
- **W3Schools:** JSON and JavaScript tutorials
- **MDN Web Docs:** Comprehensive JavaScript guide

### 🎨 Learn Basic CSS
- **Tailwind CSS:** Used for styling
- **CSS Tricks:** Tips and techniques
- **Flexbox Guide:** Layout understanding

### 🚀 Deployment Help
- **Netlify Docs:** Easy deployment guide
- **Vercel Docs:** Modern hosting platform
- **GitHub Pages:** Free hosting option

---

## 🆘 Emergency Help

### 💥 Website Broke
1. **Restore Backup:** Use last working version
2. **Check Recent Changes:** Undo last edits
3. **Reset to Git:** `git checkout .` (if using Git)
4. **Contact Support:** Reach out for technical help

### 📞 Need Assistance
- **Check This Guide:** Most answers are here
- **Search Online:** Google specific error messages
- **Ask Community:** Stack Overflow, GitHub Issues
- **Professional Help:** Hire developer for complex issues

---

## 📈 Success Tips

### 🎯 Best Practices
1. **Test Changes:** Always test locally first
2. **Backup Regularly:** Daily backups save time
3. **Start Small:** Make one change at a time
4. **Document Changes:** Keep notes of what you changed
5. **Monitor Performance:** Check website speed regularly

### 🚀 Growth Strategies
1. **Add Products Regularly:** Keep inventory fresh
2. **Update Images:** New photos attract customers
3. **Monitor Sales:** Track what sells well
4. **Customer Feedback:** Use reviews for improvements
5. **SEO Basics:** Use good product descriptions

---

**🎉 Congratulations! You now have complete control over your jewellery website.**

**Remember:** Start small, test changes, backup regularly, and don't hesitate to ask for help when needed.

**Happy Selling! 💎✨**
