import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { ItemCarrito } from '../../interfaces/ItemCarrito';
import { forkJoin } from 'rxjs';
import { jsPDF } from 'jspdf';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
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
  // 1) Llámalo aunque esté oculto
  const code = codigo.trim();
  if (!code) return;

  // 2) Llama al servicio para traer el producto completo
  this.productoService.getByCodigoBarras(code).subscribe({
    next: (prod: Product) => {
      // 3) Selecciónalo en el dropdown
      this.productoSeleccionado = prod;

      // 4) Asigna cantidad 1 y añade al carrito
      this.cantidadSeleccionada = 1;
      this.agregarAlCarrito();

      // 5) Limpia posibles errores y vuelve a enfocar
      this.error = '';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 50);
    },
    error: () => {
      this.error = 'Código no encontrado';
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
        if (idx < 0) {
          this.error = 'Producto no está en el listado';
          return;
        }
        this.productoSeleccionado = this.productos[idx];
        this.productos[idx].inventario = producto.inventario;
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

    if (!producto.inventario || producto.inventario.StockActual < cantidad) {
      this.error = 'Stock insuficiente';
      return;
    }

    this.productoService.descontarStock(producto.id_producto, cantidad).subscribe({
          next: () => {
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
      this.error = '';

      // ✅ Aquí limpias el input y restauras la lista
      this.filtroInput.nativeElement.value = '';
      this.productosFiltrados = [...this.productos];

      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    },
      error: () => {
        this.error = 'Stock insuficiente';
        setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
      }
    });
  }

  eliminarDelCarrito(id: number): void {
  const item = this.carrito.find(i => i.id === id);
  if (!item) return;

  this.productoService.reponerStock(item.id, item.cantidad).subscribe({
    next: () => {
      // 🔄 Reponer stock visualmente
      const producto = this.productos.find(p => p.id_producto === item.id);
      if (producto && producto.inventario) {
        producto.inventario.StockActual += item.cantidad;
      }

      // 🧹 Quitar del carrito y recalcular total
      this.carrito = this.carrito.filter(i => i.id !== id);
      this.calcularTotal();

      setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
    },
    error: () => alert('Error al reponer stock')
  });
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
    this.paidAmount = this.total;
    this.showPaymentModal = true;
  }

  confirmPayment(): void {
    if (this.paidAmount < this.total) {
      alert('El monto pagado debe ser ≥ total');
      return;
    }
    this.changeAmount = parseFloat((this.paidAmount - this.total).toFixed(2));
    this.showPaymentModal = false;
    this.showSummaryModal = true;
  }

  acceptSummary(): void {
    const ventaPayload = {
      usuario: this.obtenerIdUsuario()!,
      productos: this.carrito.map(i => ({
        id: i.id,
        cantidad: i.cantidad,
        precio: i.precio,
        subtotal: i.subtotal
      }))
    };

    this.productoService.guardarVenta(ventaPayload).subscribe({
      next: () => {
        const idUsuario = this.obtenerIdUsuario();
        const nombreMes = this.fecha.toLocaleString('es-ES', { month: 'long' });
        const clave = `recibo-global`;

        // 🟢 Primero aumenta el número
        this.numeroFactura++;
        localStorage.setItem(clave, this.numeroFactura.toString());

        // ✅ Luego genera el PDF con el nuevo número
        this.generatePDF();

        this.carrito = [];
        this.total = 0;
        this.cargarProductos();
        this.showSummaryModal = false;
        setTimeout(() => this.barcodeInput.nativeElement.focus(), 100);
      },
      error: () => alert('❌ Error al guardar venta')
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
  const doc = new jsPDF();

  // Obtener mes en español
const nombreUsuario = this.obtenerNombreUsuario().replace(/\s+/g, '_');
const nombreMes = this.fecha.toLocaleString('es-ES', { month: 'long' });

// Fecha y hora formateadas para nombre de archivo
const fecha = new Date();
const fechaStr = fecha.toLocaleDateString('es-ES').replace(/\//g, '-'); // 19-05-2025
const horaStr = fecha.toLocaleTimeString('es-ES').replace(/:/g, '-');   // 22-42-15

// Nombre único y descriptivo
const nombreArchivo = `recibo-${nombreMes}-${this.numeroFactura}-${nombreUsuario}-${fechaStr}_${horaStr}.pdf`;


  // Encabezado
  doc.setFontSize(16);
  doc.text('SISTEMA PUNTO DE VENTA', 70, 15);
  doc.setFontSize(10);
  doc.text('Dirección: Salamá', 10, 25);
  doc.text('Email: honda@gmail.com', 10, 30);
  doc.text('Tel: +502 57896412', 160, 25);
  doc.text('www.ejemplo.com', 160, 30);

  // Línea horizontal
  doc.line(10, 35, 200, 35);

  // Datos del recibo
  doc.setFontSize(12);
  doc.text(`RECIBO DE VENTA`, 10, 45);
  doc.setFontSize(10);
  doc.text(`Número de Recibo: ${this.numeroFactura}`, 10, 50);
  doc.text(`Cliente: Cliente genérico`, 10, 55);
  doc.text(`Fecha: ${this.fecha.toLocaleDateString()} ${this.horaActual}`, 140, 50);
  doc.text(`Cajero: ${this.obtenerNombreUsuario()}`, 140, 55);


  doc.line(10, 65, 200, 65);
  // Tabla de productos
  let y = 70;
  doc.text('Descripción', 10, y);
  doc.text('Cant.', 80, y);
  doc.text('Precio', 110, y);
  doc.text('Total', 160, y);
  y += 5;

  this.carrito.forEach(item => {
    doc.text(item.nombre, 10, y);
    doc.text(item.cantidad.toString(), 80, y);
    doc.text(`Q ${item.precio.toFixed(2)}`, 110, y);
    doc.text(`Q ${item.subtotal.toFixed(2)}`, 160, y);
    y += 5;
  });

  y += 5;
  doc.line(10, y, 200, y);
  y += 7;

  // Totales
  doc.text(`Total a Pagar: Q ${this.total.toFixed(2)}`, 10, y);
  doc.text(`Cantidad pagada: Q ${this.paidAmount.toFixed(2)}`, 80, y);
  doc.text(`Cambio: Q ${this.changeAmount.toFixed(2)}`, 160, y);
  y += 10;

  // Mensaje de agradecimiento
  doc.text('¡Gracias por tu compra, vuelve pronto!', 10, y);
  y += 5;

  // Términos y condiciones
  doc.setFont('helvetica', 'bold');
  doc.text('Términos y Condiciones:', 10, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  doc.text('1. Los productos comprados no tienen devolución.', 10, y);
  y += 5;
  doc.text('2. Conserve este recibo como comprobante de su compra.', 10, y);
  y += 5;
  doc.text('3. Para más información, visite nuestro sitio web o contacte a servicio al cliente.', 10, y);

  y += 10;
  doc.text('Software Code © 2025', 10, y);
  doc.text('www.ejemplo.com', 160, y);

  // Guardar con nombre personalizado
  doc.save(nombreArchivo);
}




}
