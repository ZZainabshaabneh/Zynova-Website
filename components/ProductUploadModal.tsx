import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import { generateEnhancedDescription } from '../services/geminiService';
import { Product } from '../types';

interface ProductUploadModalProps {
  onClose: () => void;
  onProductAdd: (product: Omit<Product, 'vendorId'>) => void;
}

const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ onClose, onProductAdd }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!name || !price || !stock || !keywords || !image || !category) {
            setError('Please fill in all fields and upload an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const enhancedDescription = await generateEnhancedDescription(name, keywords);
            const newProduct: Omit<Product, 'vendorId'> = {
                id: `prod-${Date.now()}`,
                name,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                description: enhancedDescription,
                imageUrl: image,
                imagePrompt: '', // Not needed for uploaded products
                category,
            };
            onProductAdd(newProduct);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-modal-enter" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-4">
                             <PlusCircleIcon className="w-8 h-8 text-green-600" />
                           </div>
                           <div>
                               <h2 className="text-2xl font-bold text-slate-900">Add a New Product</h2>
                               <p className="text-slate-500">Fill in the details and let AI enhance the description.</p>
                           </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" aria-label="Close modal">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-8 space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {image ? (
                                        <img src={image} alt="Product preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l-6-6-6 6M28 8v12a4 4 0 01-4 4H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    )}
                                    <div className="flex text-sm text-slate-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (USD)</label>
                                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Initial Stock</label>
                                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full input-style" placeholder="e.g., 'Home Goods'" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-slate-700">Keywords/Simple Description</label>
                            <textarea id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} rows={3} className="mt-1 block w-full input-style" placeholder="e.g., 'handmade, leather, minimalist, for travel'"></textarea>
                            <p className="mt-2 text-xs text-slate-500">AI will use this to write a beautiful description for your product.</p>
                        </div>
                    </div>

                    {error && <p className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                    
                    <div className="mt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Product...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-6 h-6 mr-3" />
                                    Generate & Add Product
                                </>
                            )}
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
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .animate-modal-enter {
                animation: modal-enter 0.2s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default ProductUploadModal;