// 📄 PDF Export Script for R&S Jewellery Website Documentation
// Run this script to generate PDF files from your markdown files

const fs = require('fs');
const path = require('path');

// Simple HTML to PDF conversion function
function createPDFContent(title, content) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #D4AF37;
            border-bottom: 3px solid #D4AF37;
            padding-bottom: 10px;
        }
        h2 {
            color: #1a1a1a;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        h3 {
            color: #333;
            margin-top: 25px;
        }
        code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #D4AF37;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 5px 0;
        }
        strong {
            color: #1a1a1a;
        }
        blockquote {
            border-left: 4px solid #D4AF37;
            margin: 20px 0;
            padding: 10px 20px;
            background: #f9f9f9;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>R&S Jewellery Website</h1>
        <h2>${title}</h2>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
    
    ${content}
    
    <div class="footer">
        <p>R&S Jewellery Website Management Guide<br>
        For support, refer to the digital documentation files.</p>
    </div>
</body>
</html>`;
}

// Convert markdown to basic HTML
function markdownToBasicHTML(markdown) {
  return markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists (basic)
    .replace(/^\* (.*)$/gim, '<li>$1</li>')
    .replace(/^- (.*)$/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// Read markdown files and create PDFs
const files = [
  {
    input: 'WEBSITE_MANAGEMENT_GUIDE.md',
    output: 'R&S_Jewellery_Complete_Guide.html',
    title: 'Complete Website Management Guide'
  },
  {
    input: 'QUICK_REFERENCE.md',
    output: 'R&S_Jewellery_Quick_Reference.html',
    title: 'Quick Reference Guide'
  }
];

console.log('📄 Generating PDF-ready HTML files...');

files.forEach(file => {
  try {
    if (fs.existsSync(file.input)) {
      const markdown = fs.readFileSync(file.input, 'utf8');
      const htmlContent = markdownToBasicHTML(markdown);
      const fullHTML = createPDFContent(file.title, htmlContent);
      
      fs.writeFileSync(file.output, fullHTML);
      console.log(`✅ Created: ${file.output}`);
      console.log(`   📂 Open this file in browser and print to PDF`);
    } else {
      console.log(`❌ File not found: ${file.input}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${file.input}:`, error.message);
  }
});

console.log('\n🎉 PDF Generation Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Open the generated HTML files in your browser');
console.log('2. Use Ctrl+P or Cmd+P to print');
console.log('3. Choose "Save as PDF" or "Print to PDF"');
console.log('4. Save with your desired name');
console.log('\n📁 Generated Files:');
files.forEach(file => console.log(`   - ${file.output}`));
