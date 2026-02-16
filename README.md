# E-commerce B2C

- **Live:** https://shop.shamoun.online
- **Swagger:** https://shop.shamoun.online/api/docs
- **Repo:** https://github.com/ciconid/proyecto-e-commerce-b2c

## Stack

- NestJS
- React 19 + TypeScript
- PostgreSQL + Prisma
- Mantine v8

## Requisitos cubiertos

### Backend
- Arquitectura modular
- Guards + Reflector para roles
- JWT (access + refresh tokens)
- Validación con Zod
- Swagger
- Docker

### Frontend
- React Hook Form + Zod
- TanStack Query (fetch, cache, invalidaciones)
- Zustand
- Axios con interceptores
- Mantine

## Decisiones de diseño

**Refresh token en localStorage:** Se sabe que almacenar tokens en localStorage es una vulnerabilidad XSS. En un entorno productivo deberían guardarse en cookies `httpOnly`. Se dejó así por simplicidad.

**Finalizar compra sin pasarela de pago:** En un e-commerce real, al confirmar la compra se iniciaría el proceso de pago y el stock se descontaría únicamente tras la confirmación. En este proyecto, al hacer clic en "Finalizar compra" se crea la orden y se descuenta el stock directamente.