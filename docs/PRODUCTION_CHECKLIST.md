# 📋 CHECKLIST DE PRODUCCIÓN - FarmaZi POS

## ✅ Pre-requisitos
- [ ] Dominio comprado en Route 53
- [ ] Cuenta AWS configurada
- [ ] AWS CLI instalado y configurado
- [ ] Node.js y npm instalados

## 🌐 Configuración de Dominio
- [ ] Dominio registrado: ________________
- [ ] Hosted Zone creada en Route 53
- [ ] Nameservers configurados

## 🪣 Configuración S3
- [ ] Bucket creado con nombre del dominio
- [ ] Bucket configurado como sitio web estático
- [ ] Política pública aplicada
- [ ] CORS configurado si es necesario

## 🔒 Certificado SSL
- [ ] Certificado solicitado en ACM
- [ ] Validación DNS completada
- [ ] Certificado emitido y activo

## ☁️ CloudFront
- [ ] Distribución creada
- [ ] Origen configurado (S3 bucket)
- [ ] Certificado SSL asociado
- [ ] Dominio personalizado configurado
- [ ] Comportamientos de caché configurados

## 📡 DNS (Route 53)
- [ ] Registro A creado (apunta a CloudFront)
- [ ] Registro CNAME para www creado
- [ ] TTL configurado apropiadamente

## 🚀 Despliegue
- [ ] Variables de entorno configuradas
- [ ] Build de producción exitoso
- [ ] Archivos subidos a S3
- [ ] Caché de CloudFront invalidado

## 🧪 Verificación
- [ ] Sitio accesible via HTTPS
- [ ] Redirección HTTP → HTTPS funciona
- [ ] www.dominio.com redirige a dominio.com
- [ ] Todas las funcionalidades operativas
- [ ] Performance optimizada
- [ ] SSL válido (A+ en SSL Labs)

## 📊 Monitoreo
- [ ] CloudWatch configurado
- [ ] Alertas de disponibilidad
- [ ] Logs de acceso habilitados
- [ ] Métricas de performance

## 🔧 Post-Despliegue
- [ ] DNS propagado globalmente
- [ ] Backup de configuración
- [ ] Documentación actualizada
- [ ] Cliente notificado

## 📞 Información de Contacto
- **Dominio**: ________________
- **CloudFront ID**: ________________
- **Bucket S3**: ________________
- **Certificado ARN**: ________________

## 🚨 Rollback Plan
En caso de problemas:
1. Revertir archivos en S3
2. Invalidar caché CloudFront
3. Verificar DNS
4. Contactar soporte AWS si es necesario

---
**Fecha de despliegue**: ________________
**Responsable**: ________________
**Estado**: ⏳ En progreso / ✅ Completado / ❌ Fallido