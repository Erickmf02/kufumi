import { ProductAvailabilityResponse } from "./interfaces/product-availability-response";

export function hasMissingStock(availabilityResponse: ProductAvailabilityResponse[]): boolean {
  return availabilityResponse.some(response => !response.isAvailable);
}
