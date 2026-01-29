import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';


// Mock de bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    // Mocks
    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn()
        }
    };

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);


        // Limpiar antes de cada test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should create a user and return tokens', async () => {
            // Arrange
            const registerDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                id: 'user-id-123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed-password',
                role: 'user',
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockAccessToken = 'mock-access-token';
            const mockRefreshToken = 'mock-refresh-token';

            // Mock bcrypt.hash
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

            // Mock Prisma create
            mockPrismaService.user.create.mockResolvedValue(mockUser);

            // Mock JWT sign
            mockJwtService.sign.mockReturnValueOnce(mockAccessToken);
            mockJwtService.sign.mockReturnValueOnce(mockRefreshToken);

            // Mock Prisma update (para guardar refresh token)
            mockPrismaService.user.update.mockResolvedValue(mockUser);

            // Act
            const result = await service.register(registerDto);

            // Assert
            expect(result).toEqual({
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                user: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email,
                    role: mockUser.role,
                },
            });

            // Verificar que se llamaron los métodos correctos
            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    name: registerDto.name,
                    email: registerDto.email,
                    password: 'hashed-password',
                },
            });
            expect(jwtService.sign).toHaveBeenCalledTimes(2);
            expect(prismaService.user.update).toHaveBeenCalled();
        });
    });


    describe('login', () => {
        it('should return tokens for valid credentials', async () => {
            // Arrange
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                id: 'user-id-123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed-password',
                role: 'user',
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockAccessToken = 'mock-access-token';
            const mockRefreshToken = 'mock-refresh-token';

            // Mock Prisma findUnique
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Mock bcrypt.compare (password válido)
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // Mock JWT sign
            mockJwtService.sign.mockReturnValueOnce(mockAccessToken);
            mockJwtService.sign.mockReturnValueOnce(mockRefreshToken);

            // Mock Prisma update
            mockPrismaService.user.update.mockResolvedValue(mockUser);

            // Act
            const result = await service.login(loginDto);

            // Assert
            expect(result).toEqual({
                access_token: mockAccessToken,
                refresh_token: mockRefreshToken,
                user: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email,
                    role: mockUser.role,
                },
            });

            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginDto.email },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
        });

        it('should throw UnauthorizedException for invalid email', async () => {
            // Arrange
            const loginDto = {
                email: 'wrong@example.com',
                password: 'password123',
            };

            // Mock Prisma findUnique (usuario no encontrado)
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            // Act & Assert
            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
            await expect(service.login(loginDto)).rejects.toThrow('Credenciales invalidas');
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            // Arrange
            const loginDto = {
                email: 'test@example.com',
                password: 'wrong-password',
            };

            const mockUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                password: 'hashed-password',
                name: 'Test User',
                role: 'user',
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Mock Prisma findUnique
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Mock bcrypt.compare (password inválido)
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            // Act & Assert
            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refresh', () => {
        it('should return new access token for valid refresh token', async () => {
            // Arrange
            const refreshTokenDto = {
                refresh_token: 'valid-refresh-token',
            };

            const mockPayload = {
                sub: 'user-id-123',
                email: 'test@example.com',
                role: 'user',
            };

            const mockUser = {
                id: 'user-id-123',
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashed-password',
                role: 'user',
                refreshToken: 'hashed-refresh-token',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockNewAccessToken = 'new-access-token';

            // Mock JWT verify
            mockJwtService.verify.mockReturnValue(mockPayload);

            // Mock Prisma findUnique
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Mock bcrypt.compare (refresh token válido)
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // Mock JWT sign (nuevo access token)
            mockJwtService.sign.mockReturnValue(mockNewAccessToken);

            // Act
            const result = await service.refresh(refreshTokenDto);

            // Assert
            expect(result).toEqual({
                access_token: mockNewAccessToken,
            });

            expect(jwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refresh_token);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: mockPayload.sub },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                refreshTokenDto.refresh_token,
                mockUser.refreshToken,
            );
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            // Arrange
            const refreshTokenDto = {
                refresh_token: 'invalid-token',
            };

            // Mock JWT verify (lanza error)
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            // Act & Assert
            await expect(service.refresh(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
        });
    });
});

