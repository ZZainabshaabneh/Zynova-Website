import React, { useState, useEffect } from 'react';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import PencilIcon from './icons/PencilIcon';
import { generateEnhancedDescription } from '../services/geminiService';
import { Product } from '../types';

interface ProductEditModalProps {
  onClose: () => void;
  onProductUpdate: (product: Product) => void;
  product: Product;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ onClose, onProductUpdate, product }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [stock, setStock] = useState(product.stock.toString());
    const [category, setCategory] = useState(product.category);
    const [description, setDescription] = useState(product.description);
    const [image, setImage] = useState<string | null>(product.imageUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleUpdate = async () => {
        if (!name || !price || !stock || !description || !image || !category) {
            setError('Please fill in all fields and ensure an image is present.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const updatedProduct: Product = {
                ...product,
                name,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                description,
                imageUrl: image,
                category,
            };
            onProductUpdate(updatedProduct);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegenerateDescription = async () => {
        if (!name || !description) return;
        try {
            const enhancedDescription = await generateEnhancedDescription(name, description);
            setDescription(enhancedDescription);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-modal-enter" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                           <div className="bg-blue-100 p-2 rounded-full mr-4">
                             <PencilIcon className="w-8 h-8 text-blue-600" />
                           </div>
                           <div>
                               <h2 className="text-2xl font-bold text-slate-900">Edit Product</h2>
                               <p className="text-slate-500">Update the details for your product.</p>
                           </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" aria-label="Close modal">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-8 space-y-6">
                         {image && (
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                                <img src={image} alt="Product preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                            </div>
                         )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name-edit" className="block text-sm font-medium text-slate-700">Product Name</label>
                                <input type="text" id="name-edit" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                             <div>
                                <label htmlFor="price-edit" className="block text-sm font-medium text-slate-700">Price (USD)</label>
                                <input type="number" id="price-edit" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="stock-edit" className="block text-sm font-medium text-slate-700">Stock</label>
                                <input type="number" id="stock-edit" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="category-edit" className="block text-sm font-medium text-slate-700">Category</label>
                                <input type="text" id="category-edit" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description-edit" className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea id="description-edit" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full input-style"></textarea>
                            <button onClick={handleRegenerateDescription} className="text-xs text-indigo-600 hover:underline mt-1">Regenerate with AI</button>
                        </div>
                    </div>

                    {error && <p className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                    
                    <div className="mt-8">
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
              .input-style {
                box-shadow: sm;
                appearance: none;
                border: 1px solid #cbd5e1;
                border-radius: 0.375rem;
                padding: 0.5rem 0.75rem;
                width: 100%;
                font-size: 0.875rem;
                line-height: 1.25rem;
              }
              .input-style:focus {
                outline: none;
                --tw-ring-color: #4f46e5;
                box-shadow: 0 0 0 1px var(--tw-ring-color);
                border-color: var(--tw-ring-color);
              }
              @keyframes modal-enter {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-modal-enter { animation: modal-enter 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ProductEditModal;
