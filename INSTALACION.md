
# Guía de Instalación de DataVista

Esta guía te ayudará a instalar y configurar DataVista en tu servidor Apache. Sigue estos pasos cuidadosamente para asegurar un funcionamiento correcto.

## Requisitos Previos

- Servidor Apache 2.4 o superior
- PHP 7.4 o superior
- Módulos PHP: curl, json
- Cuenta en NocoDB con acceso a API
- Token API de NocoDB

## Instalación en Servidor Apache

### 1. Preparar el Directorio

```bash
# Crea un directorio para la aplicación en tu servidor web
mkdir /var/www/html/datavista
# Establece los permisos adecuados
chmod 755 /var/www/html/datavista
```

### 2. Transferir Archivos

Copia todos los archivos de la aplicación al directorio creado. Puedes usar FTP, SCP o cualquier otro método de transferencia:

```bash
# Ejemplo con SCP
scp -r * usuario@tu-servidor:/var/www/html/datavista/
```

### 3. Configurar el Archivo PHP API

Edita el archivo `public/api/data.php` con tu editor preferido:

```bash
nano /var/www/html/datavista/public/api/data.php
```

Reemplaza `AQUI_TU_TOKEN_API` con tu token de API de NocoDB:

```php
$API_TOKEN = "tu_token_aqui";
```

### 4. Configurar el Host Virtual (Opcional)

Para servir DataVista desde su propio dominio, configura un host virtual en Apache:

```
<VirtualHost *:80>
    ServerName datavista.tudominio.com
    DocumentRoot /var/www/html/datavista
    
    <Directory /var/www/html/datavista>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/datavista_error.log
    CustomLog ${APACHE_LOG_DIR}/datavista_access.log combined
</VirtualHost>
```

Guarda el archivo en `/etc/apache2/sites-available/datavista.conf` y actívalo:

```bash
a2ensite datavista.conf
systemctl reload apache2
```

### 5. Verificar Permisos

Asegúrate de que Apache pueda acceder y ejecutar los archivos:

```bash
# Ajustar propiedad si es necesario
chown -R www-data:www-data /var/www/html/datavista
```

## Configuración Específica de NocoDB

### 1. Obtener Token API

1. Accede a tu panel de NocoDB
2. Ve a tu perfil (esquina superior derecha)
3. Selecciona "Tokens API"
4. Crea un nuevo token (preferiblemente con permisos de solo lectura)
5. Copia el token generado

### 2. Identificar IDs de Tabla y Vista

Para personalizar completamente la integración, necesitarás:

1. ID de la tabla: está en la URL cuando accedes a la tabla
2. ID de la vista: está en la URL cuando seleccionas una vista específica

Ejemplo de URL de NocoDB:
```
https://n8n-nocodb.ejemplo.com/dashboard/#/nc/base/123456abcdef/table/tbl_mi_tabla/view/vw_mi_vista
```

En este ejemplo:
- ID de tabla: `tbl_mi_tabla`
- ID de vista: `vw_mi_vista`

### 3. Actualizar Configuración en data.php

Edita `public/api/data.php` y actualiza las siguientes líneas:

```php
// Construir la URL de la API con los parámetros
$api_url = "https://tu-instancia-nocodb.com/api/v2/tables/tu_id_tabla/records";
$viewId = "tu_id_vista"; // ID de vista de la API
```

## Solución de Problemas

### Errores Comunes

1. **Error 500 al cargar datos**
   - Verifica que el token API sea válido
   - Comprueba los permisos del archivo data.php
   - Revisa los logs de error de Apache

2. **No se muestran datos**
   - Confirma que la API devuelve resultados (prueba directamente con curl)
   - Verifica IDs de tabla y vista
   - Comprueba la consola del navegador para errores JavaScript

3. **Error de CORS**
   - Asegúrate de que los encabezados CORS estén correctamente configurados en data.php
   - O ejecuta la aplicación web desde el mismo dominio que la API

## Personalización Avanzada

### Modificar la Estructura de la Tabla

Si tu tabla de NocoDB tiene una estructura diferente, puedes personalizar los componentes:

1. Edita `src/components/DataTable.tsx` para ajustar las columnas
2. Modifica `src/components/DataCard.tsx` para cambiar la visualización de tarjetas
3. Actualiza `src/components/RecordModal.tsx` para ajustar la ventana de detalles

### Personalizar el Diseño

Para cambiar los colores, fuentes y estilos:

1. Edita `tailwind.config.ts` para modificar la paleta de colores
2. Actualiza los componentes individuales según sea necesario

## Mantener la Aplicación Actualizada

Para recibir actualizaciones y mejoras:

1. Haz una copia de seguridad de tus archivos personalizados
2. Actualiza el repositorio con `git pull`
3. Vuelve a aplicar tus personalizaciones
