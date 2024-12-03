export interface ProductResume {
  id: number
  name: string
  value: number
  stock: number
  image: string
  createdAt: Date
}

export interface ProductDetails {
  id: number
  name: string
  value: number
  stock: number
  image: string
  images: string[]
  isActive: boolean
  createdAt: Date
}