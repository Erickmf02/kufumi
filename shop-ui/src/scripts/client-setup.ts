import { cartService } from '../services/cart2.service';


// Esta función solo se ejecutará una vez al cargar la página
function initializeCart() {
  if(!cartService.wasLoaded){
    cartService.tryLoadCartFromLocalStorage();
  }
}

// Ejecutar la inicialización al cargar la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initializeCart();
  });
}