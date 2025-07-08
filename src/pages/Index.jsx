import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Search, ShoppingCart, User, Smartphone, 
  Laptop, Headphones, Watch, Zap, Star, ArrowRight,
  TrendingUp, Shield, Truck, RefreshCw, Award, Users, 
  Clock, Gift, Heart, ChevronLeft, ChevronRight, Play, 
  Volume2, Wifi, Battery, Camera, MessageCircle, Cpu, Eye, HardDrive, Monitor 
} from 'lucide-react';
import { Wrench, CheckCircle, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import Card from '../components/ui/Card';
import HeroBanner from '../components/HeroBanner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import createSlug from '../utils/CreateSlug';

const API_URL = import.meta.env.VITE_REACT_APP_API;

const Index = () => {
  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [onSale, setOnSale] = useState([]);

  useEffect(() => {
    fetchNewProducts();
    fetchBestSellers();
    fetchOnSale();
  }, []);

  const fetchNewProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/newest`);
      setNewProducts(res.data);
    } catch (error) {
      console.error('Error fetching new products:', error);
    }
  };
  
  const handleClick = (product) => {
    navigate(`/products/${product.id}/${createSlug(product.title)}`);
  }

  const fetchBestSellers = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/bestsellers`);
      setBestSellers(res.data);
    } catch (err) {
      console.log('Error fetching best sellers:', err);
    }
  }

  const fetchOnSale = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/sale`);
      setOnSale(res.data);
    } catch (err) {
      console.log('Error fetching on sale:', err);
    }
  }

  const handleBrowseAll = () => {
    navigate('/products?category=all')
  }

const techSpecFeatures = [
  {
    icon: Cpu,
    title: 'Intel Core i9 Processor',
    description: 'Unleash ultimate performance with the latest 13th Gen Intel Core i9 processor. 24 cores and 32 threads deliver exceptional speed for gaming, content creation, and multitasking.',
    image: 'https://AidibySmartTech.b-cdn.net/techSpecFeatures/intel-core-i9-14900k-cpu-1-1.jpg'
  },
  {
    icon: Monitor,
    title: 'RTX 5090 Graphics',
    description: 'Experience ray tracing and DLSS 3 with the powerful NVIDIA GeForce RTX 5090. Dominate 8K gaming and accelerate creative workflows with 32GB of GDDR7 memory.',
    image: 'https://AidibySmartTech.b-cdn.net/techSpecFeatures/contentbcc90c823f3445c59c649778fce1b4a8.png'
  },
  {
    icon: HardDrive,
    title: '2TB NVMe SSD',
    description: 'Lightning-fast storage with PCIe 4.0 NVMe SSD technology. Boot Windows in seconds and load games instantly with read speeds up to 7,000 MB/s.',
    image: 'https://AidibySmartTech.b-cdn.net/techSpecFeatures/samsung980prossd2-1688411070077.jpg'
  },
  {
    icon: Zap,
    title: 'Liquid Cooling System',
    description: 'Advanced AIO liquid cooling keeps your system running cool and quiet under heavy loads. RGB lighting adds style while maintaining optimal temperatures.',
    image: 'https://AidibySmartTech.b-cdn.net/techSpecFeatures/LiquidCooling.jpg'
  }
];

  const categories = [
    {
      id: 1,
      name: "Gaming Setup",
      description: "Pro gaming gear & accessories",
      image: "https://AidibySmartTech.b-cdn.net/Categories/Customizing_Your_PC_Case_Ideas_and_Inspiration.webp",
      isFeatured: true,
      slug: 'gaming-setup'
    },
    {
      id: 2,
      name: "Printers",
      description: "Latest models",
      image: "https://AidibySmartTech.b-cdn.net/Categories/photo-1708793699492-5fa208f52dcb.jpg",
      isFeatured: false,
      slug: 'printers'
    },
    {
      id: 3,
      name: "Monitors",
      description: "High resolution",
      image: "https://AidibySmartTech.b-cdn.net/Categories/alienware-aw3423dwf-4-1-2%5B1%5D.jpg",
      isFeatured: false,
      slug: 'monitors'
    },
    {
      id: 4,
      name: "Laptops",
      description: "Power & portability",
      image: "https://AidibySmartTech.b-cdn.net/Categories/photo-1541807084-5c52b6b3adef.jpg",
      isFeatured: false,
      slug: 'laptops'
    },
    {
      id: 5,
      name: "Accessories",
      description: "Smart accessories",
      image: "https://AidibySmartTech.b-cdn.net/Categories/The_best_tech_and_desk_accessories_this_year.jpg",
      isFeatured: false,
      slug: 'accessories'
    }
  ];

  const featuredCategory = categories.find(cat => cat.isFeatured);
  const regularCategories = categories.filter(cat => !cat.isFeatured);

   const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.slug}`);
  };

  const [activeSpec, setActiveSpec] = useState(0);

  const getOpenStatus = () => {
  const now = new Date();
  const hours = now.getHours(); // 0–23

  if (hours >= 8 && hours < 20) {
    return "Open now";
  } else {
    return "Closed";
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeroBanner />

      {/* Trust Indicators */}
      <section className="hidden md:block border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="group flex cursor-pointer items-center justify-center space-x-3">
              <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same-day delivery</p>
              </div>
            </div>
            <div className="group flex cursor-pointer items-center justify-center space-x-3">
              <div className="rounded-full bg-green-100 p-3 transition-colors group-hover:bg-green-200">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Warranty</h3>
                <p className="text-sm text-gray-600">2-year protection</p>
              </div>
            </div>
            <div className="group flex cursor-pointer items-center justify-center space-x-3">
              <div className="rounded-full bg-purple-100 p-3 transition-colors group-hover:bg-purple-200">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day policy</p>
              </div>
            </div>
            <div className="group flex cursor-pointer items-center justify-center space-x-3">
              <div className="rounded-full bg-orange-100 p-3 transition-colors group-hover:bg-orange-200">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Quality</h3>
                <p className="text-sm text-gray-600">Premium products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Categories */}
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover cutting-edge technology across our premium product lines
            </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-96">
        {/* Main Featured Category */}
        {featuredCategory && (
          <div 
            className="group relative overflow-hidden rounded-2xl bg-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => handleCategoryClick(featuredCategory)}
          >
            <img 
              src={featuredCategory.image}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt={featuredCategory.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            <div className="absolute top-12 md:top-auto md:bottom-0 left-0 right-0 p-8">
              <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                <h3 className="text-lg md:text-3xl font-bold text-white mb-2">{featuredCategory.name}</h3>
                <p className="text-gray-200 md:text-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {featuredCategory.description}
                </p>
              </div>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                <span className="inline-flex items-center text-white font-semibold">
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Grid of Regular Categories */}
        <div className="grid grid-cols-2 gap-6">
          {regularCategories.map((category) => (
            <div 
              key={category.id}
              className="group relative overflow-hidden rounded-xl bg-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => handleCategoryClick(category)}
            >
              <img 
                src={category.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={category.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
              <div className="absolute top-12 md:top-auto md:bottom-0 left-0 right-0 p-4">
                <h4 className="text-sm md:text-xl font-bold text-white mb-1 transform transition-transform duration-300 group-hover:-translate-y-1">
                  {category.name}
                </h4>
                <p className="hidden md:block text-gray-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Browse All Categories Button */}
      <div className="text-center md:mt-24 mt-8">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => handleBrowseAll()}
        >
          Browse All
        </button>
      </div>
    </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Just Arrived</h2>
            <button className="group flex items-center space-x-1 font-semibold text-blue-600 hover:text-blue-800">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2">
                <Link 
                  to={`/products/${product.id}/${createSlug(product.title)}`}
                  key={product.id}
                >
                  <Card
                    {...product}
                    image={product.images[0]}
                    buttonText='View Details'
                    buttonIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => handleClick(product)}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs Showcase */}
      <section className="bg-black py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> 
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gaming PC Pro. Built for Performance.</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">An interactive look at the cutting-edge components that deliver ultimate gaming and creative power.</p>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              {techSpecFeatures.map((feature, index) => (
                <img
                  key={index}
                  src={feature.image}
                  alt={feature.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeSpec === index ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Right side - Features */}
            <div className="flex flex-col space-y-4">
              {techSpecFeatures.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSpec(index)}
                  className={`p-6 rounded-xl cursor-pointer border-2 transition-all duration-300 ${activeSpec === index ? 'bg-gray-800 border-blue-500' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="flex items-center">
                    <feature.icon className={`w-8 h-8 mr-4 transition-colors ${activeSpec === index ? 'text-blue-400' : 'text-gray-400'}`} />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <div
                    className="grid transition-all duration-500 ease-in-out"
                    style={{ gridTemplateRows: activeSpec === index ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section - NEW */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Best Sellers</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Products our customers love the most. Chosen by the community.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bestSellers.map((product) => (
              <Link 
                to={`/products/${product.id}/${createSlug(product.title)}`}
                key={product.id}
              >
                <Card  
                  {...product} 
                  image={product.images[0]}
                  buttonText='View Details'
                  buttonIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => handleClick(product)} 
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Services Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Professional Repair Services</h2>
            <p className="mt-4 text-lg text-gray-600">Expert technicians, quality parts, fast turnaround</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Repair Services */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="flex-shrink-0">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone Repairs</h3>
                  <p className="mt-1 text-gray-600">Screen replacement, battery issues, water damage, software problems</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Same-day service
                    </span>
                    <span className="flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      90-day warranty
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="flex-shrink-0">
                  <Laptop className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Computer Repairs</h3>
                  <p className="mt-1 text-gray-600">Hardware upgrades, virus removal, data recovery, performance optimization</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      24-48 hour turnaround
                    </span>
                    <span className="flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      Data protection guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features & CTA */}
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-600 p-8 text-white">
                <h3 className="text-xl font-bold">Why Choose Our Repair Service?</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Certified technicians with 10+ years experience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Genuine parts and components</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Free diagnostic and estimate</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-200" />
                    <span>Competitive pricing with no hidden fees</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Get a Quote Today</h3>
                <p className="mt-2 text-gray-600">Bring your device in-store or call us for an estimate</p>
                <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <button className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    <Wrench className="mr-2 h-4 w-4" />
                    Schedule Repair
                  </button>
                  <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <a href="tel:+96171545936">Call 71 545 936</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
              <p className="mt-2 text-lg text-gray-600">Limited time deals you don't want to miss</p>
            </div>
              <button
                onClick={() => {
                  navigate(`/products?category=all`, { state: { isSale: true } });
                }}
                className="group flex items-center space-x-1 font-semibold text-red-600 hover:text-red-800"
              >
                View All Deals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </button>
          </div>
          
            {/* Featured Deal Banner */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Flash Sale</h3>
                  <p className="mt-2 text-lg opacity-90">Up to 70% off selected items</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {onSale.map((product) => (
                <Link 
                  to={`/products/${product.id}/${createSlug(product.title)}`}
                  key={product.id}
                >
                  <Card 
                    {...product} 
                    image={product.images[0]}
                    buttonText='View Details'
                    buttonIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => handleClick(product)}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>


      {/* Store Location Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Visit Our Store</h2>
            <p className="mt-4 text-lg text-gray-600">Find us easily and get directions to our location</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Store Information */}
            <div className="space-y-8">
              <div className="rounded-lg bg-gray-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Store Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">123 Main Street<br />Sidon, South Lebanon<br />Lebanon</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Store Hours</p>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                        <p>Sunday: 10:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">71 545 936</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors">
                  <Navigation className="mr-2 h-5 w-5" />
                  <a href="https://maps.app.goo.gl/ioTfRoyFRFKV5bKZ9" target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                </button>
                <button className="w-full flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Phone className="mr-2 h-5 w-5" />
                  <a href="tel:+96171545936">Call Store</a>
                </button>
              </div>
            </div>

            {/* Google Maps */}
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106749.69980557574!2d35.04674929726561!3d33.268374099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e7d29b7be8691%3A0x39eafea55b1c45c8!2saidiby%20smart%20tech!5e0!3m2!1sen!2slb!4v1751535074659!5m2!1sen!2slb"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
              
              {/* Map Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Aidiby Smart Tech</p>
                    <p className="text-sm text-gray-600">Tyre, Lebanon</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-sm ${getOpenStatus() === 'Open now' ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${getOpenStatus() === 'Open now' ? 'bg-green-500' : 'bg-red-500'} `}></div>
                      {getOpenStatus()}
                    </div>
                    <p className="text-xs text-gray-500">Closes at 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Index;
