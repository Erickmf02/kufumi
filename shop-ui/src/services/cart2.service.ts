import { store, type Cart } from "../stores/cart2.store";

class Cart2Service {
  private localStorageKey: string;
  wasLoaded = false;
  
  constructor() {
    this.localStorageKey = 'cart2'
  }

  
  // Obtiene el estado completo del carrito
  getCart(): Cart {
    return store.getState().cart;
  }

  // Actualiza el estado completo del carrito
  setCart(newCart: Cart): void {
    store.setState({
      ...store.getState(),
      cart: newCart,
    });
    this.saveCartToLocalStorage(newCart); // Persiste en localStorage
  }

  // Suscribirse a cambios en el carrito completo
  subscribe(callback: (cart: Cart) => void): () => void {
    return store.subscribe((state) => {
      callback(state.cart);
    });
  }


  tryLoadCartFromLocalStorage(callback?: Function): void {
    const cartData = localStorage.getItem(this.localStorageKey);
  
    if (cartData) {
      const cart: Cart = JSON.parse(cartData);
      this.setCart(cart);
    }
    this.wasLoaded = true;
    console.log("[app] Cart loaded from local storage")
    if(callback){
      callback()
    }
  }
  

  private saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
  }
}

export const cartService = new Cart2Service();
