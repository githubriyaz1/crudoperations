import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ProductProvider } from "./context/ProductContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CouponProvider } from "./context/CouponContext";
import { StoreProvider } from "./context/StoreContext";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import CategoriesAdmin from "./admin/CategoriesAdmin";
import CustomersAdmin from "./admin/CustomersAdmin";
import OrdersAdmin from "./admin/OrdersAdmin";
import ProductsAdmin from "./admin/ProductsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
import CouponsAdmin from "./admin/CouponsAdmin";
import AnalyticsAdmin from "./admin/AnalyticsAdmin";
import ReviewsAdmin from "./admin/ReviewsAdmin";
import About from "./pages/About";
import Cart from "./pages/Cart";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import GiftBox from "./pages/GiftBox";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";
import OrderResult from "./pages/OrderResult";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ShopAll from "./pages/ShopAll";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <StoreProvider>
          <CouponProvider>
            <OrdersProvider>
              <CartProvider>
                <WishlistProvider>
                  <BrowserRouter>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/shopall" element={<ShopAll />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/search" element={<Search />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/studs" element={<CategoryPage category="studs" />} />
                      <Route path="/earrings" element={<CategoryPage category="earrings" />} />
                      <Route path="/rings" element={<CategoryPage category="rings" />} />
                      <Route path="/chains" element={<CategoryPage category="chains" />} />
                      <Route path="/bracelets" element={<CategoryPage category="bracelets" />} />
                      <Route path="/bangles" element={<CategoryPage category="bangles" />} />
                      <Route path="/necklaces" element={<CategoryPage category="necklaces" />} />
                      <Route path="/combos" element={<CategoryPage category="combos" />} />
                      <Route path="/gifts" element={<CategoryPage category="gifts" />} />
                      <Route path="/bestsellers" element={<CategoryPage category="bestsellers" />} />
                      <Route path="/newarrivals" element={<CategoryPage category="newarrivals" />} />
                      <Route path="/category/:categorySlug" element={<CategoryPage />} />
                      <Route path="/giftbox" element={<GiftBox />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrderHistory />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/order-success" element={<OrderResult success />} />
                      <Route path="/order-failed" element={<OrderResult success={false} />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<AdminOverview />} />
                        <Route path="products" element={<ProductsAdmin />} />
                        <Route path="categories" element={<CategoriesAdmin />} />
                        <Route path="orders" element={<OrdersAdmin />} />
                        <Route path="customers" element={<CustomersAdmin />} />
                        <Route path="reviews" element={<ReviewsAdmin />} />
                        <Route path="coupons" element={<CouponsAdmin />} />
                        <Route path="analytics" element={<AnalyticsAdmin />} />
                        <Route path="settings" element={<SettingsAdmin />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                    <Toast />
                  </BrowserRouter>
                </WishlistProvider>
              </CartProvider>
            </OrdersProvider>
          </CouponProvider>
        </StoreProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
