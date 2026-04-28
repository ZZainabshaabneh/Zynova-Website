import React, { useState } from 'react';
import { Product, User, Order } from '../types';
import ProductGeneratorModal from './ProductGeneratorModal';
import ProductUploadModal from './ProductUploadModal';
import ProductEditModal from './ProductEditModal';
import SparklesIcon from './icons/SparklesIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
// Fix: Added missing import for ShoppingCartIcon
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface VendorDashboardProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onProductsGenerated: (products: Omit<Product, 'vendorId'>[]) => void;
  onProductAdd: (product: Omit<Product, 'vendorId'>) => void;
  onProductUpdate: (product: Product) => void;
  onProductDelete: (productId: string) => void;
}

type ActiveTab = 'products' | 'orders';

const VendorDashboard: React.FC<VendorDashboardProps> = ({ 
    currentUser, 
    products, 
    orders,
    onProductsGenerated, 
    onProductAdd,
    onProductUpdate,
    onProductDelete
}) => {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');

  const handleProductsGenerated = (newProducts: Omit<Product, 'vendorId'>[]) => {
    onProductsGenerated(newProducts);
    setIsGeneratorOpen(false);
  };
  
  const handleProductAdded = (newProduct: Omit<Product, 'vendorId'>) => {
    onProductAdd(newProduct);
    setIsUploaderOpen(false);
  };

  const handleEditClick = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  
  const handleProductUpdated = (updatedProduct: Product) => {
    onProductUpdate(updatedProduct);
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const subscriptionActive = currentUser.subscriptionActive;

  const TabButton: React.FC<{tabName: ActiveTab, label: string, count: number}> = ({ tabName, label, count }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label} <span className="ml-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );

  const StockStatus: React.FC<{ stock: number }> = ({ stock }) => {
    return stock > 0 ? (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        {stock} in stock
      </span>
    ) : (
      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
        Sold Out
      </span>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Store Dashboard</h1>
                    <p className="mt-2 text-lg text-slate-600">Welcome back, {currentUser.name}!</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                     <button onClick={() => setIsUploaderOpen(true)} disabled={!subscriptionActive} className="inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                        <PlusCircleIcon className="w-5 h-5"/>
                        Add Product
                    </button>
                    <button onClick={() => setIsGeneratorOpen(true)} disabled={!subscriptionActive} className="inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                        <SparklesIcon className="w-5 h-5"/>
                        Generate with AI
                    </button>
                </div>
            </div>
            
            {!subscriptionActive && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="text-sm text-yellow-700">
                                Your subscription is inactive. You cannot add new products and your existing products are hidden from the store.
                                <a href="#" className="font-medium underline ml-2">Activate Subscription</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                <TabButton tabName="products" label="Products" count={products.length} />
                <TabButton tabName="orders" label="Orders" count={orders.length} />
            </div>

            {activeTab === 'products' && (
                <div>
                    {products.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Product</th>
                                    <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Category</th>
                                    <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Price</th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900">Stock</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-slate-900">{product.name}</div>
                                        </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-slate-500">{product.category}</td>
                                    <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center"><StockStatus stock={product.stock} /></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900 p-1"><PencilIcon className="w-5 h-5"/><span className="sr-only">Edit</span></button>
                                        <button onClick={() => onProductDelete(product.id)} className="text-red-600 hover:text-red-900 p-1 ml-2"><TrashIcon className="w-5 h-5"/><span className="sr-only">Delete</span></button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
                            <ClipboardListIcon className="mx-auto h-16 w-16 text-slate-400" />
                            <h3 className="mt-4 text-xl font-semibold text-slate-800">No products yet!</h3>
                            <p className="mt-2 text-slate-500">Get started by adding your first product or generating one with AI.</p>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'orders' && (
                 <div>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                        {orders.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Order #{order.id.slice(-6)}</h3>
                                        <p className="text-sm text-slate-500">Date: {order.createdAt.toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-lg font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                                </div>
                                <div className="mt-4 border-t border-slate-200 pt-4">
                                    <h4 className="font-semibold text-slate-700 mb-2">Items:</h4>
                                    <ul className="space-y-2">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3"/>
                                                    <span>{item.name} <span className="text-slate-500">x {item.quantity}</span></span>
                                                </div>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                         <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
                            <ShoppingCartIcon className="mx-auto h-16 w-16 text-slate-400" />
                            <h3 className="mt-4 text-xl font-semibold text-slate-800">No orders yet</h3>
                            <p className="mt-2 text-slate-500">New orders from your customers will appear here.</p>
                        </div>
                    )}
                 </div>
            )}

       </div>
       {isGeneratorOpen && (
            <ProductGeneratorModal 
                onClose={() => setIsGeneratorOpen(false)}
                onProductsGenerated={handleProductsGenerated}
            />
       )}
       {isUploaderOpen && (
            <ProductUploadModal
                onClose={() => setIsUploaderOpen(false)}
                onProductAdd={handleProductAdded}
            />
       )}
       {isEditModalOpen && productToEdit && (
            <ProductEditModal
                product={productToEdit}
                onClose={() => setIsEditModalOpen(false)}
                onProductUpdate={handleProductUpdated}
            />
       )}
    </div>
  );
};

export default VendorDashboard;