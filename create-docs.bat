@echo off
echo ========================================
echo    R&S JEWELLERY - DOCUMENT GENERATOR
echo ========================================
echo.
echo This will create printable HTML files
echo that you can save as PDF or Word docs
echo.
echo Choose what to generate:
echo.
echo 1. Complete Management Guide
echo 2. Quick Reference Guide
echo 3. Both Documents
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Generating Complete Management Guide...
    node export-to-pdf.js
    echo.
    echo Opening file in browser...
    start "R&S_Jewellery_Complete_Guide.html"
)

if "%choice%"=="2" (
    echo.
    echo Generating Quick Reference Guide...
    echo Creating quick reference...
    (
    echo ^<!DOCTYPE html^>
    echo ^<html^>
    echo ^<head^>
    echo ^<title^>R&S Jewellery - Quick Reference^</title^>
    echo ^<style^>
    echo body { font-family: Arial; margin: 40px; line-height: 1.6; }
    echo h1 { color: #D4AF37; border-bottom: 3px solid #D4AF37; }
    echo h2 { color: #1a1a1a; border-bottom: 1px solid #ddd; }
    echo code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
    echo pre { background: #f4f4f4; padding: 15px; border-left: 4px solid #D4AF37; }
    echo ul { margin: 10px 0; padding-left: 20px; }
    echo li { margin: 5px 0; }
    echo table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
    echo th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    echo th { background: #f2f2f2; }
    echo ^</style^>
    echo ^</head^>
    echo ^<body^>
    echo ^<h1^>R^&S Jewellery Website^</h1^>
    echo ^<h2^>Quick Reference - Daily Website Management^</h2^>
    echo ^<p^>Generated on: %date%^</p^>
    echo.
    echo ^<h2^>⚡ 5-Minute Updates^</h2^>
    echo ^<h3^>💰 Change Price^</h3^>
    echo ^<ol^>
    echo ^<li^>Open ^<code^>src/data/products.js^</code^>^</li^>
    echo ^<li^>Find product (Ctrl+F)^</li^>
    echo ^<li^>Change ^<code^>price: 2999^</code^>^</li^>
    echo ^<li^>Save (Ctrl+S)^</li^>
    echo ^</ol^>
    echo.
    echo ^<h3^>📦 Update Stock^</h3^>
    echo ^<ol^>
    echo ^<li^>Open ^<code^>src/data/products.js^</code^>^</li^>
    echo ^<li^>Find product^</li^>
    echo ^<li^>Change ^<code^>inStock: false^</code^>^</li^>
    echo ^<li^>Save^</li^>
    echo ^</ol^>
    echo.
    echo ^<h3^>🏷️ Add Sale Badge^</h3^>
    echo ^<ol^>
    echo ^<li^>Open ^<code^>src/data/products.js^</code^>^</li^>
    echo ^<li^>Add ^<code^>originalPrice: 3999^</code^> (higher than price)^</li^>
    echo ^<li^>Add ^<code^>badge: "SALE"^</code^>^</li^>
    echo ^<li^>Save^</li^>
    echo ^</ol^>
    echo.
    echo ^<h2^>🖼️ Image Updates^</h2^>
    echo ^<h3^>📸 Change Product Image^</h3^>
    echo ^<pre^>images: [
    echo   "https://new-image-url.jpg"
    echo ]^</pre^>
    echo.
    echo ^<h3^>🏷️ Change Category Image^</h3^>
    echo ^<pre^>// In src/pages/Home.jsx
    echo 'necklaces': 'https://new-category-image.jpg'^</pre^>
    echo.
    echo ^<h2^>🎨 Brand Updates^</h2^>
    echo ^<h3^>📝 Change Tagline^</h3^>
    echo ^<p^>File: ^<code^>src/components/Header.jsx^</code^> (line 78)^</p^>
    echo ^<pre^>"Your New Tagline"^</pre^>
    echo.
    echo ^<h3^>🏷️ Change Brand Name^</h3^>
    echo ^<p^>File: ^<code^>src/components/Header.jsx^</code^> (lines 44, 66)^</p^>
    echo ^<pre^>^<span^>NEW^</span^>  // Line 44
    echo ^<span^>NAME^</span^> // Line 66^</pre^>
    echo.
    echo ^<h2^>🚀 Deploy Website^</h2^>
    echo ^<h3^>📦 Build ^& Upload^</h3^>
    echo ^<pre^>npm run build
    echo # Upload 'dist' folder to hosting^</pre^>
    echo.
    echo ^<h3^>🔄 Quick Update^</h3^>
    echo ^<ol^>
    echo ^<li^>Make changes^</li^>
    echo ^<li^>^<code^>npm run build^</code^>^</li^>
    echo ^<li^>Upload ^<code^>dist^</code^> folder^</li^>
    echo ^<li^>Check live site^</li^>
    echo ^</ol^>
    echo.
    echo ^<h2^>🆘 Emergency Fixes^</h2^>
    echo ^<h3^>💥 Website Not Working^</h3^>
    echo ^<pre^>npm run dev
    echo # Check for errors in terminal^</pre^>
    echo.
    echo ^<h3^>🖼️ Images Not Showing^</h3^>
    echo ^<ul^>
    echo ^<li^>Check image URLs^</li^>
    echo ^<li^>Test links in browser^</li^>
    echo ^<li^>Ensure correct file paths^</li^>
    echo ^</ul^>
    echo.
    echo ^<h3^>📦 Products Missing^</h3^>
    echo ^<ul^>
    echo ^<li^>Check for syntax errors^</li^>
    echo ^<li^>Verify product IDs are unique^</li^>
    echo ^<li^>Ensure category exists^</li^>
    echo ^</ul^>
    echo.
    echo ^<h2^>📞 Important Files^</h2^>
    echo ^<table^>
    echo ^<tr^>^<th^>Purpose^</th^>^<th^>File Location^</th^>^</tr^>
    echo ^<tr^>^<td^>Products^</td^>^<td^>^<code^>src/data/products.js^</code^>^</td^>^</tr^>
    echo ^<tr^>^<td^>Categories^</td^>^<td^>Bottom of ^<code^>src/data/products.js^</code^>^</td^>^</tr^>
    echo ^<tr^>^<td^>Header/Brand^</td^>^<td^>^<code^>src/components/Header.jsx^</code^>^</td^>^</tr^>
    echo ^<tr^>^<td^>Home Page^</td^>^<td^>^<code^>src/pages/Home.jsx^</code^>^</td^>^</tr^>
    echo ^<tr^>^<td^>Contact Info^</td^>^<td^>^<code^>src/pages/Contact.jsx^</code^>^</td^>^</tr^>
    echo ^<tr^>^<td^>Shop Page^</td^>^<td^>^<code^>src/pages/Shop.jsx^</code^>^</td^>^</tr^>
    echo ^</table^>
    echo.
    echo ^<h2^>⌨️ Keyboard Shortcuts^</h2^>
    echo ^<table^>
    echo ^<tr^>^<th^>Action^</th^>^<th^>Windows^</th^>^<th^>Mac^</th^>^</tr^>
    echo ^<tr^>^<td^>Save^</td^>^<td^>Ctrl+S^</td^>^<td^>Cmd+S^</td^>^</tr^>
    echo ^<tr^>^<td^>Find^</td^>^<td^>Ctrl+F^</td^>^<td^>Cmd+F^</td^>^</tr^>
    echo ^<tr^>^<td^>Replace^</td^>^<td^>Ctrl+H^</td^>^<td^>Cmd+H^</td^>^</tr^>
    echo ^<tr^>^<td^>Undo^</td^>^<td^>Ctrl+Z^</td^>^<td^>Cmd+Z^</td^>^</tr^>
    echo ^<tr^>^<td^>Refresh Browser^</td^>^<td^>Ctrl+F5^</td^>^<td^>Cmd+Shift+R^</td^>^</tr^>
    echo ^</table^>
    echo.
    echo ^<h2^>🎯 Daily Checklist^</h2^>
    echo ^<h3^>✅ Before Publishing^</h3^>
    echo ^<ul^>
    echo ^<li^>Test all changes locally^</li^>
    echo ^<li^>Check image links^</li^>
    echo ^<li^>Verify prices are correct^</li^>
    echo ^<li^>Test mobile view^</li^>
    echo ^<li^>Check contact info^</li^>
    echo ^</ul^>
    echo.
    echo ^<h3^>✅ After Publishing^</h3^>
    echo ^<ul^>
    echo ^<li^>Test live website^</li^>
    echo ^<li^>Check all pages load^</li^>
    echo ^<li^>Verify images show^</li^>
    echo ^<li^>Test contact forms^</li^>
    echo ^<li^>Check mobile version^</li^>
    echo ^</ul^>
    echo.
    echo ^<hr^>
    echo ^<p^>^<strong^>📞 Need Help?^</strong^> Check ^<code^>WEBSITE_MANAGEMENT_GUIDE.md^</code^> for detailed instructions.^</p^>
    echo ^</body^>
    echo ^</html^>
    ) > "R&S_Jewellery_Quick_Reference.html"
    echo ✅ Created: R&S_Jewellery_Quick_Reference.html
    echo.
    echo Opening file in browser...
    start "R&S_Jewellery_Quick_Reference.html"
)

if "%choice%"=="3" (
    echo.
    echo Generating both documents...
    node export-to-pdf.js
    echo.
    echo Creating quick reference...
    (
    echo ^<h1^>Quick Reference Guide^</h1^>
    echo ^<p^>See R&S_Jewellery_Quick_Reference.html for full guide^</p^>
    ) > "temp.html"
    echo.
    echo Opening files in browser...
    start "R&S_Jewellery_Complete_Guide.html"
    start "R&S_Jewellery_Quick_Reference.html"
)

if "%choice%"=="4" (
    echo.
    echo Goodbye!
    exit
)

echo.
echo ========================================
echo    📄 INSTRUCTIONS TO SAVE AS PDF/WORD
echo ========================================
echo.
echo 1. The HTML file will open in your browser
echo 2. Press Ctrl+P (or Cmd+P on Mac)
echo 3. Choose "Save as PDF" or "Print to PDF"
echo 4. Save with your desired name
echo.
echo 📋 ALTERNATIVE - SAVE AS WORD:
echo 1. Open the HTML file in Microsoft Word
echo 2. Word will convert HTML to Word format
echo 3. Save as .docx file
echo.
echo 🎉 Your documents are ready!
echo.
pause
