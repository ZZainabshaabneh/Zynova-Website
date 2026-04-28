import React from 'react';
import { useCart } from '../hooks/useCart';
import XIcon from './icons/XIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (items: CartItem[]) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { state, dispatch } = useCart();
  const { items } = state;

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <ShoppingCartIcon className="w-7 h-7 mr-3 text-indigo-600"/>
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <img src="https://picsum.photos/seed/emptycart/200/200" alt="Empty cart" className="w-40 h-40 rounded-full mb-6 opacity-50"/>
                <h3 className="text-xl font-semibold text-slate-700">Your Cart is Empty</h3>
                <p className="text-slate-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                <button onClick={onClose} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    Continue Shopping
                </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6">
              <ul className="divide-y divide-slate-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-slate-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                            <input
                                id={`quantity-${item.id}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                min="1"
                                max={item.stock}
                                className="w-16 text-center border border-slate-300 rounded-md"
                            />
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {items.length > 0 && (
            <div className="border-t border-slate-200 p-6">
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  onClick={() => onCheckout(items)}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;