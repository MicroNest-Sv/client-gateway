# Client Gateway

Gateway HTTP construido con [NestJS](https://nestjs.com/) que enruta solicitudes REST hacia los microservicios vía [NATS](https://nats.io/).

## Inicio rápido

```bash
# 1. Levantar NATS
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats

# 2. Instalar dependencias
pnpm install

# 3. Ejecutar en desarrollo
pnpm run start:dev
```

La app corre en el puerto `3000` por defecto (configurable en `.env`).

> Requiere los microservicios de productos y órdenes conectados al mismo servidor NATS.

## Variables de entorno

```env
PORT=3000
NATS_SERVERS="nats://localhost:4222"
```
