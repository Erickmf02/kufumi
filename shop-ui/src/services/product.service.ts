import axios from "axios";

export interface Product {
  id: number,
  name: string,
  description: string,
  value: number,
  image: string,
  stock: number,
  images: string[]
}

export class ProductService {
  constructor(
    private readonly apiUrl: string
  ) {}

  print(){
    console.log('el pepe')
  }

  async find(): Promise<Product[]>{
    const response = await axios.get(`${this.apiUrl}/product`);
    return response.data;
  }

  async findTopProducts(): Promise<Product[]>{
    const response = await axios.get(`${this.apiUrl}/product/top-products`);
    return response.data;
  }

  async findOne(id: number): Promise<Product> {
    const response = await axios.get(`${this.apiUrl}/product/${id}`);
    return response.data;
  }

  async findMany(ids: number[]){
    const response = await axios.get(`${this.apiUrl}/product/many?ids=[${ids.join(',')}]`)
    return response.data;
  }
}