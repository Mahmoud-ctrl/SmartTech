import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Navigation from "./components/Navbar";
import Footer from "./components/Footer";
import ProductsPage from "./pages/Products";
import AdminLayout from "./pages/admin/AdminLayout";
import CategoryManager from "./pages/admin/CategoryManager";
import BrandManager from "./pages/admin/BrandManager";
import ProductManager from "./pages/admin/ProductManager";
import AdminLogin from "./pages/admin/AdminLogin";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FloatingSocialMedia from "./components/FloatingIcon";
import ProtectedRoutes from "./components/ProtectedRoutes";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navigation />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id/:title" element={<ProductDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/hasan/admin/*" element={<AdminLayout />}>
            <Route path="categories" element={<CategoryManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingSocialMedia />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
