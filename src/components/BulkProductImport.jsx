import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import centralDataManager from '../data/centralDataManager';

const BulkProductImport = () => {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [validationResults, setValidationResults] = useState(null);

  // Category-specific size validation
  const categorySizes = {
    rings: ['4', '5', '6', '7', '8', '9', '10', '11', '12'],
    bangles: ['2.2', '2.4', '2.6', '2.8', '3.0', '3.2', '3.4'],
    bracelets: ['6', '6.5', '7', '7.5', '8', '8.5', '9'],
    necklaces: ['16', '18', '20', '22', '24', '26', '28'],
    earrings: ['Free Size'],
    chains: ['16', '18', '20', '22', '24', '26', '28'],
    pendants: ['Free Size'],
    default: ['Free Size', 'Small', 'Medium', 'Large']
  };

  const validateSizes = (sizes, category) => {
    if (!sizes || sizes.length === 0) return true;
    
    const validSizes = categorySizes[category] || categorySizes.default;
    return sizes.every(size => validSizes.includes(size));
  };

  const validateProduct = (product, index) => {
    const errors = [];
    
    // Required fields
    if (!product.name) errors.push(`Row ${index + 1}: Product name is required`);
    if (!product.category) errors.push(`Row ${index + 1}: Category is required`);
    if (!product.price || product.price <= 0) errors.push(`Row ${index + 1}: Valid price is required`);
    if (!product.stockCount || product.stockCount < 0) errors.push(`Row ${index + 1}: Valid stock count is required`);
    
    // Category validation
    const validCategories = centralDataManager.getCategories().map(cat => cat.id);
    if (product.category && !validCategories.includes(product.category)) {
      errors.push(`Row ${index + 1}: Invalid category "${product.category}"`);
    }
    
    // Size validation
    if (product.sizes && product.sizes.length > 0) {
      if (!validateSizes(product.sizes, product.category)) {
        errors.push(`Row ${index + 1}: Invalid sizes for category "${product.category}"`);
      }
    }
    
    // Image validation
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, imgIndex) => {
        if (!img.startsWith('http')) {
          errors.push(`Row ${index + 1}: Image ${imgIndex + 1} must be a valid URL`);
        }
      });
    }
    
    // Cost validation
    const costFields = ['cost_purchasePrice', 'cost_packagingCost', 'cost_logisticsCost', 'cost_otherCharges'];
    costFields.forEach(field => {
      if (product[field] && (isNaN(product[field]) || parseFloat(product[field]) < 0)) {
        errors.push(`Row ${index + 1}: ${field} must be a valid positive number`);
      }
    });
    
    return errors;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setCsvData(text);
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const products = [];
    const allErrors = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const product = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        
        // Handle different field types
        if (header === 'id' || header === 'price' || header === 'originalPrice' || 
            header === 'stockCount' || header === 'rating' || 
            header.startsWith('cost_')) {
          product[header] = parseFloat(value) || 0;
        } else if (header === 'inStock' || header === 'isNewArrival' || header === 'isFeatured') {
          product[header] = value.toLowerCase() === 'true';
        } else if (header === 'images') {
          product[header] = value.split(';').filter(img => img.trim());
        } else if (header === 'sizes' || header === 'materials' || header === 'occasions') {
          product[header] = value.split(';').filter(item => item.trim());
        } else {
          product[header] = value;
        }
      });
      
      // Add cost data structure
      if (product.cost_purchasePrice !== undefined) {
        product.costData = {
          purchasePrice: product.cost_purchasePrice || 0,
          packagingCost: product.cost_packagingCost || 0,
          logisticsCost: product.cost_logisticsCost || 0,
          otherCharges: product.cost_otherCharges || 0,
          totalCost: (product.cost_purchasePrice || 0) + (product.cost_packagingCost || 0) + 
                    (product.cost_logisticsCost || 0) + (product.cost_otherCharges || 0),
          sellingPrice: product.price || 0,
          profit: (product.price || 0) - ((product.cost_purchasePrice || 0) + (product.cost_packagingCost || 0) + 
                    (product.cost_logisticsCost || 0) + (product.cost_otherCharges || 0)),
          profitMargin: 0
        };
        
        if (product.costData.totalCost > 0) {
          product.costData.profitMargin = ((product.costData.profit / product.costData.totalCost) * 100).toFixed(2);
        }
        
        delete product.cost_purchasePrice;
        delete product.cost_packagingCost;
        delete product.cost_logisticsCost;
        delete product.cost_otherCharges;
      }
      
      // Validate product
      const productErrors = validateProduct(product, i - 1);
      allErrors.push(...productErrors);
      
      products.push(product);
    }
    
    setPreview(products);
    setErrors(allErrors);
    
    // Set validation results
    setValidationResults({
      total: products.length,
      valid: products.length - allErrors.length,
      errors: allErrors.length,
      hasErrors: allErrors.length > 0
    });
  };

  const handleImport = async () => {
    if (!csvData) {
      toast.error('Please upload a CSV file first');
      return;
    }

    setIsImporting(true);
    
    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const product = {};
        
        headers.forEach((header, index) => {
          const value = values[index];
          
          if (header === 'id' || header === 'price' || header === 'originalPrice' || 
              header === 'stockCount' || header === 'rating' || 
              header.startsWith('cost_')) {
            product[header] = parseFloat(value) || 0;
          } else if (header === 'inStock' || header === 'isNewArrival') {
            product[header] = value.toLowerCase() === 'true';
          } else if (header === 'images') {
            product[header] = value.split(';').filter(img => img.trim());
          } else if (header === 'sizes' || header === 'materials' || header === 'occasions') {
            product[header] = value.split(';').filter(item => item.trim());
          } else {
            product[header] = value;
          }
        });
        
        // Add cost data structure
        if (product.cost_purchasePrice !== undefined) {
          product.costData = {
            purchasePrice: product.cost_purchasePrice || 0,
            packagingCost: product.cost_packagingCost || 0,
            logisticsCost: product.cost_logisticsCost || 0,
            otherCharges: product.cost_otherCharges || 0,
            totalCost: (product.cost_purchasePrice || 0) + (product.cost_packagingCost || 0) + 
                      (product.cost_logisticsCost || 0) + (product.cost_otherCharges || 0),
            sellingPrice: product.price || 0,
            profit: (product.price || 0) - ((product.cost_purchasePrice || 0) + (product.cost_packagingCost || 0) + 
                      (product.cost_logisticsCost || 0) + (product.cost_otherCharges || 0)),
            profitMargin: 0
          };
          
          if (product.costData.totalCost > 0) {
            product.costData.profitMargin = ((product.costData.profit / product.costData.totalCost) * 100).toFixed(2);
          }
          
          delete product.cost_purchasePrice;
          delete product.cost_packagingCost;
          delete product.cost_logisticsCost;
          delete product.cost_otherCharges;
        }
        
        products.push(product);
      }

      // Add products to centralDataManager
      products.forEach(product => {
        centralDataManager.addProduct(product);
      });

      toast.success(`Successfully imported ${products.length} products!`);
      
      // Clear form
      setCsvData('');
      setPreview([]);
      
      // Refresh the products list
      window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing products. Please check your CSV format.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `id,name,category,price,originalPrice,description,inStock,stockCount,isNewArrival,badge,badgeColor,rating,sizes,materials,occasions,weight,dimensions,sku,cost_purchasePrice,cost_packagingCost,cost_logisticsCost,cost_otherCharges,images
1,"Sample Product","necklaces",2999,3999,"Sample description",true,25,true,"NEW","bg-green-500",4.8,"Free Size","Gold Plated","Party","10g","2cm x 3cm","RS-001",1500,50,100,50,"https://example.com/image1.jpg"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Bulk Product Import</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Download the CSV template below</li>
            <li>Fill in your product details in Excel</li>
            <li>Save as CSV file (not Excel)</li>
            <li>Upload the CSV file here</li>
            <li>Review preview and click Import</li>
          </ol>
        </div>

        <div className="mb-6">
          <button
            onClick={downloadTemplate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            📥 Download CSV Template
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File:
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Preview (First 5 products):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stockCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleImport}
            disabled={isImporting || !csvData}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            {isImporting ? 'Importing...' : '🚀 Import Products'}
          </button>
          
          {csvData && (
            <button
              onClick={() => {
                setCsvData('');
                setPreview([]);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Make sure your CSV file has the correct headers</li>
            <li>• For multiple images, separate URLs with semicolon (;)</li>
            <li>• For multiple sizes/materials, separate with semicolon (;)</li>
            <li>• Cost fields are optional but recommended for profit tracking</li>
            <li>• Always backup before bulk import</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulkProductImport;
