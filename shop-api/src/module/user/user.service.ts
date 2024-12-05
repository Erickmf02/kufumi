import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { google } from "googleapis";
import { Repository } from "typeorm";
import { User } from "./entities/user";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

interface GoogleAuthResponse {
  code?: string;
  scope?: string;
  prompt?: string;
  error?: string;
}

@Injectable()
export class UserService {
  private readonly serverOauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH2_CLIENTID,
    process.env.GOOGLE_OAUTH2_SECRET,
    `${process.env.CLIENT_API_URL}/user/auth`
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async handleGoogleSignIn(dto: GoogleAuthResponse) {
    const { code, scope, error } = dto;
    if (error) {
      throw new InternalServerErrorException(`Google Auth Error: ${error}`);
    }

    const expectedScope = ['openid', 'profile', 'email'];
    const receivedScopes = scope?.split(' ') || [];

    const isValidScope = expectedScope.every(scope => receivedScopes.includes(scope));
    if (!isValidScope) {
      throw new BadRequestException('Invalid scope. Expected "openid profile email".');
    }

    const { tokens: credentials } = await this.serverOauth2Client.getToken(code);

    const userOauth2 = google.oauth2({
      version: 'v2',
      auth: new google.auth.OAuth2({
        clientId: process.env.GOOGLE_OAUTH2_CLIENTID,
        credentials
      }),
    });

    const { data } = await userOauth2.userinfo.get();
    const { name, email } = data;
    if(!name || !email ){
      throw new ConflictException('Missing email or name.');
    }

    let user = await this.userRepository.findOne({where: { email }});
    if(!user){
      user = await this.userRepository.save({
        name,
        username: name,
        email
      })
    }

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);
    const url = `${process.env.CLIENT_URL}/auth?token=${token}`
    return url;
  }

  // Genera la URL de autenticación de Google
  async handleGoogleGenerateAuthUrl() {
    const authUrl: string = this.serverOauth2Client.generateAuthUrl({
      scope: ['email', 'profile', 'openid']
    });
    return authUrl;
  }

  async handleFindById(id: number){
    const user = await this.userRepository.findOne({where: {id}})
    if(!user){
      throw new NotFoundException(`Usuario ID ${id} no encontrado.`)
    }
    return user;
  }

  async findByToken(token: string): Promise<User> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
  
      const user = await this.userRepository.findOne({ where: { id: decoded.id } });
  
      if (!user) {
        throw new BadRequestException('User not found.');
      }
  
      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired.');
      }
      throw new InternalServerErrorException('Invalid token.');
    }
  }
  
}
