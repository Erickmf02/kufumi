import type { Product } from '../services/product.service';
import { createStore } from 'zustand/vanilla';

export interface Cart {
  items: {
    product: Product,
    stock: number
  }[]
}

interface storeState {
  cart: Cart
  setCart: (newCart: Cart) => void
}
// Crear la store
export const store = createStore<storeState>((set) => ({
  cart: {
    items: []
  }, // Estado inicial
  setCart: (newCart: Cart) => set({ cart: newCart }) // Función para actualizar el nombre
}));

