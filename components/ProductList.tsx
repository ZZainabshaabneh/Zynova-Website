import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import SearchIcon from './icons/SearchIcon';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  if (products.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
            <SearchIcon className="w-16 h-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">No Products Found</h3>
            <p className="text-slate-500 mt-2 max-w-sm">We couldn't find any products matching your search or filter. Try a different keyword or clear the filters.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8">
      {products.map((product) => (
        <ProductCard 
            key={product.id} 
            product={product} 
            onProductSelect={onProductSelect} 
        />
      ))}
    </div>
  );
};

export default ProductList;