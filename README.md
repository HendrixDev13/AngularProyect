---

title: "Sistema de Control de Inventario y Ventas – Honda Salamá"
author: "Equipo de Desarrollo"
date: "`r Sys.Date()`"
output: github\_document
------------------------

# Descripción

El **Sistema de Control de Inventario y Ventas** para la agencia **Honda Salamá** es una aplicación web pensada para gestionar de forma integral:

* Registro y venta de productos
* Control automático del stock
* Generación de reportes financieros y operativos
* Administración de cuentas de usuario

Mediante una interfaz ágil y responsiva, los usuarios con rol **Administrador** o **Vendedor** pueden optimizar tareas diarias de inventario y ventas, minimizando errores manuales y obteniendo información en tiempo real.

# Funcionamiento

1. **Inicio de Sesión**
   El usuario ingresa sus credenciales y, si son correctas, accede a su propio **Dashboard** según el rol asignado.

2. **Dashboard (Inicio)**
   Botones principales:

   * **Ventas**: ventana para buscar productos, agregar al carrito, calcular totales y confirmar venta.
   * **Inventario**: listado completo de productos, con opciones de agregar, editar, activar/inactivar y ver stock.
   * **Reportes**: menú con accesos a reportes tabulares y gráficos (ventas totales, ganancias, costos, inventario actual).
   * **Usuarios**: gestión de cuentas (crear, editar, habilitar/inhabilitar).

3. **Módulo de Ventas**

   * Búsqueda de producto por código de barras o nombre.
   * Selección de cantidad y cálculo dinámico de subtotal y total.
   * Al confirmar, se registra la venta en la BD, se actualiza el stock y se genera movimiento tipo “Salida - Venta”.

4. **Módulo de Inventario**

   * Listado de productos con columnas: Código de Barras, Nombre, Marca, Precios, Stock, Estado.
   * Formularios modales para **Agregar** y **Editar** productos (incluyen motivos de ajuste, precios y stock).
   * Opción para **Activar/Inactivar** productos, cambiando su visibilidad y permitiendo control de versiones de inventario.
   * Visualización del **Total en Inventario** (valor monetario calculado sobre stock × precio de costo).

5. **Módulo de Reportes**

   * **Reporte Ventas Totales**: tabla con ventas dentro de un rango de fechas, filtrado y exportación a Excel.
   * **Reporte Ganancias**: desglose de ganancias por producto y fecha (rango o mes), con exportación a Excel.
   * **Reporte Costo Total Inventario**: listado de inventario actual con cálculo de valor total por producto; exportable a Excel.
   * **Reporte Costo Total Ventas por Mes**: tabla mensual que muestra Ventas Totales, Costo Total y Ganancia.
   * **Gráfico Ventas por Mes**: gráfico de barras con totales de ventas mensuales.
   * **Gráfico Ganancias por Mes**: gráfico de barras con totales de ganancia mensual.
   * Cada reporte incluye botón “Mostrar/Ocultar Filtro” y “Exportar a Excel”; todos permiten regresar al menú de Reportes y al Dashboard.

6. **Módulo de Usuarios**

   * Listado de usuarios con **ID**, **Nombre**, **Rol**, **Estado** y **Acciones** (Editar, Inhabilitar/Habilitar).
   * Modal “Agregar Usuario” para crear cuentas nuevas (nombre, contraseña, rol).
   * Panel lateral “Editar Usuario” para cambiar nombre, rol y contraseña (opcional).
   * Resaltado visual de usuarios **Inactivos** (fila en color rosa).
   * Botones “Editar” y “Habilitar/Inhabilitar” que permiten controlar el acceso sin eliminar registros.

7. **Cerrar Sesión**

   * Botón disponible en cada módulo redirige a la pantalla de login y protege la información cerrando la sesión activa.

# Tecnologías y Herramientas

* **Backend**

  * **Node.js** (v14+ o v16+), **Express**
  * **MySQL** para la base de datos relacional
  * Controladores y rutas organizadas por recursos: `ventas`, `inventario`, `reportes`, `usuarios`
  * Comunicación con BD usando el driver oficial de MySQL y queries parametrizadas (evita inyecciones SQL)

* **Frontend**

  * **Angular** (v11+)
  * **Bootstrap 5** para estilos, componentes y diseño responsivo
  * Módulos organizados en carpetas:

    * `ventas/`, `inventario/`, `reportes/`, `usuarios/`
    * Componentes compartidos (`navbar`, modales, pipes, servicios HTTP)
  * Librerías adicionales:

    * **xlsx** + **file-saver** (exportar datos a Excel)
    * **ngx-bootstrap** o **ng-bootstrap** (selectores de fecha)
    * **ngx-toastr** (notificaciones emergentes)

* **Control de versiones y desarrollo**

  * **Git** como sistema de control de versiones
  * **VS Code** recomendado para editar y depurar el código
  * **Postman** (opcional) para probar manualmente endpoints HTTP en desarrollo

# Requerimientos del Equipo

Para ejecutar la aplicación en un entorno de desarrollo, el equipo deberá disponer de:

1. **Hardware Mínimo**

   * CPU: Quad-Core (recomendado)
   * Memoria RAM: 8 GB (mínimo 4 GB)
   * Almacenamiento: 1 GB libre para dependencias y logs

2. **Software Instalado**

   * **Node.js** (v14.x o v16.x) junto con **npm**
   * **Angular CLI**: `npm install -g @angular/cli`
   * **MySQL Server** (v5.7+ o 8.x)
   * **Git** (para clonar repositorios y control de versiones)
   * **Editor de código**: Visual Studio Code o equivalente
   * **Postman** o **Insomnia** (opcional) para pruebas de API

3. **Configuración de Base de Datos**

   * Crear base de datos (por ejemplo: `honda_salama_db`) en MySQL
   * Ejecutar los scripts SQL de creación de tablas y relaciones:

     * `usuarios`, `tbl_Producto`, `tbl_Inventario`, `tbl_Venta`, `tbl_DetalleVenta`, `tbl_MovimientosInventario`
   * Ajustar credenciales (usuario/contraseña) en la configuración del backend
   * Asegurarse de que las tablas coincidan con las consultas del código

4. **Variables de Entorno (Backend)**

   * `PORT` (p. ej., 3001)
   * `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   * `JWT_SECRET` (clave secreta para tokens JWT)

5. **Variables de Entorno (Frontend)**

   * Configuración del API URL en `environment.ts` (p. ej., `http://localhost:3001/api`)

# Estructura de Carpetas (Esencial)

```
/
├── backend/                # Servidor Node.js + Express
│   ├── controllers/        # Lógica de cada recurso (ventas, inventario, reportes, usuarios)
│   ├── database/           # Configuración de conexión a MySQL
│   ├── middlewares/        # Autenticación, validaciones, manejo de errores
│   ├── routes/             # Definición de rutas (/ventas, /inventario, /reportes, /usuarios)
│   ├── app.ts              # Configuración principal de Express
│   └── package.json
│
├── frontend/               # Aplicación Angular + Bootstrap
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/
│   │   │   │   ├── ventas/          # Componentes, servicios, modelos para ventas
│   │   │   │   ├── inventario/      # Componentes, servicios, modelos para inventario
│   │   │   │   ├── reportes/        # Componentes, servicios, modelos para reportes
│   │   │   │   └── usuarios/        # Componentes, servicios, modelos para usuarios
│   │   │   ├── shared/              # Modelos de datos (interfaces), pipes, directivas
│   │   │   ├── services/            # Servicios HTTP para consumo de la API
│   │   │   ├── app-routing.module.ts
│   │   │   └── app.component.ts
│   │   ├── assets/                  # Imágenes (logo Honda), hojas de estilo globales
│   │   └── index.html
│   ├── angular.json
│   └── package.json
│
└── README.Rmd              # Este documento (RMarkdown para GitHub)
```

# Funcionalidades Esenciales

1. **Autenticación**

   * Inicio de sesión con usuario y contraseña
   * Roles: **Administrador** y **Vendedor**
   * Protección de rutas según rol

2. **Inventario**

   * CRUD de productos (Agregar, Editar, Activar/Inactivar)
   * Control de stock en tiempo real
   * Historial de movimientos de inventario (entradas, salidas, correcciones)

3. **Ventas**

   * Selección de productos (búsqueda o escaneo)
   * Manejo de carrito de venta con subtotales y total
   * Registro de venta en tablas `tbl_Venta` y `tbl_DetalleVenta`
   * Actualización automática de stock
   * Generación de movimiento tipo “Salida - Venta” en `tbl_MovimientosInventario`

4. **Reportes**

   * Tablas de datos filtrables por rango de fechas o por mes
   * Exportación de cada reporte a archivo **Excel**
   * Gráficos de barras para análisis mensual de ventas y ganancias

5. **Usuarios**

   * Gestión de cuentas (Agregar, Editar, Habilitar/Inhabilitar)
   * Asignación de roles (Administrador / Vendedor)
   * Control de acceso y visibilidad de módulos según rol

6. **Navegación Consistente**

   * Botón **“Regresar a Inicio”** presente en cada módulo
   * Botón **“Cerrar sesión”** (esquina superior derecha o inferior en Dashboard)

---

Este README resume los aspectos fundamentales del proyecto: descripción, flujo de funcionamiento, tecnologías empleadas y requisitos mínimos para ejecutar la aplicación. Cualquier detalle adicional (scripts completos de SQL, estructura exacta de tablas, variables de entorno específicas) debe consultarse directamente en el código fuente de los archivos de configuración y en los comentarios incluidos en cada carpeta del repositorio.
