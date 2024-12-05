import { Controller, Get, Param, Query, Redirect } from "@nestjs/common";
import { UserService } from "./user.service";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";
import { ParseStringPipe } from "src/common/pipes/parse-string.pipe";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}

  @Get('auth-url')
  async getAuthUrl(){
    const url = await this.userService.handleGoogleGenerateAuthUrl();
    return { url };
  }

  @Get('auth')
  @Redirect()
  async handleAuth(
    @Query() query
  ){
    const { code, scope, prompt, error } = query;
    const dto = {
      code,
      scope,
      prompt,
      error
    }
    const url = await this.userService.handleGoogleSignIn(dto);
    return { url };
  }

  @Get('token')
  async findByToken(
    @Query('token', ParseStringPipe) token: string
  ){
    return await this.userService.findByToken(token)
  }
  
  @Get(':id')
  async findById(
    @Param('id', ParsePositiveIntPipe) id: number
  ) {
    return await this.userService.handleFindById(id);
  }

  
}