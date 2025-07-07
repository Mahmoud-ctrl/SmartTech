import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Star, Heart, ShoppingCart, Eye, Search, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import createSlug from '../utils/CreateSlug';

const API_URL = import.meta.env.VITE_REACT_APP_API;
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


const fetchJson = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return [];
  }
};

const fetchCategories = () => fetchJson(`${API_URL}/categories`);
const fetchBrands = () => fetchJson(`${API_URL}/brands`);
const fetchProductsByBrand = (brandId) => fetchJson(`${API_URL}/products/minifilter?brand_id=${brandId}`);

const Navigation = () => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [activeBrandName, setActiveBrandName] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs for managing interactions
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initial data loading
  useEffect(() => {
    Promise.all([fetchCategories(), fetchBrands()]).then(([categoriesData, brandsData]) => {
      setCategories(categoriesData);
      setBrands(brandsData);
    });
  }, []);

  // Effect to handle clicks outside the mega menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setHoveredCategoryId(null);
        setActiveBrandName(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Effect to lock body scroll when overlays are open
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen, isMobileMenuOpen]);


  // --- Event Handlers ---

  const handleCategoryHover = (categoryId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMenuOpen(true);
    setHoveredCategoryId(categoryId);
    // Reset brand and products when switching categories
    setActiveBrandName(null);
    setProducts([]);
  };

  const handleBrandHover = async (brand) => {
    if (loadingProducts || activeBrandName === brand.name) return;
    
    setActiveBrandName(brand.name);
    setLoadingProducts(true);
    const productData = await fetchProductsByBrand(brand.id);
    const formattedProducts = productData.map(p => ({
        ...p,
        images: p.images.filter(img => img && !img.startsWith('[') && !img.endsWith(']')),
        price: p.price,
        title: p.title,
    }));
    setProducts(formattedProducts);
    setLoadingProducts(false);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
      setHoveredCategoryId(null);
      setActiveBrandName(null);
    }, 200);
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  
  const handleSearch = async (query) => {
    if(!query){
      return [];
    }
    try{
      const res = await axios.get(`${API_URL}/products/search`, {params: {query} });
      return res.data.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        image: p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/400x400/e2e8f0/e2e8f0?text=Image'
      }))
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  };

  const getActiveBrands = () => {
    if (!hoveredCategoryId) return [];
    return brands.filter(b => b.category_id === hoveredCategoryId);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white" ref={menuRef}>
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between p-2 container mx-auto">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-gray-900"
          >
            <img
              src="https://aidibysmarttech.b-cdn.net/SmartTech-logo.png"
              alt="SmartTech Logo"
              className="h-14 w-auto"
            />
              <span>
                Aidiby{" "}<span className="text-[#1092a3]">SmartTech</span>
              </span>
          </a>

          {/* Desktop Navigation Links (Data-Driven) */}
          <div className="hidden md:flex items-center space-x-4">
            {categories.map(cat => (
              <div
                key={cat.id}
                onMouseEnter={() => handleCategoryHover(cat.id)}
                className="group relative cursor-pointer"
              >
                <div className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium">
                  <span>{cat.name}</span>
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                </div>
              </div>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-500 hover:text-indigo-600 transition-colors duration-300"
              aria-label="Open search"
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors duration-300"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Mega Menu Dropdown Panel */}
        <AnimatePresence>
          {isMenuOpen && hoveredCategoryId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute left-0 top-full w-full bg-white shadow-2xl border-t border-gray-200 z-50"
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
            >
              <div className="container mx-auto flex min-h-[400px]">
                {/* Brands Section */}
                <div className="w-1/4 border-r border-gray-200 bg-gray-50/70">
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                      <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                      Brands
                    </h4>
                    <div className="space-y-1">
                      {getActiveBrands().map(brand => (
                        <div
                          key={brand.id}
                          onMouseEnter={() => handleBrandHover(brand)}
                          className={`group cursor-pointer p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                            activeBrandName === brand.name
                              ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                              : 'hover:bg-white hover:shadow-sm text-gray-600'
                          }`}
                        >
                          <span className="font-medium">{brand.name}</span>
                          <div className={`transition-opacity ${activeBrandName === brand.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <ChevronDown size={16} className="rotate-[-90deg]" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {getActiveBrands().length === 0 && (
                      <p className="text-gray-500 text-sm italic mt-4">No brands available for this category.</p>
                    )}
                  </div>
                </div>

                {/* Products Section */}
                <div className="w-3/4 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-lg text-gray-800">
                      {activeBrandName ? `${activeBrandName} Products` : 'Select a brand to view products'}
                    </h4>
                    {products.length > 0 && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {products.length} product{products.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {loadingProducts ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {products.map(product => (
                      <Link to={`/products/${product.id}/${createSlug(product.title)}`} key={product.id} className="block" onClick={() => handleMenuLeave()}> 
                        <ProductCard
                          product={product}
                        />
                      </Link>
                    ))}
                    </div>
                  )}

                  {!loadingProducts && products.length === 0 && activeBrandName && (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                      <div className="text-gray-300 mb-4">
                        <ShoppingCart size={48} strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-500 font-semibold">No products found</p>
                      <p className="text-sm text-gray-400">This brand may be out of stock.</p>
                    </div>
                  )}
                   {!loadingProducts && !activeBrandName && (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                      <div className="text-indigo-200 mb-4">
                        <Eye size={48} strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-500 font-semibold">Select a Brand</p>
                      <p className="text-sm text-gray-400">Hover over a brand on the left to see products.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={categories} brands={brands} />
    </>
  );
};

const ProductCard = ({ product, favorites, onToggleFavorite }) => (
  <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-300 flex flex-col">
    <div className="relative h-48">
      <img
        src={product.images?.[0] || 'https://placehold.co/300/200/e2e8f0/e2e8f0?text=No+Image'}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300/200/e2e8f0/e2e8f0?text=Error'; }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-50"><Eye size={16} /></button>
        </div>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-grow">
        {product.title}
      </h5>
      {product.rating && (
        <div className="flex items-center mt-2 space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.rating})</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xl font-bold text-indigo-600">${product.price}</span>
        {product.discount && (
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">-{product.discount}%</span>
        )}
      </div>
    </div>
  </div>
);

const SearchOverlay = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      onSearch(debouncedSearchTerm).then(results => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, onSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 sm:pt-24"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors" aria-label="Close search">
              <X size={30} />
            </button>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 pl-16 pr-6 bg-white rounded-xl text-lg text-gray-800 placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="mt-4 bg-white rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto">
              {debouncedSearchTerm && !isLoading && suggestions.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p className="font-semibold">No results for "{debouncedSearchTerm}"</p>
                  <p className="text-sm mt-1">Try a different search term.</p>
                </div>
              )}
              {suggestions.length > 0 && (
                <ul className="divide-y divide-gray-100">
                  {suggestions.map(product => (
                    <li key={product.id}>
                      <a href={`/products/${product.id}/${createSlug(product.title)}`} className="flex items-center p-4 hover:bg-indigo-50 transition-colors duration-200">
                        <img src={product.image} alt={product.title} className="h-16 w-16 rounded-md object-cover flex-shrink-0 bg-gray-200" />
                        <div className="ml-4 flex-grow overflow-hidden">
                          <p className="font-semibold text-gray-800 truncate">{product.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        </div>
                        <p className="text-lg font-bold text-indigo-600 ml-4">${product.price}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {searchTerm === '' && (
                <div className="p-6">
                  <h3 className="font-semibold text-gray-600">Trending Searches</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Laptop', 'Headphones', 'Smart Watch', 'Keyboard'].map(item => (
                      <button key={item} onClick={() => setSearchTerm(item)} className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-sm transition-colors">{item}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileMenu = ({ isOpen, onClose, categories, brands }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed inset-0 bg-white z-50 md:hidden"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-8">
            <a href="/"><img src="https://aidibysmarttech.b-cdn.net/SmartTech-logo.png" alt="logo" className="w-12 h-12"/></a>
            <a href="/" className="text-2xl font-bold text-gray-900">Smart<span className="text-[#1092a3]">Tech</span></a>
            <button onClick={onClose} className="text-gray-600"><X size={28} /></button>
          </div>
            <nav className="flex flex-col space-y-2">
              {categories.map((cat) => (
                <MobileAccordionItem 
                  key={cat.id} 
                  category={cat} 
                  onClose={onClose}
                  brands={brands.filter(b => b.category_id === cat.id)} 
                />
              ))}
            </nav>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MobileAccordionItem = ({ category, brands, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-xl text-gray-700 hover:text-indigo-600 font-medium">
        <span>{category.name}</span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4"
          >
            <div className="flex flex-col space-y-3 py-3 border-l-2 border-indigo-100">
            {brands.map(brand => (
              <Link 
                to={`/products/?category=${createSlug(category.name)}&brand=${createSlug(brand.name)}`}
                key={brand.id} 
                className="text-lg text-gray-600 ml-2 hover:text-indigo-600"
                onClick={onClose}
              >
                <span>{brand.name}</span>
              </Link>
            ))}
              {brands.length === 0 && (
                 <span className="text-md text-gray-400 italic">No brands</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navigation;

