
import React, { createContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem.quantity < existingItem.stock) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
        }
        return { ...state, items: updatedItems };
      }
      if (action.payload.stock > 0) {
        return {
            ...state,
            items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      return state;
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload;
        if (quantity <= 0) {
            return {
                ...state,
                items: state.items.filter((item) => item.id !== id),
            };
        }
        return {
            ...state,
            items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
            ),
        };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

interface CartContextProps {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextProps>({
    state: initialState,
    dispatch: () => null
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
