import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('register')
    @ApiOperation({summary: 'Registrar un nuevo usuario'})
    @ApiResponse({status: 201, description: 'Usuario creado con exito'})
    @ApiResponse({status: 400, description: 'Informacion invalida'})
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login de usuario'})
    @ApiResponse({status: 200, description: 'Login exitoso'})
    @ApiResponse({status: 400, description: 'Credenciales invalidas'})
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


}
