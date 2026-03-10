# Client Gateway

Gateway HTTP construido con [NestJS](https://nestjs.com/) que enruta solicitudes hacia los microservicios de productos y órdenes via TCP.

## Inicio rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Ejecutar en desarrollo
pnpm start:dev
```

La app corre en el puerto `3000` por defecto (configurable en `.env`).

> Requiere los microservicios de productos (`3001`) y órdenes (`3002`) corriendo.
