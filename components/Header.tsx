import React from 'react';
import { useCart } from '../hooks/useCart';
import { User } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import StoreIcon from './icons/StoreIcon';


interface HeaderProps {
  onToggleCart: () => void;
  users: User[];
  currentUser: User;
  onSetCurrentUser: (user: User) => void;
  onGoHome: () => void;
  viewMode: 'shopping' | 'managing';
  onSetViewMode: (mode: 'shopping' | 'managing') => void;
  isVendor: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
    onToggleCart, 
    users, 
    currentUser, 
    onSetCurrentUser, 
    onGoHome, 
    viewMode, 
    onSetViewMode,
    isVendor
}) => {
  const { state } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === event.target.value);
    if (selectedUser) {
        onSetCurrentUser(selectedUser);
    }
  };
  
  const viewButtonClasses = (mode: 'shopping' | 'managing') => 
    `inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
      viewMode === mode
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onGoHome();
              }}
              className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              Zynova
            </a>
             <div className="hidden md:flex bg-slate-100 p-1 rounded-lg items-center">
                <button onClick={() => onSetViewMode('shopping')} className={viewButtonClasses('shopping')}>
                    <ShoppingBagIcon className="w-4 h-4" /> Shop
                </button>
                <button onClick={() => onSetViewMode('managing')} className={viewButtonClasses('managing')} disabled={!isVendor}>
                    <StoreIcon className="w-4 h-4" /> My Store
                </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="relative">
                <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                    value={currentUser.id}
                    onChange={handleUserChange}
                    className="pl-10 pr-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <button
              onClick={onToggleCart}
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
         <div className="md:hidden flex justify-center pb-2">
             <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                <button onClick={() => onSetViewMode('shopping')} className={viewButtonClasses('shopping')}>
                    <ShoppingBagIcon className="w-4 h-4" /> Shop
                </button>
                <button onClick={() => onSetViewMode('managing')} className={viewButtonClasses('managing')} disabled={!isVendor}>
                    <StoreIcon className="w-4 h-4" /> My Store
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;