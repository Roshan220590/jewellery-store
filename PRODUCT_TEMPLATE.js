// 📝 PRODUCT TEMPLATE - Copy this to add new products
// 📍 Add this to src/data/products.js

{
  id: NEXT_NUMBER, // Replace with next number (check last product)
  name: "Product Name Here",
  category: "category-id", // Must match category ID (necklaces, earrings, etc.)
  price: 2999, // Sale price
  originalPrice: 3999, // Original price (optional - for sale items)
  description: "Beautiful description of your jewellery piece. Mention materials, size, and special features.",
  images: [
    "https://your-image-url.com/main-photo.jpg",
    "https://your-image-url.com/second-photo.jpg" // Optional second photo
  ],
  inStock: true, // true or false
  isNewArrival: true, // true or false (for new items)
  badge: "NEW", // Optional: "NEW", "SALE", "LIMITED", or remove
  badgeColor: "bg-green-500", // Optional: "bg-red-500", "bg-yellow-500", etc.
  rating: 4.8, // 1.0 to 5.0
  sizes: ["Free Size"], // Optional: ["S", "M", "L", "Free Size"] or remove
  materials: ["Gold Plated"], // Optional: ["Gold Plated", "Silver", "Brass"] or remove
  occasions: ["Party", "Daily"] // Optional: ["Wedding", "Party", "Daily", "Office"] or remove
},

// 📝 EXAMPLE FILLED TEMPLATE:
{
  id: 125,
  name: "Elegant Gold Plated Necklace",
  category: "necklaces",
  price: 2999,
  originalPrice: 3999,
  description: "Stunning gold plated necklace with intricate design. Perfect for weddings and special occasions. Length: 18 inches with adjustable chain.",
  images: [
    "https://example.com/necklace1.jpg",
    "https://example.com/necklace2.jpg"
  ],
  inStock: true,
  isNewArrival: true,
  badge: "NEW",
  badgeColor: "bg-green-500",
  rating: 4.8,
  sizes: ["Free Size"],
  materials: ["Gold Plated"],
  occasions: ["Wedding", "Party"]
},

// 🎯 QUICK TIPS:
// 1. Always use unique ID numbers
// 2. Category must match exactly (check categories list)
// 3. Image URLs should work in browser
// 4. Price should be in rupees (₹)
// 5. End with comma (except last product)
