import { cartService } from '../services/cart2.service';
import { sessionService } from '../services/session.service';


// Esta función solo se ejecutará una vez al cargar la página
function initializeCart() {
  if(!cartService.wasLoaded){
    cartService.tryLoadCartFromLocalStorage();
  }
}

function initializeSession() {
  if(!sessionService.wasLoaded){
    sessionService.tryLoadSessionFromLocalStorage();
  }
}

// Ejecutar la inicialización al cargar la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initializeCart();
    initializeSession();
  });
}