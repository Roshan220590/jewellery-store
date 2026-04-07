# R&S Jewellery - Premium Imitation Jewellery Store

A beautiful, modern React-based e-commerce website for imitation jewellery with complete shopping functionality.

## 🌟 Features

- **Beautiful Design**: Dark purple & gold theme with premium aesthetics
- **Complete Shopping Flow**: Browse → Cart → Checkout → Order Confirmation
- **Product Management**: Categories, filters, search, sorting
- **User Experience**: Wishlist, quick view, multiple product images
- **Mobile Responsive**: Works perfectly on all devices
- **Toast Notifications**: User-friendly feedback for all actions

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5174` (or the port shown in terminal)

## 📁 Project Structure

```
jewellery-store/
├── public/
│   └── images/
│       ├── home/          # Homepage images
│       ├── categories/    # Category tile photos
│       ├── necklaces/     # Necklace product photos
│       ├── earrings/      # Earring product photos
│       ├── bangles/       # Bangles product photos
│       ├── rings/         # Ring product photos
│       ├── maang-tikka/   # Maang Tikka photos
│       ├── anklets/       # Anklet photos
│       ├── sets/          # Bridal sets photos
│       └── chains/        # Chain photos
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Wishlist.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Chains.jsx
│   └── data/
│       └── products.js
```

## 📸 Adding Your Photos

### Step 1: Copy Photos to Folders
Copy your jewellery photos to the appropriate folders:

- **Homepage Hero**: `public/images/home/hero.jpg`
- **Category Tiles**: `public/images/categories/` (necklaces.jpg, earrings.jpg, etc.)
- **Product Photos**: `public/images/[category]/` (n1-front.jpg, n1-side.jpg, etc.)

### Step 2: Update Image URLs in Code

Replace image URLs in these files:

1. **Homepage** (`src/pages/Home.jsx`):
   - Line 7-16: Category tiles
   - Line 119: Hero image
   - Other banner images throughout the file

2. **Products** (`src/data/products.js`):
   - `image` field: Main product photo
   - `images` array: Multiple angle photos

### Step 3: Example Update

**Before:**
```js
image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80'
```

**After:**
```js
image: '/images/necklaces/n1-front.jpg'
```

## 🛍️ Product Management

### Adding New Products

In `src/data/products.js`, add new product objects:

```js
{
  id: 22,  // Unique ID
  name: 'Your Product Name',
  category: 'necklaces',
  price: 999,
  originalPrice: 1499,
  rating: 4.5,
  reviews: 25,
  image: '/images/necklaces/new-product.jpg',
  images: [
    '/images/necklaces/new-product.jpg',
    '/images/necklaces/new-product-side.jpg',
    '/images/necklaces/new-product-back.jpg'
  ],
  badge: 'New',
  badgeColor: 'bg-blue-500',
  description: 'Product description...',
  details: ['Material: ...', 'Stone: ...'],
  inStock: true,
  stockCount: 10,
  isFeatured: true,
  isNewArrival: true
}
```

### Categories

Available categories in `src/data/products.js`:
- necklaces
- earrings  
- bangles
- rings
- maang-tikka
- anklets
- sets
- chains

## 🎨 Customization

### Colors & Theme
Main theme colors are defined inline with CSS:
- Primary: Dark purple (`#3b0764`, `#6b21a8`)
- Accent: Gold (`#D4AF37`, `#F59E0B`)
- Background: Light gray (`#f9fafb`)

### Fonts
- Headings: Georgia serif font
- Body: System fonts (Tailwind default)

## 📱 Mobile Features

- Responsive navigation with hamburger menu
- Touch-friendly product cards
- Optimized checkout flow
- Swipeable image galleries

## 🔧 Technologies Used

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Vite** - Build tool

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Run `npm run build`
2. Upload the `dist` folder
3. Configure redirects for SPA routing

## 📞 Support

- **Phone**: +91 83100 96351
- **Email**: rs.jewellery.shop@gmail.com
- **WhatsApp**: https://wa.me/918310096351

---

Made with ❤️ for R&S Jewellery
