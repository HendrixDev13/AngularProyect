import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { ItemCarrito } from '../../interfaces/ItemCarrito';
import { forkJoin } from 'rxjs';
import { jsPDF } from 'jspdf';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('filtroInput') filtroInput!: ElementRef<HTMLInputElement>;

  productosFiltrados: Product[] = [];
  codigoBarrasInput = '';
  total = 0;
  error = '';
  carrito: ItemCarrito[] = [];
  numeroFactura = 5;
  fecha = new Date();
  horaActual = '';
  clientes = [{ id: 1, nombre: 'Cliente genérico' }];
  clienteSeleccionado = 1;
  productos: Product[] = [];
  productoSeleccionado?: Product;
  cantidadSeleccionada = 1;

  showPaymentModal = false;
  showSummaryModal = false;
  paidAmount = 0;
  changeAmount = 0;

  constructor(
    private productoService: ProductService,
    private ventaService: VentaService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
      const token = localStorage.getItem('token');
        if (!token) {
          this.router.navigate(['/login']);
          return;
        }
    this.ventaService.getSiguienteRecibo().subscribe({
    next: (n) => this.numeroFactura = n,
    error: () => {
      console.warn('No se pudo obtener número de recibo');
      this.numeroFactura = 1;
    }
  });


    this.cargarProductos();
    setInterval(() => this.horaActual = new Date().toLocaleTimeString(), 1000);
  }


  ngAfterViewInit(): void {
    this.barcodeInput.nativeElement.focus();
  }

  onBarcodeScanned(codigo: string) {
  const code = codigo.trim();
  if (!code) return;

  this.productoService.getByCodigoBarras(code).subscribe({
    next: (prod: Product) => {
      // 1️⃣ Buscar el objeto en productos[] que corresponde
      const idx = this.productos.findIndex(p => p.id_producto === prod.id_producto);
      if (idx >= 0) {
        // 2️⃣ Actualizar el inventario de ese producto
        this.productos[idx].inventario = prod.inventario;

        // 3️⃣ Seleccionarlo en el combo box
        this.productoSeleccionado = this.productos[idx];
      } else {
        // Si por alguna razón no está en productos[], selecciona el de la API
        this.productoSeleccionado = prod;
      }

      // 4️⃣ Agregar al carrito
      this.cantidadSeleccionada = 1;
      this.agregarAlCarrito();

      // 5️⃣ Limpiar errores y enfocar
      this.error = '';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 50);
    },
    error: () => {
      this.toastr.error('Producto no encontrado con ese código de barras', 'No encontrado');
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 50);
    }
  });
}


  cargarProductos(): void {
      this.productoService.getProducts().subscribe({
    next: data => {
      this.productos = data;
      this.productosFiltrados = data; // ← inicializa con todo
    },
    error: () => this.error = 'No se pudieron cargar los productos'
  });

  }


  filtrarProductos(termino: string): void {
    const texto = termino.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.ProductoNombre.toLowerCase().includes(texto) ||
      p.CodigoBarras?.toLowerCase().includes(texto)
    );

    // 🔄 Limpiar producto seleccionado
    this.productoSeleccionado = undefined;
  }



  buscarPorCodigo(): void {
  if (!this.codigoBarrasInput) return;

  this.productoService.getByCodigoBarras(this.codigoBarrasInput).subscribe({
    next: (producto: Product) => {
      const idx = this.productos.findIndex(p => p.id_producto === producto.id_producto);
      if (idx >= 0) {
        this.productos[idx].inventario = producto.inventario;
        this.productoSeleccionado = this.productos[idx];
      } else {
        this.productoSeleccionado = producto;
      }

      this.cantidadSeleccionada = 1;
      this.agregarAlCarrito();

      this.codigoBarrasInput = '';
      this.error = '';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    },
    error: () => {
      this.error = 'Producto no encontrado';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    }
  });
}



    agregarAlCarrito(): void {
  const producto = this.productoSeleccionado!;
  const cantidad = this.cantidadSeleccionada;

  if (cantidad <= 0) {
    this.toastr.error('La cantidad debe ser mayor a cero', 'Cantidad inválida');
    return;
  }
  if (!producto.inventario || producto.inventario.StockActual < cantidad) {
    this.toastr.warning('Producto sin stock o cantidad insuficiente', 'Stock');
    return;
  }

  // 🚀 NO se llama a descontarStock en la BD aquí → solo se descuenta "visual":
  producto.inventario!.StockActual -= cantidad;

  const item = this.carrito.find(i => i.id === producto.id_producto);
  if (item) {
    item.cantidad += this.cantidadSeleccionada;
    item.subtotal = item.cantidad * item.precio;
  } else {
    this.carrito.push({
      id: producto.id_producto,
      nombre: producto.ProductoNombre,
      precio: producto.PrecioVenta,
      cantidad: this.cantidadSeleccionada,
      subtotal: producto.PrecioVenta * this.cantidadSeleccionada
    });
  }

  this.calcularTotal();

  this.filtroInput.nativeElement.value = '';
  this.productosFiltrados = [...this.productos];
  setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
}



  eliminarDelCarrito(id: number): void {
  const item = this.carrito.find(i => i.id === id);
  if (!item) return;

  // ✅ Solo actualizar visualmente el stock (no tocar la BD)
  const producto = this.productos.find(p => p.id_producto === item.id);
  if (producto && producto.inventario) {
    producto.inventario.StockActual += item.cantidad;
  }

  // 🧹 Quitar del carrito y recalcular total
  this.carrito = this.carrito.filter(i => i.id !== id);
  this.calcularTotal();

  setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
}

  disminuirCantidad(id: number): void {
    const item = this.carrito.find(i => i.id === id);
    if (!item) return;

    const producto = this.productos.find(p => p.id_producto === item.id);
    if (producto && producto.inventario) {
      producto.inventario.StockActual += 1;
    }

    item.cantidad -= 1;
    item.subtotal = item.cantidad * item.precio;

    if (item.cantidad <= 0) {
      this.carrito = this.carrito.filter(i => i.id !== id);
    }

    this.calcularTotal();

    setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
  }



  limpiarCarrito(): void {
  const reponerLotes = this.carrito.map(item =>
    this.productoService.reponerStock(item.id, item.cantidad)
  );

  forkJoin(reponerLotes).subscribe({
    next: () => {
      // 🔄 Reponer stock visualmente para todos los productos del carrito
      this.carrito.forEach(item => {
        const producto = this.productos.find(p => p.id_producto === item.id);
        if (producto && producto.inventario) {
          producto.inventario.StockActual += item.cantidad;
        }
      });

      // 🧹 Limpiar el carrito y restablecer estado
      this.carrito = [];
      this.total = 0;
      this.productoSeleccionado = undefined;
      this.cantidadSeleccionada = 1;
      this.filtroInput.nativeElement.value = '';
      this.productosFiltrados = [...this.productos];

      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    },
    error: () => alert('Error al reponer uno o más productos')
  });
}


  calcularTotal(): void {
    this.total = this.carrito.reduce((sum, i) => sum + i.subtotal, 0);
  }

  openPaymentModal(): void {
      if (this.carrito.length === 0) {
      this.toastr.warning('El carrito está vacío. Agrega productos antes de pagar', 'Advertencia');
      return;
    }
    this.paidAmount = this.total;
    this.showPaymentModal = true;
  }

  confirmPayment(): void {
    if (this.paidAmount < this.total) {
      this.toastr.warning('El monto pagado no cubre el total', 'Pago insuficiente');
      return;
    }
    this.changeAmount = parseFloat((this.paidAmount - this.total).toFixed(2));
    this.showPaymentModal = false;
    this.showSummaryModal = true;
  }

    acceptSummary(): void {

  // ✅ Cerrar el modal de Resumen de Pago inmediatamente
  this.showSummaryModal = false;

  if (this.carrito.length === 0) {
    this.toastr.warning('El carrito está vacío. Agrega productos antes de vender.', 'Advertencia');
    return;
  }

  const ventaPayload = {
    usuario: this.obtenerIdUsuario()!,
    productos: this.carrito.map(i => ({
      id: i.id,
      cantidad: i.cantidad,
      precio: i.precio,
      subtotal: i.subtotal
    }))
  };

  const token = localStorage.getItem('token');

  if (!token) {
    this.toastr.error('Sesión inválida. Debes iniciar sesión nuevamente.', 'Sesión caducada');
    this.router.navigate(['/login']);
    return;
  }

  this.productoService.guardarVenta(ventaPayload).subscribe({
    next: () => {
      const idUsuario = this.obtenerIdUsuario();
      const nombreMes = this.fecha.toLocaleString('es-ES', { month: 'long' });
      const clave = `recibo-global`;

      this.numeroFactura++;
      localStorage.setItem(clave, this.numeroFactura.toString());

      Swal.fire({
        title: 'Procesando venta...',
        text: 'Por favor espera mientras se genera tu recibo',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();

          setTimeout(() => {
            // ✅ Primero generar el PDF
            this.generatePDF();

            // ✅ Luego mostrar éxito
            Swal.fire({
              title: '¡Venta realizada!',
              text: 'El recibo se ha descargado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              // ✅ Cerrar modal de pago
              this.showPaymentModal = false;

              // ✅ Limpiar
              this.carrito = [];
              this.productoSeleccionado = undefined;
              this.cantidadSeleccionada = 1;
              this.filtroInput.nativeElement.value = '';
              this.productosFiltrados = [...this.productos];
              this.total = 0;
              this.cargarProductos();

              setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
            });
          }, 2500);
        }

      });
    },
    error: (err) => {
      console.error('Error al guardar venta:', err);
      this.toastr.error('No se pudo conectar con el servidor. Intenta más tarde.', 'Error de conexión');

      // ✅ Cerrar ambos modales en caso de error
      this.showSummaryModal = false;
      this.showPaymentModal = false;

      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    }
  });
}




  logout(): void {
    localStorage.removeItem('usuario'); // Info del usuario
    localStorage.removeItem('token');   // JWT token
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }



  obtenerNombreUsuario(): string {
  const raw = localStorage.getItem('usuario');
  if (!raw) return '---';
  const u = JSON.parse(raw);
  return u?.nombre || '---';
}

  obtenerIdUsuario(): number | null {
  const raw = localStorage.getItem('usuario');
  if (!raw) return null;
  const u = JSON.parse(raw);
  return u?.id_usuario ?? null;
}


  actualizarInfoProducto(): void {
    console.log('Producto seleccionado:', this.productoSeleccionado);
    setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
  }

    generatePDF(): void {
  if (this.carrito.length === 0) {
    this.toastr.warning('No se puede generar un recibo vacío', 'Advertencia');
    return;
  }

  // 🚀 Formato ticket: ancho 80mm, alto 200mm (puedes ajustarlo)
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 200],
    orientation: 'portrait'
  });

  // Obtener mes en español
  const nombreUsuario = this.obtenerNombreUsuario().replace(/\s+/g, '_');
  const nombreMes = this.fecha.toLocaleString('es-ES', { month: 'long' });

  // Fecha y hora formateadas para nombre de archivo
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-ES').replace(/\//g, '-'); // 19-05-2025
  const horaStr = fecha.toLocaleTimeString('es-ES').replace(/:/g, '-');   // 22-42-15

  // Nombre único y descriptivo
  const nombreArchivo = `ticket-${nombreMes}-${this.numeroFactura}-${nombreUsuario}-${fechaStr}_${horaStr}.pdf`;

  // 🚀 Encabezado tipo ticket
  let y = 10;

  doc.setFontSize(12);
  doc.text('*** SISTEMA PUNTO DE VENTA ***', 40, y, { align: 'center' });
  y += 6;

  doc.setFontSize(9);
  doc.text(`Dirección: Salamá`, 10, y);
  y += 4;
  doc.text(`Email: honda@gmail.com`, 10, y);
  y += 4;
  doc.text(`Tel: +502 57896412`, 10, y);
  y += 4;
  doc.text(`Fecha: ${this.fecha.toLocaleDateString()} ${this.horaActual}`, 10, y);
  y += 4;
  doc.text(`Cajero: ${this.obtenerNombreUsuario()}`, 10, y);
  y += 6;

  doc.setFontSize(10);
  doc.text(`Recibo #${this.numeroFactura}`, 10, y);
  y += 6;

  doc.setLineWidth(0.5);
  doc.line(5, y, 75, y);
  y += 4;

  // 🚀 Tabla de productos
  doc.setFontSize(9);
  doc.text('Producto', 5, y);
  doc.text('Cant', 50, y);
  doc.text('Total', 65, y);
  y += 4;

  this.carrito.forEach(item => {
    doc.text(item.nombre.substring(0, 20), 5, y);
    doc.text(item.cantidad.toString(), 50, y);
    doc.text(`Q${item.subtotal.toFixed(2)}`, 65, y);
    y += 4;
  });

  y += 4;
  doc.line(5, y, 75, y);
  y += 6;

  // 🚀 Totales
  doc.setFontSize(10);
  doc.text(`Total: Q${this.total.toFixed(2)}`, 5, y);
  y += 5;
  doc.text(`Pagado: Q${this.paidAmount.toFixed(2)}`, 5, y);
  y += 5;
  doc.text(`Cambio: Q${this.changeAmount.toFixed(2)}`, 5, y);
  y += 8;

  // 🚀 Mensaje de agradecimiento
  doc.setFontSize(9);
  doc.text('¡Gracias por su compra!', 40, y, { align: 'center' });
  y += 4;
  doc.text('Conserve este ticket.', 40, y, { align: 'center' });
  y += 6;

  // 🚀 Footer
  doc.setFontSize(8);
  doc.text('Software Code © 2025', 40, y, { align: 'center' });
  y += 4;
  doc.text('www.ejemplo.com', 40, y, { align: 'center' });

  // 🚀 Guardar con nombre personalizado
  doc.save(nombreArchivo);
}





}
