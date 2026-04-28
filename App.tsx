
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductDetailModal from './components/ProductDetailModal';
import Cart from './components/Cart';
import Footer from './components/Footer';
import FilterSidebar from './components/FilterSidebar';
import FilterIcon from './components/icons/FilterIcon';
import VendorDashboard from './components/VendorDashboard';
import NotificationToast from './components/NotificationToast';
import SearchBar from './components/SearchBar';

// Fix: `useCart` is a custom hook and should be imported from `hooks/useCart.ts`. `CartContext` only exports the provider.
import { CartProvider } from './context/CartContext';
import { useCart } from './hooks/useCart';
import { Product, User, Notification, Order, CartItem } from './types';

// Mock data
const USERS: User[] = [
    { id: 'user-0', name: 'Visitor (Shopper)', isVendor: false, subscriptionActive: false },
    { id: 'user-1', name: 'Artisan Corner', isVendor: true, subscriptionActive: true },
    { id: 'user-2', name: 'Gadget Grove', isVendor: true, subscriptionActive: true },
    { id: 'user-3', name: 'Book Nook Inc.', isVendor: true, subscriptionActive: false },
];

const AppContent: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'shopping' | 'managing'>('shopping');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { dispatch } = useCart();

    useEffect(() => {
        // When user changes, if they are not a vendor, switch to shopping view
        if (!currentUser.isVendor) {
            setViewMode('shopping');
        }
    }, [currentUser]);

    const addNotification = (message: string, vendorId: string, type: 'cart' | 'order') => {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            message,
            vendorId,
            type,
        };
        // This logic is for showing the toast, assuming the current user is the vendor.
        // In a real app, this would be a push notification.
        const vendor = USERS.find(u => u.id === vendorId);
        if (vendor) {
            console.log(`Notification for ${vendor.name}: ${message}`);
        }
        setNotifications(prev => [newNotification, ...prev]);
    };
    
    const handleProductsGenerated = (newProducts: Omit<Product, 'vendorId'>[]) => {
        if (!currentUser.isVendor) return;
        const productsWithVendor = newProducts.map(p => ({
            ...p,
            vendorId: currentUser.id,
        }));
        setProducts(prev => [...prev, ...productsWithVendor]);
        if(productsWithVendor.length > 0) {
            setSelectedCategory(productsWithVendor[0].category);
        }
    };

    const handleProductAdded = (newProduct: Omit<Product, 'vendorId'>) => {
        if (!currentUser.isVendor) return;
        const productWithVendor = { ...newProduct, vendorId: currentUser.id };
        setProducts(prev => [productWithVendor, ...prev]);
    };
    
    const handleProductUpdate = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleProductDelete = (productId: string) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== productId));
        }
    };

    const handleCheckout = (cartItems: CartItem[]) => {
        const ordersByVendor: Record<string, CartItem[]> = cartItems.reduce((acc, item) => {
            if (!acc[item.vendorId]) {
                acc[item.vendorId] = [];
            }
            acc[item.vendorId].push(item);
            return acc;
        }, {} as Record<string, CartItem[]>);

        const newOrders: Order[] = Object.entries(ordersByVendor).map(([vendorId, items]) => {
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            addNotification(`You have a new order for $${total.toFixed(2)}!`, vendorId, 'order');
            return {
                id: `order-${Date.now()}-${vendorId}`,
                vendorId,
                items,
                total,
                createdAt: new Date(),
            };
        });

        setOrders(prev => [...prev, ...newOrders]);
        dispatch({ type: 'CLEAR_CART' });
        setIsCartOpen(false);
        alert('Thank you for your order! Your purchase has been confirmed.');
    };

    const allCategories = [...new Set(products.map(p => p.category))];
    
    // Show products only from vendors with an active subscription
    const vendorsWithActiveSubscription = USERS.filter(u => u.subscriptionActive).map(u => u.id);
    const visibleProducts = products.filter(p => vendorsWithActiveSubscription.includes(p.vendorId));

    const searchedProducts = searchTerm 
        ? visibleProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : visibleProducts;

    const filteredProducts = selectedCategory
        ? searchedProducts.filter(p => p.category === selectedCategory)
        : searchedProducts;
        
    const currentNotifications = notifications.filter(n => n.vendorId === currentUser.id);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header 
                onToggleCart={() => setIsCartOpen(!isCartOpen)} 
                users={USERS}
                currentUser={currentUser}
                onSetCurrentUser={setCurrentUser}
                onGoHome={() => {
                    setSelectedCategory(null);
                    setViewMode('shopping');
                }}
                viewMode={viewMode}
                onSetViewMode={setViewMode}
                isVendor={currentUser.isVendor}
            />
            
            <main className="flex-grow">
                {viewMode === 'shopping' ? (
                    <>
                        <Hero />
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="flex items-baseline justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                        {selectedCategory || "All Products"}
                                    </h2>
                                    <p className="mt-1 text-lg text-slate-500">Discover our latest collection.</p>
                                </div>
                                 <button 
                                    onClick={() => setIsFilterSidebarOpen(true)}
                                    className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
                                >
                                    <FilterIcon className="w-4 h-4" /> Filter
                                </button>
                            </div>
                            <div className="flex items-start gap-8">
                                <FilterSidebar 
                                    categories={allCategories}
                                    selectedCategory={selectedCategory}
                                    onSelectCategory={(cat) => {
                                        setSelectedCategory(cat);
                                        setIsFilterSidebarOpen(false);
                                    }}
                                    isOpen={isFilterSidebarOpen}
                                    onClose={() => setIsFilterSidebarOpen(false)}
                                />
                                <div className="flex-1">
                                     <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
                                     <div className="mt-8">
                                        <ProductList products={filteredProducts} onProductSelect={setSelectedProduct} />
                                     </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <VendorDashboard 
                        currentUser={currentUser}
                        products={products.filter(p => p.vendorId === currentUser.id)}
                        orders={orders.filter(o => o.vendorId === currentUser.id)}
                        onProductsGenerated={handleProductsGenerated}
                        onProductAdd={handleProductAdded}
                        onProductUpdate={handleProductUpdate}
                        onProductDelete={handleProductDelete}
                    />
                )}
            </main>
            
            <Footer />

            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)}
                    addNotification={(message, vendorId) => addNotification(message, vendorId, 'cart')}
                />
            )}

            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />

            {currentNotifications.map((notification, index) => (
                 <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    index={index}
                />
            ))}
        </div>
    );
};

const App: React.FC = () => (
    <CartProvider>
        <AppContent />
    </CartProvider>
);


export default App;