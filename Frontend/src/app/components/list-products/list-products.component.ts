import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {
  @ViewChild('codigoInput') codigoInput!: ElementRef<HTMLInputElement>;

  productos: any[] = [];
  fechaHoy: Date = new Date();
  horaActual: string = '';
  totalInventario: number = 0;
  busquedaFallida: boolean = false;
  idProductoAEliminar: number | null = null;
  ultimoProductoId: number | null = null;
  pin: string = '';
  productoSeleccionadoId: number | null = null;
  movimientos: any[] = [];

    nuevoProducto = {
    producto: {
    CodigoBarras: '',
    ProductoNombre: '',
    Modelo: '',
    Marca: '',
    Descripcion: '',
    Color: '',
    PrecioVenta: 0,
    PrecioCosto: 0  // ✅ Añadir esta línea
  },


    inventario: {
      StockActual: 0,
      FechaIngreso: new Date().toISOString().split('T')[0],
      Descripcion: '',
      PrecioTotal: 0,
    }
  };

  productoEditando: {
    id_producto: number;
    producto: {
      CodigoBarras: string;
      ProductoNombre: string;
      Modelo: string;
      Marca: string;
      Descripcion: string;
      Color: string;
      PrecioVenta: number;
    PrecioCosto: number;
    };
    inventario: {
      StockActual: number;
      Descripcion: string;
    };
    MotivoMovimiento: string;
  } | null = null;



  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.actualizarHora();
    setInterval(() => this.actualizarHora(), 1000);
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.codigoInput.nativeElement.focus(), 500);
  }

  actualizarHora(): void {
    const ahora = new Date();
    this.horaActual = ahora.toLocaleTimeString('es-ES');
  }

  cargarProductos(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data
        .filter(p => p.ProductoNombre && p.PrecioVenta !== null)
        .map(p => {
          const stock = p.inventario?.StockActual ?? 0;
          const descripcion = p.inventario?.Descripcion ?? p.Descripcion ?? 'Sin descripción';

          return {
            ...p,
            StockActual: stock,
            Descripcion: descripcion
            // 👈 ya no machacamos PrecioCosto
          };
        });


        this.calcularTotal();
      },
      error: () => this.toastr.error('Error al cargar productos')
    });
  }



  calcularTotal(): void {
    this.totalInventario = this.productos.reduce((total, p) => {
      const stock = p.StockActual ?? 0;
      const costo = p.PrecioCosto ?? 0;
      return total + (stock * costo);
    }, 0);
  }

  buscarProductoManual(): void {
    const codigo = this.codigoInput.nativeElement.value;
    if (!codigo.trim()) return;
    this.buscarProducto(codigo);
    this.codigoInput.nativeElement.value = '';
    setTimeout(() => this.codigoInput.nativeElement.focus(), 100);
  }

  enfocarCampo(): void {
    if (this.codigoInput && this.codigoInput.nativeElement) {
      this.codigoInput.nativeElement.focus();
    }
  }

  buscarProducto(codigo: string): void {
    this.productService.getByCodigoBarras(codigo).subscribe({
      next: (producto) => {
        this.busquedaFallida = false;
        const yaExiste = this.productos.find(p => p.id_producto === producto.id_producto);
        if (!yaExiste) {
          producto.StockActual = producto.StockActual || 1;
          producto.PrecioCosto = producto.PrecioCosto || producto.PrecioVenta || 0;
          producto.Descripcion = producto.Descripcion || 'Sin descripción';
          this.productos.push(producto);
          this.calcularTotal();
        }
      },
      error: () => {
        this.busquedaFallida = true;
        this.toastr.warning('Producto no encontrado');
      }
    });
  }

  registrarProducto(): void {
    const p = this.nuevoProducto.producto;
    const inv = this.nuevoProducto.inventario;
    console.log('📦 Producto a registrar:', p);
    console.log('📦 Inventario:', inv);

    if (
      !p.CodigoBarras.trim() ||
      !p.ProductoNombre.trim() ||
      !p.Modelo.trim() ||
      !p.Marca.trim() ||
      !p.Color.trim() ||
      p.PrecioVenta <= 0 ||
      p.PrecioCosto <= 0 ||
      inv.StockActual <= 0
    ) {
      this.toastr.warning('⚠️ Por favor, complete todos los campos obligatorios.');
      return;
    }

    const ahora = new Date();
    inv.FechaIngreso = ahora.toISOString().split('T')[0];
    inv.PrecioTotal = inv.StockActual * p.PrecioCosto;

    this.productService.registrarProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.toastr.success('✅ Producto registrado correctamente');
        this.resetearFormulario();
        this.cargarProductos();
      },
      error: () => this.toastr.error('❌ Error al registrar el producto')
    });
  }

  abrirModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
  }

  abrirModalEliminar(id: number): void {
    this.productoSeleccionadoId = id;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalPin'));
    modal.show();
  }

  confirmarPin(): void {
    if (!this.pin || this.pin.length !== 4) {
      this.toastr.warning('Debe ingresar un PIN válido de 4 dígitos');
      return;
    }

    this.productService.eliminarProductoConPin(this.productoSeleccionadoId!, this.pin).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado exitosamente');
        this.productos = this.productos.filter(p => p.id_producto !== this.productoSeleccionadoId);
        this.productoSeleccionadoId = null;
        this.pin = '';
        this.calcularTotal();
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalPin'));
        modal.hide();
      },
      error: (err) => {
        this.toastr.error(err.error?.error || err.error?.msg || 'Error al eliminar el producto');
      }
    });
  }

  resetearFormulario(): void {
    this.nuevoProducto = {
      producto: {
        CodigoBarras: '',
        ProductoNombre: '',
        Modelo: '',
        Marca: '',
        Descripcion: '',
        Color: '',
        PrecioVenta: 0,
        PrecioCosto: 0
      },
      inventario: {
        StockActual: 0,
        FechaIngreso: new Date().toISOString().split('T')[0],
        Descripcion: '',
        PrecioTotal: 0,
      }
    };
  }

  abrirModalEditar(producto: any): void {
    this.productoEditando = {
      id_producto: producto.id_producto,
      producto: {
        CodigoBarras: producto.CodigoBarras,
        ProductoNombre: producto.ProductoNombre,
        Modelo: producto.Modelo,
        Marca: producto.Marca,
        Descripcion: producto.Descripcion,
        Color: producto.Color,
        PrecioVenta: producto.PrecioVenta,
        PrecioCosto: producto.PrecioCosto
      },
      inventario: {
        StockActual: producto.StockActual,
        Descripcion: producto.Descripcion,
      },
      MotivoMovimiento: ''
    };

    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalEditarProducto'));
    modal.show();
  }


  guardarEdicion(): void {
    if (!this.productoEditando) return;

    const { id_producto, producto, inventario, MotivoMovimiento } = this.productoEditando;

    this.productService.actualizarProducto(id_producto, {
      producto,
      inventario,
      motivo: this.productoEditando.MotivoMovimiento
    }).subscribe({
      next: () => {
        this.toastr.success('Producto actualizado correctamente');
        this.productoEditando = null;
        this.cargarProductos();

        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto'));
        modal.hide();
      },
      error: () => {
        this.toastr.error('Error al actualizar el producto');
      }
    });
  }


  verMovimientos(id_producto: number): void {
    this.productService.getMovimientosPorProducto(id_producto).subscribe({
      next: (data) => {
        this.movimientos = data;
        const modal = new (window as any).bootstrap.Modal(document.getElementById('modalMovimientos'));
        modal.show();
      },
      error: () => {
        this.toastr.error('Error al cargar movimientos');
      }
    });
  }



}
