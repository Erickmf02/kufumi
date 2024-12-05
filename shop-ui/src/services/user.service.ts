import axios from "axios";

export class UserService {
  constructor(
    private readonly apiUrl: string
  ) {}

  async findByToken(token: string): Promise<{
    id: number,
    name: string,
    username: string,
    email: string,
    createdAt: Date
  }>{
    const response = await axios.get(`${this.apiUrl}/user/token?token=${token}`);
    return response.data;
  }

  async findById(id: number): Promise<{
    id: number,
    name: string,
    username: string,
    email: string,
    createdAt: Date
  }>{
    const response = await axios.get(`${this.apiUrl}/user/${id}`);
    return response.data;
  } 

  async getSignInUrl(): Promise<string>{
    const response = await axios.get(`${this.apiUrl}/user/auth-url`);
    return response.data.url;
  } 
}