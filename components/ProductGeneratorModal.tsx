import React, { useState } from 'react';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import { generateProductIdeas } from '../services/geminiService';
import { Product } from '../types';

interface ProductGeneratorModalProps {
  onClose: () => void;
  onProductsGenerated: (products: Omit<Product, 'vendorId'>[]) => void;
}

const ProductGeneratorModal: React.FC<ProductGeneratorModalProps> = ({ onClose, onProductsGenerated }) => {
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const exampleCategories = [
        "Eco-Friendly Home Goods",
        "Futuristic Kitchen Gadgets",
        "Artisanal Coffee Accessories",
        "Smart Pet Toys",
        "Minimalist Desk Organization"
    ];

    const handleGenerate = async () => {
        if (!category.trim()) {
            setError('Please enter a product category.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const newProducts = await generateProductIdeas(category);
            onProductsGenerated(newProducts);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (example: string) => {
        setCategory(example);
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 animate-modal-enter" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                           <div className="bg-indigo-100 p-2 rounded-full mr-4">
                             <SparklesIcon className="w-8 h-8 text-indigo-600" />
                           </div>
                           <div>
                               <h2 className="text-2xl font-bold text-slate-900">Generate Products</h2>
                               <p className="text-slate-500">Describe a category and let AI create a product line.</p>
                           </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" aria-label="Close generator">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-8">
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Product Category</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., 'sustainable travel gear'"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500">Try one of these examples:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {exampleCategories.map(ex => (
                                <button key={ex} onClick={() => handleExampleClick(ex)} disabled={isLoading} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50">
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>


                    {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                    
                    <div className="mt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-6 h-6 mr-3" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
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

export default ProductGeneratorModal;