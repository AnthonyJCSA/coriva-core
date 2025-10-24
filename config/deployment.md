# 🚀 Guía de Despliegue - FarmaZi

## Arquitectura de Despliegue

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   BASE DATOS    │
│                 │    │                 │    │                 │
│ Vercel          │◄──►│ AWS EC2         │◄──►│ AWS RDS         │
│ Next.js         │    │ FastAPI         │    │ PostgreSQL      │
│ CDN Global      │    │ Load Balancer   │    │ Redis Cache     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 1. Frontend - Vercel

### Configuración
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde carpeta frontend
cd frontend
vercel --prod
```

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=https://api.farmazi.com
NEXT_PUBLIC_SUNAT_URL=https://api.sunat.gob.pe
```

### Configuración vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  }
}
```

## 2. Backend - AWS EC2

### Configuración del Servidor
```bash
# Ubuntu 22.04 LTS
sudo apt update && sudo apt upgrade -y

# Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# PostgreSQL Client
sudo apt install postgresql-client -y

# Nginx
sudo apt install nginx -y

# Supervisor para procesos
sudo apt install supervisor -y
```

### Configuración de la Aplicación
```bash
# Crear usuario para la app
sudo useradd -m -s /bin/bash farmazi
sudo su - farmazi

# Clonar repositorio
git clone <repo-url> farmazi
cd farmazi/backend

# Entorno virtual
python3.11 -m venv venv
source venv/bin/activate

# Dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env
# Editar .env con valores de producción
```

### Configuración Nginx
```nginx
# /etc/nginx/sites-available/farmazi
server {
    listen 80;
    server_name api.farmazi.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Configuración Supervisor
```ini
# /etc/supervisor/conf.d/farmazi.conf
[program:farmazi]
command=/home/farmazi/farmazi/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
directory=/home/farmazi/farmazi/backend
user=farmazi
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/farmazi.log
```

## 3. Base de Datos - AWS RDS

### Configuración PostgreSQL
```sql
-- Crear base de datos
CREATE DATABASE farmazi;
CREATE USER farmazi_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE farmazi TO farmazi_user;

-- Extensiones necesarias
\c farmazi;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Backup Automático
```bash
#!/bin/bash
# /home/farmazi/scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/farmazi/backups"
DB_NAME="farmazi"

# Crear backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/farmazi_$DATE.sql

# Comprimir
gzip $BACKUP_DIR/farmazi_$DATE.sql

# Limpiar backups antiguos (más de 7 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Subir a S3
aws s3 cp $BACKUP_DIR/farmazi_$DATE.sql.gz s3://farmazi-backups/
```

## 4. CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy FarmaZi

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.EC2_HOST }}
          username: farmazi
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd farmazi
            git pull origin main
            cd backend
            source venv/bin/activate
            pip install -r requirements.txt
            alembic upgrade head
            sudo supervisorctl restart farmazi
```

## 5. Monitoreo y Logs

### Configuración de Logs
```python
# backend/app/core/logging.py
import logging
from pythonjsonlogger import jsonlogger

def setup_logging():
    logHandler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter()
    logHandler.setFormatter(formatter)
    logger = logging.getLogger()
    logger.addHandler(logHandler)
    logger.setLevel(logging.INFO)
```

### Métricas con Prometheus
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## 6. Seguridad

### SSL/TLS con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d api.farmazi.com

# Auto-renovación
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall
```bash
# UFW básico
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 7. Escalamiento

### Load Balancer
```nginx
# /etc/nginx/nginx.conf
upstream farmazi_backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}

server {
    location / {
        proxy_pass http://farmazi_backend;
    }
}
```

### Auto Scaling con Docker
```dockerfile
# Dockerfile.backend
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes (Opcional)
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: farmazi-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: farmazi-backend
  template:
    metadata:
      labels:
        app: farmazi-backend
    spec:
      containers:
      - name: backend
        image: farmazi/backend:latest
        ports:
        - containerPort: 8000
```

## 8. Costos Estimados (AWS)

### Configuración Básica
- **EC2 t3.medium**: $30/mes
- **RDS db.t3.micro**: $15/mes
- **S3 Storage**: $5/mes
- **CloudFront CDN**: $10/mes
- **Total**: ~$60/mes

### Configuración Escalada
- **EC2 t3.large (2x)**: $120/mes
- **RDS db.t3.small**: $25/mes
- **ElastiCache Redis**: $15/mes
- **Load Balancer**: $20/mes
- **Total**: ~$180/mes