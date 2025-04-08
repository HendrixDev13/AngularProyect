import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  listProduct: Product[] = [];
  loading: boolean = false;

  constructor(
    private _productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this._productService.getProducts().subscribe((data: Product[]) => {
      this.listProduct = data;
      console.log('Productos cargados', this.listProduct);
    });
  }


  logout() {
    this.loading = true;

    setTimeout(() => {
      localStorage.removeItem('token');
      location.href = '/login'; // Redirige al login
    }, 2000); // Simulamos "procesando" por 1.5s
  }

}
