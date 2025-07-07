import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FloatingSocialMedia from "./components/FloatingIcon";
import ProtectedRoutes from "./components/ProtectedRoutes";

function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id/:title" element={<ProductDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoutes />}>
          <Route path={`/admin/*`} element={<AdminLayout />}>
            <Route path="categories" element={<CategoryManager />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="products" element={<ProductManager />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
      <FloatingSocialMedia />
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
