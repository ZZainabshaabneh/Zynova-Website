import React from 'react';
import { Product } from '../types';
import PhotoIcon from './icons/PhotoIcon';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect }) => {
  const isSoldOut = product.stock === 0;

  return (
    <div
      onClick={() => onProductSelect(product)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-w-1 aspect-h-1 w-full bg-slate-100">
        {product.imageUrl ? (
            <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover object-center ${isSoldOut ? 'grayscale' : ''}`}
            />
        ) : (
            <div className="h-full w-full bg-slate-200 animate-pulse flex items-center justify-center">
                <PhotoIcon className="w-12 h-12 text-slate-400" />
            </div>
        )}
        {isSoldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-lg font-bold tracking-wider uppercase">Sold Out</span>
            </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800 flex-grow min-h-[3.5rem]">{/* min-h-14 for two lines */}
            {product.name}
        </h3>
        <p className="mt-2 text-2xl font-bold text-indigo-600">
            ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;