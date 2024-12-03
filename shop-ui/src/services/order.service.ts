import axios from "axios";

export class OrderService{
  constructor(
    private readonly apiUrl: string
  ){}

  async findOne(id: number, token?: string) {
    const response = await axios.get(`${this.apiUrl}/order/${id}?token=${token}`);
    return response.data;
  }

  async create(data: CreateParams){
    const response = await axios.post(`${this.apiUrl}/order`, data)
    return response.data;
  }
}

interface CreateParams {
  paymentProvider: string,
  client: {
    name: string,
    email: string,
    rut: string,
    phone: string,
  },
  items: {
    id: number,
    stock: number
  }[]
}