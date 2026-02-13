import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }


    async register(registerDto: RegisterDto) {
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

        // Generar tokens
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);

        // Guardar refresh token hasheado en BD
        const hashedRefreshToken = await this.hashRefreshToken(refresh_token);
        await this.saveHashedRefreshToken(hashedRefreshToken, user.id);

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async login(loginDto: LoginDto) {
        // Buscar usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email }
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales invalidas');
        }

        // Generar token
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);

        // Guardar refresh token hasheado en BD
        const hashedRefreshToken = await this.hashRefreshToken(refresh_token);
        await this.saveHashedRefreshToken(hashedRefreshToken, user.id);

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }

    async refresh(refreshTokenDto: RefreshTokenDto) {
        try {
            // Verificar que el token sea válido
            const payload = this.jwtService.verify(refreshTokenDto.refresh_token, {
                secret: this.configService.get("JWT_REFRESH_SECRET")
            });

            // Buscar usuario
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user || !user.refreshToken) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            // Verificar que el refresh token coincida con el guardado
            const isRefreshTokenValid = await bcrypt.compare(
                refreshTokenDto.refresh_token,
                user.refreshToken,
            );

            if (!isRefreshTokenValid) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            // Generar nuevo access token
            const access_token = this.generateAccessToken(user);

            return { access_token };
        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }

    private generateAccessToken(user: { id: string, email: string, role: string }) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload, { 
            secret: this.configService.get("JWT_SECRET"),
            expiresIn: '15m' 
        });
    }

    private generateRefreshToken(user: { id: string, email: string, role: string }) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
            expiresIn: '7d'
        });
    }

    private async hashRefreshToken(token: string) {
        return bcrypt.hash(token, 10);
    }

    private async saveHashedRefreshToken(hashedRefreshToken: string, userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken }
        });
    }

}
