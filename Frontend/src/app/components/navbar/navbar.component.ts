import { Component, OnInit } from '@angular/core';
import router from '../../../../../Backend/src/routes/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic here
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirije a la página de inicio de sesión
    /*window.location.reload();*/ // Reload the page to reflect the changes
  }

}
