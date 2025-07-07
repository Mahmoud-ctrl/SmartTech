import React, { useEffect, useState } from 'react';
import { Upload, X, Plus, Edit, Save, Package, Tag, DollarSign, Camera, Star } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_REACT_APP_API;
const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    review_count: 0,
    in_stock: true,
    is_new: false,
    is_sale: false,
    sales_count: 0,
    brand_id: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageLinks, setImageLinks] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async (pageNum = page) => {
    try {
      const res = await axios.get(`${API_URL}/admin/products?page=${pageNum}&per_page=${perPage}`);
      setProducts(res.data.products);
      setPage(res.data.page);
      setPerPage(res.data.per_page);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/brands`);
      setBrands(res.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setImageFiles(prev => [...prev, ...imageFiles]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const urls = [];
    for (let file of imageFiles) {
      if (typeof file === 'string') {
        urls.push(file); // Already a link
      } else {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await axios.post(`${API_URL}/admin/upload`, formData);
          urls.push(res.data.url);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.brand_id) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const imageUrls = await uploadImages();
      const data = { ...form, images: imageUrls };

      const res = await axios.post(`${API_URL}/admin/products`, data);
      alert('Product added: ' + res.data.title);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setIsLoading(true);
    try {
      const imageUrls = await uploadImages();
      const data = { ...form, images: imageUrls.length ? imageUrls : form.images };

      const res = await axios.put(`${API_URL}/admin/products/${id}`, data);
      alert('Product updated: ' + res.data.title);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      original_price: '',
      review_count: 0,
      in_stock: true,
      is_new: false,
      is_sale: false,
      sales_count: 0,
      brand_id: '',
      images: []
    });
    setImageFiles([]);
    setEditingProduct(null);
  };

  const editProduct = (product) => {
    setForm(product);
    setEditingProduct(product.id);
    setImageFiles([]);
  };

  const addImageLink = () => {
    if (imageLinks.trim()) {
      setImageFiles(prev => [...prev, imageLinks.trim()]);
      setImageLinks('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" />
              Product Manager
            </h1>
          </div>

          <div className="p-6">
            {/* Form Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                {editingProduct ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter product description"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="0.00"
                          value={form.price}
                          onChange={e => setForm({ ...form, price: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="0.00"
                          value={form.original_price}
                          onChange={e => setForm({ ...form, original_price: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <select
                        value={form.brand_id}
                        onChange={e => setForm({ ...form, brand_id: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Brand</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Image Upload Drop Zone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                      />
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop images here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    value={imageLinks}
                    onChange={e => setImageLinks(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addImageLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Link
                  </button>
                </div>

                  {/* Image Preview */}
                  {imageFiles.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({imageFiles.length})
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {imageFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-md"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Options
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.in_stock}
                          onChange={e => setForm({ ...form, in_stock: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.is_new}
                          onChange={e => setForm({ ...form, is_new: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">New Product</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.is_sale}
                          onChange={e => setForm({ ...form, is_sale: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">On Sale</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={editingProduct ? () => handleUpdate(editingProduct) : handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {editingProduct ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
                {editingProduct && (
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Products List */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-blue-600">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => fetchProducts(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => fetchProducts(idx + 1)}
                    className={`px-3 py-1 rounded border ${page === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => fetchProducts(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;