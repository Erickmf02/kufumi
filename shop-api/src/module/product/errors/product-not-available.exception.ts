import { ConflictException } from '@nestjs/common';
import { ProductAvailabilityResponse } from '../interfaces/product-availability-response';

export class ProductNotAvailableException extends ConflictException {
  constructor(availabilityResponse: ProductAvailabilityResponse[]) {
    const missingStockItems = availabilityResponse.filter(response => !response.isAvailable);
    const message = missingStockItems.map(item => {
      return `Producto "${item.product.name}" (ID: ${item.id}): solicitado ${item.quantity}, disponible ${item.product.stock}.`;
    }).join('\n');
    super(message || 'El producto no está disponible');
  }
}
