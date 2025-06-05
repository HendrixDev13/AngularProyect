export interface Product {
  id_producto: number;
  CodigoBarras: string;
  ProductoNombre: string;
  Modelo: string;
  Marca: string;
  Descripcion: string;
  Color: string;
  PrecioVenta: number;

  inventario?: {
    StockActual: number;
    PrecioVentaInicial: number;
    Descripcion: string;
  };

  StockActual?: number;     // para facilitar uso en HTML
  PrecioCosto?: number;
}
