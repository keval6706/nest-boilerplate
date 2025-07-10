# Docker Setup for NestJS Boilerplate

This project includes Docker and Docker Compose configurations for easy development and deployment.

## Prerequisites

- Docker
- Docker Compose

## Services

- **NestJS App**: Your main application (port 8080)
- **MongoDB**: Latest MongoDB database (port 27017)
- **Redis**: Latest Redis cache (port 6379)
- **Mongo Express**: MongoDB admin UI (port 8081) - optional
- **Redis Commander**: Redis admin UI (port 8082) - optional

## Quick Start

### Production Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Development Mode

```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 8080)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port

## Database Configuration

### MongoDB
- **Host**: mongodb (container name)
- **Port**: 27017
- **Database**: nest-boilerplate
- **Admin User**: admin / password
- **App User**: nestapp / nestpass

### Redis
- **Host**: redis (container name)
- **Port**: 6379

## Admin Interfaces

### MongoDB Admin (Mongo Express)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: password

### Redis Admin (Redis Commander)
- **URL**: http://localhost:8082

## Volumes

- `mongodb_data`: Persistent MongoDB data
- `redis_data`: Persistent Redis data

## JWT Keys

Make sure your `jwt.key` and `jwt.key.pub` files exist in the project root before building the Docker image.

## Useful Commands

```bash
# Rebuild the application container
docker-compose build app

# Execute commands in running container
docker-compose exec app sh

# View container logs
docker-compose logs -f [service-name]

# Reset databases (removes all data)
docker-compose down -v

# Update to latest images
docker-compose pull
```

## Production Considerations

1. Change default passwords in production
2. Use Docker secrets for sensitive data
3. Configure proper SSL certificates
4. Set up monitoring and logging
5. Configure backup strategies for databases

## Troubleshooting

### Port Conflicts
If you get port conflicts, modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "3000:8080"  # Change left side to available port
```

### Database Connection Issues
1. Ensure containers are on the same network
2. Use container names as hostnames
3. Check firewall settings
4. Verify environment variables

### JWT Key Issues
Ensure JWT keys are present and readable:
```bash
ls -la jwt.key*
```
