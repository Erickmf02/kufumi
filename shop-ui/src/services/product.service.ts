import axios from "axios";

export interface Product {
  id: number,
  name: string,
  description: string,
  shortDescription: string,
  value: number,
  image: string,
  stock: number,
  images: string[]
  character?: Character
}

export interface PopularProduct extends Product{
  position: number,
  total: number
}

export interface Serie {
  id: number;
  name: string;
  description: string;
}

export interface Character {
  id: number;
  name: string;
  description: string;
  image: string;
  serie: Serie;
  products: Product[];
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

  async findTopProducts(): Promise<PopularProduct[]>{
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