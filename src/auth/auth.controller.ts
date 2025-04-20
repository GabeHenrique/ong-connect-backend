import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "@prisma/client";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  login(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post("auth/register")
  async register(
    @Body()
    registerDto: {
      email: string;
      password: string;
      name: string;
      role: "ONG" | "VOLUNTEER";
    }
  ) {
    return this.authService.register(registerDto);
  }

  @Post("auth/signout")
  @HttpCode(200)
  signout() {
    return { message: "Logged out successfully" };
  }

  @Post("auth/forgot-password")
  async forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("auth/reset-password")
  async resetPassword(@Body() data: { token: string; password: string }) {
    return this.authService.resetPassword(data.token, data.password);
  }
}
