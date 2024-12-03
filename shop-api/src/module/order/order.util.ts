import { randomBytes } from "crypto"


interface getTotalValueParameters {
  stock: number
  product: {
    value: number
  }
}



export function calculateOrderValue(items: getTotalValueParameters[]): number {
  return items.reduce((total, item) => {
    return total + item.stock * item.product.value;
  }, 0);
}

export function generarCadenaAleatoria(longitud) {
  return randomBytes(longitud)
               .toString('hex')
               .slice(0, longitud);
}