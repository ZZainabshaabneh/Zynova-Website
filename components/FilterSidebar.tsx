import React from 'react';
import XIcon from './icons/XIcon';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories, selectedCategory, onSelectCategory, isOpen, onClose }) => {
  const CategoryButton: React.FC<{ category: string | null, label: string }> = ({ category, label }) => {
    const isActive = selectedCategory === category;
    return (
      <button
        onClick={() => onSelectCategory(category)}
        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? 'bg-indigo-600 text-white font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        {label}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4 lg:hidden">
            <h3 className="text-lg font-bold text-slate-900">Filter by Category</h3>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                <XIcon className="w-5 h-5"/>
            </button>
        </div>
      <h3 className="hidden lg:block text-lg font-bold text-slate-900 mb-4">Categories</h3>
      <nav className="space-y-1">
        <CategoryButton category={null} label="All Products" />
        {categories.map((cat) => (
          <CategoryButton key={cat} category={cat} label={cat} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <aside className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl z-50 transform transition-transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-slate-200">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
