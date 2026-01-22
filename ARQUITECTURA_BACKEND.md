# Arquitectura Backend - E-commerce B2C

## Visión General

Este documento describe la arquitectura del backend del proyecto E-commerce B2C construido con NestJS, siguiendo los requisitos técnicos especificados.

---

## 1. Arquitectura NestJS Modular

### Estructura de Directorios

```
backend/
├── src/
│   ├── auth/              # Autenticación y tokens
│   ├── users/             # Gestión de usuarios
│   ├── products/          # CRUD de productos
│   ├── orders/            # Gestión de órdenes
│   ├── cart/              # Carrito de compras
│   ├── common/            # Código compartido
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── interceptors/
│   ├── prisma/            # Servicio de base de datos
│   └── main.ts            # Punto de entrada
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   └── migrations/        # Migraciones
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Módulos Principales (Feature Modules)

Cada funcionalidad tiene su propio módulo independiente:

#### **Auth Module**
- Maneja autenticación y generación de tokens JWT
- Login, registro, refresh tokens
- Estrategias de Passport

#### **Users Module**
- CRUD de usuarios
- Gestión de perfiles
- Roles y permisos

#### **Products Module**
- CRUD de productos
- Búsqueda y filtrado
- Gestión de stock

#### **Orders Module**
- Creación de órdenes
- Historial de compras
- Estados de órdenes

#### **Cart Module**
- Carrito de compras temporal
- Agregar/eliminar productos
- Cálculo de totales

### Estructura de Cada Módulo

```
module-name/
├── module-name.controller.ts    # Rutas HTTP (endpoints)
├── module-name.service.ts       # Lógica de negocio
├── module-name.module.ts        # Declaración del módulo
└── dto/                         # Data Transfer Objects
    ├── create-module.dto.ts
    └── update-module.dto.ts
```

---

## 2. Módulo Common (Código Compartido)

### Guards

#### **JwtAuthGuard**
```typescript
// jwt-auth.guard.ts
// Verifica que el usuario esté autenticado mediante JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### **RolesGuard**
```typescript
// roles.guard.ts
// Verifica que el usuario tenga los roles necesarios
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Decorators

#### **@Roles() Decorator**
```typescript
// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

#### **@CurrentUser() Decorator**
```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Interceptors

#### **TransformInterceptor** (Opcional)
```typescript
// transform.interceptor.ts
// Transforma la respuesta en un formato consistente
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}
```

---

## 3. Módulo Prisma

### PrismaService
```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### PrismaModule
```typescript
// prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 4. Sistema de Autenticación JWT

### Flujo de Autenticación

```
1. Usuario → POST /auth/login { email, password }
2. AuthService → Verifica credenciales
3. AuthService → Genera Access Token (15 min) + Refresh Token (7 días)
4. Cliente → Guarda tokens
5. Cliente → Requests con Authorization: Bearer <access_token>
6. JwtAuthGuard → Valida token en cada request
```

### Tokens

**Access Token:**
- Duración corta (15 minutos)
- Se envía en cada request
- Contiene: userId, email, role

**Refresh Token:**
- Duración larga (7 días)
- Solo para renovar access token
- Endpoint: POST /auth/refresh

### Ejemplo de Implementación

```typescript
// auth.service.ts
async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  
  const payload = { sub: user.id, email: user.email, role: user.role };
  
  return {
    access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
  };
}
```

---

## 5. Sistema de Roles con Guards + Reflector

### Definición de Roles

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

### Uso en Controllers

```typescript
@Controller('products')
export class ProductsController {
  
  // Solo administradores pueden crear productos
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create product (Admin only)' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  // Todos pueden ver productos (incluso sin autenticación)
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }
  
  // Solo usuarios autenticados pueden crear órdenes
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create order' })
  createOrder(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }
}
```

### Flujo de Verificación

```
1. Request llega al endpoint
2. JwtAuthGuard → Verifica token JWT
3. JwtAuthGuard → Extrae usuario y lo adjunta a request.user
4. RolesGuard → Lee metadata con Reflector
5. RolesGuard → Compara user.role con roles requeridos
6. Si no coincide → 403 Forbidden
7. Si coincide → Controller ejecuta la acción
```

**Principio Importante:** No hay lógica hardcodeada de roles. Todo se maneja mediante decorators y metadata.

---

## 6. Validación con Zod

### Definición de Schemas

```typescript
// create-product.dto.ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
```

### Uso en Controllers

```typescript
import { ZodValidationPipe } from 'nestjs-zod';

@Post()
create(
  @Body(new ZodValidationPipe(CreateProductSchema)) 
  createProductDto: CreateProductDto
) {
  return this.productsService.create(createProductDto);
}
```

### Ventajas de Zod

✅ Validación en runtime
✅ Inferencia de tipos automática
✅ Mensajes de error personalizables
✅ Composición de schemas
✅ Transformaciones de datos

---

## 7. Relaciones en la Base de Datos (Prisma)

### Esquema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders    Order[]
  cart      Cart?
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
  cartItems   CartItem[]
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  total     Float
  status    String      @default("pending")
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

model Cart {
  id        String     @id @default(uuid())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  user      User       @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int
  
  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}
```

### Diagrama de Relaciones

```
User (1) ────→ (N) Order
  │
  └──→ (1) Cart ────→ (N) CartItem
                            │
                            └──→ (1) Product
                                      │
                                      └──→ (N) OrderItem ←──── (1) Order
```

### Comandos Prisma

```bash
# Crear migración
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Ver base de datos en navegador
npx prisma studio
```

---

## 8. Documentación con Swagger (OpenAPI)

### Configuración en main.ts

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API para e-commerce B2C')
    .setVersion('1.0')
    .addBearerAuth() // Autenticación JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
```

### Decorators en Controllers

```typescript
@ApiTags('products') // Agrupa endpoints
@Controller('products')
export class ProductsController {
  
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth() // Requiere JWT
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
```

### Acceso a la Documentación

Una vez el servidor esté corriendo:
```
http://localhost:3000/api/docs
```

---

## 9. Flujo Completo de una Request

### Ejemplo: Crear un Producto (Admin)

```
1. Cliente → POST /products
   Headers: { Authorization: "Bearer <access_token>" }
   Body: { name: "Laptop", price: 999.99, stock: 10 }

2. NestJS recibe la request

3. JwtAuthGuard:
   - Extrae el token del header
   - Valida firma y expiración
   - Decodifica payload { sub: "user-id", role: "admin" }
   - Adjunta user a request.user

4. RolesGuard:
   - Lee metadata con Reflector: @Roles('admin')
   - Compara request.user.role === 'admin'
   - Si es true → continúa
   - Si es false → lanza 403 Forbidden

5. ZodValidationPipe:
   - Valida el body contra CreateProductSchema
   - Si es válido → continúa
   - Si es inválido → lanza 400 Bad Request

6. ProductsController.create():
   - Recibe el DTO validado
   - Llama a ProductsService.create()

7. ProductsService.create():
   - Ejecuta lógica de negocio
   - Llama a PrismaService para guardar en BD

8. PrismaService:
   - INSERT en tabla products
   - Retorna el producto creado

9. Response:
   - Status: 201 Created
   - Body: { id, name, price, stock, ... }

10. Swagger:
    - Documenta automáticamente este endpoint
```

---

## 10. Ventajas de esta Arquitectura

### ✅ Modularidad
- Cada feature es un módulo independiente
- Fácil de mantener y escalar
- Código reutilizable

### ✅ Type Safety
- TypeScript en toda la aplicación
- Zod valida tipos en runtime
- Prisma genera tipos automáticamente

### ✅ Seguridad
- JWT con refresh tokens
- Guards verifican autenticación y autorización
- Validación estricta de inputs

### ✅ Mantenibilidad
- Separación clara de responsabilidades
- Patrón dependency injection
- Código fácil de testear

### ✅ Documentación
- Swagger genera docs automáticamente
- Contrato de API claro
- Fácil para frontend consumir

### ✅ Escalabilidad
- Arquitectura preparada para crecer
- Fácil agregar nuevos módulos
- Performance optimizado con Prisma

---

## 11. Checklist de Implementación

### Backend Core
- [ ] Setup inicial de NestJS
- [ ] Configurar Prisma + PostgreSQL
- [ ] Crear esquema de base de datos
- [ ] Implementar migraciones

### Autenticación
- [ ] Módulo Auth con JWT
- [ ] Login y Register
- [ ] Refresh tokens
- [ ] JWT Strategy con Passport

### Autorización
- [ ] JwtAuthGuard
- [ ] RolesGuard con Reflector
- [ ] @Roles() decorator
- [ ] @CurrentUser() decorator

### Módulos de Negocio
- [ ] Users module (CRUD)
- [ ] Products module (CRUD)
- [ ] Cart module
- [ ] Orders module

### Validación
- [ ] Configurar Zod
- [ ] DTOs con schemas
- [ ] Validation pipes

### Documentación
- [ ] Configurar Swagger
- [ ] Decorators en controllers
- [ ] Bearer auth en Swagger

### Docker
- [ ] Dockerfile para backend
- [ ] docker-compose.yml
- [ ] PostgreSQL en container

---

## 12. Recursos y Referencias

### Documentación Oficial
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev/)
- [Swagger/OpenAPI](https://swagger.io/specification/)

### Tutoriales Recomendados
- NestJS Authentication with JWT
- Prisma with PostgreSQL
- Role-Based Access Control (RBAC) in NestJS

### Buenas Prácticas
- Usar DTOs para validación
- Separar lógica de negocio en services
- No hardcodear valores (usar .env)
- Manejar errores correctamente
- Logging apropiado

---

## Notas Finales

Esta arquitectura cumple con todos los requisitos técnicos especificados:

✅ NestJS con arquitectura modular
✅ Guards, Interceptors, Decorators
✅ JWT con access + refresh tokens
✅ Roles con Guards + Reflector (sin hardcodear)
✅ Validación con Zod
✅ PostgreSQL + Prisma
✅ Swagger documentado
✅ Dockerizado

La clave es seguir los principios de NestJS y mantener el código limpio, modular y type-safe.
