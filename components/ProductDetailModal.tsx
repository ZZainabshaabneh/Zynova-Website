import React from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import XIcon from './icons/XIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import PhotoIcon from './icons/PhotoIcon';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  addNotification: (message: string, vendorId: string) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, addNotification }) => {
    const { dispatch } = useCart();
    const isSoldOut = product.stock === 0;

    const handleAddToCart = () => {
        if (isSoldOut) return;
        dispatch({ type: 'ADD_ITEM', payload: product });
        addNotification(`'${product.name}' was added to a cart!`, product.vendorId);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 scale-95 animate-modal-enter"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-slate-100">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale' : ''}`}/>
                    ) : (
                        <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
                             <PhotoIcon className="w-16 h-16 text-slate-400" />
                        </div>
                    )}
                     {isSoldOut && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold tracking-wider uppercase">Sold Out</span>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{product.name}</h2>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">${product.price.toFixed(2)}</p>
                        <p className="mt-6 text-slate-600 text-base leading-relaxed">{product.description}</p>
                    </div>
                    <div className="mt-8">
                         <button 
                            onClick={handleAddToCart}
                            disabled={isSoldOut}
                            className={`w-full text-white py-3 px-6 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg flex items-center justify-center ${
                                isSoldOut 
                                ? 'bg-slate-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                            }`}
                        >
                            <ShoppingCartIcon className="w-6 h-6 mr-3"/>
                            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
                    aria-label="Close product details"
                >
                    <XIcon className="w-8 h-8"/>
                </button>
            </div>
            {/* Fix: Removed non-standard "jsx" prop from <style> tag to resolve TypeScript error. The 'jsx' prop is specific to libraries like styled-jsx and not a standard HTML attribute. */}
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

export default ProductDetailModal;