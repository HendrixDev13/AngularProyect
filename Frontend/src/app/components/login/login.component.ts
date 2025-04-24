import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
username: string = '';
password: string = '';
loading: boolean = false;

showPassword: boolean = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

  constructor(private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorService: ErrorService
  ){}

  ngOnInit(): void {
    // Initialization logic here
  }

  login() {
    if (this.username === '' || this.password === '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    this.loading = true;

    const user: LoginUser = {
      nombre: this.username,
      password: this.password
    };

    this._userService.login(user).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        // Esperamos 1.5 segundos para que el spinner se note antes de navegar
        setTimeout(() => {
          /*this.router.navigate(['/dashboard']);*/
          this.router.navigate(['/inventario']);
          this.loading = false;
        }, 2000); // Puedes cambiar a 2000 (2 segundos) si quieres más tiempo
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    });
  }



}
