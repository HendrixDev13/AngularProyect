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
      next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario', JSON.stringify({
      id_usuario: res.id_usuario,
      nombre: res.nombre,
      rol: res.rol
    }));
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
     error: (err) => {
  this.loading = false; // ✅ Detener spinner SIEMPRE

  if (err.status === 403) {
    this.toastr.error(err.error.msg); // Cuenta inactiva
  } else {
    this.toastr.error('Usuario o contraseña incorrectos');
  }
}



    });
  }




}
