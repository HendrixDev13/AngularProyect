# 🎛️ Sistema de Control de Inventario y Ventas – Honda Salamá

Una aplicación web para gestionar de forma integral:

* 📦 Registro y venta de productos
* 📊 Control automático de stock
* 📈 Generación de reportes financieros y operativos
* 👤 Administración de cuentas de usuario

---

## 🎯 Funcionalidades principales

* 🛒 **Ventas**

  * Búsqueda de producto por código de barras o nombre
  * Selección de cantidad y cálculo dinámico de subtotal y total
  * Registro automático en la base de datos y actualización de stock
  * Generación de movimiento de inventario tipo “Salida – Venta”

* 📦 **Inventario**

  * Listado completo de productos (Código de Barras, Nombre, Marca, Precios, Stock, Estado)
  * Formulario modal “Agregar producto” con inventario inicial
  * Formulario modal “Editar producto” (precios, stock, motivo de ajuste)
  * Botón “Activar/Inactivar” para cambiar el estado de un producto
  * Visualización del **Total en Inventario** (valor monetario calculado: Stock × Precio Costo)

* 📊 **Reportes**

  * **Reporte Ventas Totales**: tabla filtrable por rango de fechas y exportable a Excel
  * **Reporte Ganancias por Producto**: desglose de ganancias (rango de fechas o filtro por mes) y exportable a Excel
  * **Reporte Costo Total Inventario**: listado en tiempo real del inventario actual con valor total por producto, exportable a Excel
  * **Reporte Costo Total Ventas por Mes**: resumen mensual de Ventas Totales, Costo Total y Ganancia
  * **Gráfico Ventas por Mes**: gráfico de barras que muestra el total de ventas mensuales
  * **Gráfico Ganancias por Mes**: gráfico de barras que muestra el total de ganancias mensuales
  * Botón “Mostrar / Ocultar Filtro” en todos los reportes
  * Botón “Exportar a Excel” disponible en cada reporte

* 👥 **Usuarios**

  * Listado de usuarios con columnas: ID, Nombre, Rol (Administrador/Vendedor), Estado (Activo/Inactivo), Acciones
  * Modal “Agregar Usuario” (ingreso de Nombre, Contraseña, Rol)
  * Panel lateral “Editar Usuario” (modificación de Nombre, Rol y/o Contraseña nueva)
  * Botón “Inhabilitar” / “Habilitar” para cambiar el estado sin eliminar el registro
  * Resaltado visual de usuarios **Inactivos** (fila en color rosa)

* 🔒 **Autenticación y Navegación**

  * Pantalla de **Inicio de Sesión** (Usuario + Contraseña)
  * Roles: **Administrador** (acceso completo) y **Vendedor** (acceso restringido a ventas e inventario)
  * Botón **“Cerrar sesión”** siempre disponible (parte superior o inferior según módulo)
  * Botón **“Regresar a Inicio”** en cada módulo para volver al Dashboard principal

---

## 🚀 Tecnologías usadas

* **Backend**

  * Node.js (v14+ o v16+)
  * Express (v4+)
  * **SQL Server** (SQL Server 2017 o superior)
  * Conexión a BD con driver oficial de Microsoft (`mssql`)
  * Autenticación mediante JWT o middleware de sesión

* **Frontend**

  * Angular (v11+)
  * Bootstrap 5
  * Librerías adicionales:

    * **xlsx** + **file-saver** (exportar a Excel)
    * **ngx-bootstrap**/**ng-bootstrap** (selectores de fecha)
    * **ngx-toastr** (notificaciones emergentes)

* **Herramientas de desarrollo**

  * Git (control de versiones)
  * Visual Studio Code (IDE recomendado)
  * Postman / Insomnia (pruebas de API en desarrollo)

---

## 💾 Requisitos mínimos del sistema

Para ejecutar la aplicación en un entorno de desarrollo local, se recomienda disponer de:

* ✅ **Sistema operativo**: Windows 10/11, macOS Mojave (10.14+) o Linux (Ubuntu 20.04+)
* ✅ **Memoria RAM**: mínimo 4 GB (recomendado 8 GB)
* ✅ **Espacio en disco**: al menos 1 GB libre para dependencias y logs
* ✅ **Navegador recomendado**: Google Chrome (última versión)
* ✅ **SQL Server** instalado y en ejecución (versión 2017 o superior)
* ✅ **Node.js** (v14.x o v16.x) y **npm** instalado
* ✅ **Angular CLI** (`npm install -g @angular/cli`)
* ✅ **SQL Server Management Studio** o equivalente (opcional, para administración de BD)

---

*Este README reúne lo esencial del proyecto: descripción general, funcionalidades, tecnologías empleadas y requisitos mínimos para ejecutarlo con SQL Server. Para detalles profundos (scripts SQL completos, configuraciones exactas y modelos de datos), consulte los archivos de configuración dentro de cada carpeta del repositorio.*
