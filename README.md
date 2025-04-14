
# DataVista - Visualizador de Datos NocoDB

DataVista es una aplicación web moderna, responsive y fácil de usar diseñada para visualizar datos desde [NocoDB](https://www.nocodb.com/). Ofrece una interfaz intuitiva para explorar, filtrar y exportar datos de tus tablas de NocoDB.

## Características

- **Diseño Responsive**: Adaptado para dispositivos móviles, tablets y escritorio
- **Visualización Flexible**: Vista de tabla o tarjetas según el dispositivo
- **Paginación**: Navegación eficiente para grandes conjuntos de datos
- **Búsqueda**: Filtra los registros rápidamente
- **Detalles de Registros**: Visualiza información completa en ventanas modales
- **Exportación**: Descarga registros en formato CSV

## Requisitos

- Servidor Apache con PHP 7.4 o superior
- Cuenta de NocoDB con acceso a API
- Token de API de NocoDB

## Instalación

1. Clona este repositorio en tu servidor Apache
2. Configura el token API en el archivo `public/api/data.php`
3. Asegúrate de que el directorio `public` sea accesible desde tu servidor web
4. Abre la página en tu navegador

## Configuración del API

Para conectar la aplicación a tu API de NocoDB:

1. Edita el archivo `public/api/data.php`
2. Reemplaza `AQUI_TU_TOKEN_API` con tu token de API de NocoDB
3. Si es necesario, actualiza las URLs y los IDs de tabla/vista

```php
// Ejemplo de configuración
$API_TOKEN = "tu_token_aqui";
$api_url = "https://tu-instancia-nocodb.com/api/v2/tables/tu_id_tabla/records";
$viewId = "tu_id_vista";
```

## Personalización

DataVista puede adaptarse fácilmente a tus necesidades específicas:

- Modifica los colores y estilos en `tailwind.config.ts`
- Añade o quita columnas en el componente `DataTable.tsx`
- Personaliza el formato de visualización en `DataCard.tsx`

## Mejores Prácticas de Seguridad

- El token API nunca debe ser expuesto en el frontend
- El archivo `data.php` actúa como un proxy seguro
- Considera implementar autenticación para la aplicación web
- Limita los permisos del token API a solo lectura si es posible

## Soporte

Si encuentras algún problema o tienes sugerencias, por favor crea un issue en este repositorio.
