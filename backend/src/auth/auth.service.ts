import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}


    async register(registerDto: RegisterDto){
        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Crear usuario
        const user = await this.prisma.user.create({
            data: {
                name: registerDto.name,
                email: registerDto.email,
                password: hashedPassword
            }
        });

        // Generar token
        const access_token = this.generateToken(user);

        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async login(loginDto: LoginDto){
        // Buscar usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email }
        });

        if (!user){
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid){
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // Generar token
        const access_token = this.generateToken(user);

        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }


    private generateToken(user: {id: string, email: string, role: string}){
        const payload = { sub: user.id, email: user.email, role: user.role};
        return this.jwtService.sign(payload);
    }



}
