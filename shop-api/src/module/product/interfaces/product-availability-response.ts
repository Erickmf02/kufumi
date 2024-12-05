import { Product } from "../entities/product"
import { ProductAvailabilityRequest } from "./product-availability-request"

export interface ProductAvailabilityResponse extends ProductAvailabilityRequest {
  product: Product
  isAvailable: boolean
}