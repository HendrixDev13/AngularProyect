import { Component, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-usuarios',
  standalone: true, // << si lo estás usando como standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  isSaving = false;
  cargandoEstado: Record<number, boolean> = {};
  nuevoUsuario = { nombre: '', password: '', id_rol: 2 };
  usuarioEditando: any = null;

  constructor(private userSrv: UserService, private toastr: ToastrService,
    private router: Router, private cdr: ChangeDetectorRef,private ngZone: NgZone ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userSrv.getUsuarios().subscribe({
      next: data => {
        this.usuarios = (data ?? []).filter(u => !!u);
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: err => {
        this.toastr.error('Error al cargar usuarios');
        console.error(err);
      }
    });
  }

  private cambiarEstado(id: number, accion: 'inhabilitar' | 'habilitar'): void {
    this.cargandoEstado[id] = true;
    const peticion = accion === 'inhabilitar'
      ? this.userSrv.inhabilitarUsuario(id)
      : this.userSrv.habilitarUsuario(id);

    peticion.subscribe({
      next: () => {
        this.toastr.success(`${accion === 'inhabilitar' ? 'Inhabilitado' : 'Habilitado'}`);
        this.cargarUsuarios();
        this.cargandoEstado[id] = false;
      },
      error: () => {
        this.toastr.error('Error en la operación');
        this.cargandoEstado[id] = false;
      }
    });
  }

  inhabilitarUsuario(id: number): void {
    this.cambiarEstado(id, 'inhabilitar');
  }

  habilitarUsuario(id: number): void {
    this.cambiarEstado(id, 'habilitar');
  }

  registrarUsuario(): void {
    if (!this.nuevoUsuario.nombre.trim() || !this.nuevoUsuario.password.trim()) {
      this.toastr.warning('Todos los campos son obligatorios');
      return;
    }

    this.isSaving = true;             // ← antes: this.cargando = true

    this.userSrv.registrarUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.toastr.success('Usuario creado');
        this.cargarUsuarios();
        this.nuevoUsuario = { nombre: '', password: '', id_rol: 2 };
        this.isSaving = false;        // ← antes: this.cargando = false
        const modal = (window as any)
          .bootstrap.Modal.getInstance(document.getElementById('modalNuevoUsuario'));
        modal?.hide();
      },
      error: err => {
        console.error(err);
        this.toastr.error('Error al registrar');
        this.isSaving = false;        // ← antes: this.cargando = false
      }
    });
  }


abrirModalEditar(usuario: any): void {
  this.usuarioEditando = { ...usuario };
  // 1) Obtén el elemento offcanvas
  const offcanvasEl = document.getElementById('offcanvasEditarUsuario');
  if (!offcanvasEl) return;

  // 2) Inicializa y muestra el offcanvas
  const bsOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvasEl);
  bsOffcanvas.show();
}


  guardarEdicion(): void {
  if (!this.usuarioEditando.Nombre.trim()) {
    this.toastr.warning('El nombre no puede estar vacío');
    return;
  }

  const datosActualizados: any = {
    Nombre: this.usuarioEditando.Nombre,
    id_rol: this.usuarioEditando.id_rol
  };
  if (this.usuarioEditando.password?.trim()) {
    datosActualizados.Password = this.usuarioEditando.password;
  }

  this.userSrv.actualizarUsuario(this.usuarioEditando.id_usuario, datosActualizados)
    .subscribe({
      next: () => {
        this.toastr.success('Usuario actualizado');
        this.cargarUsuarios();

        // —————————————————————————————
        // 1) Ocultar el offcanvas
        const offcanvasEl = document.getElementById('offcanvasEditarUsuario');
        if (offcanvasEl) {
          // Obtén (o crea) la instancia de Offcanvas
          const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(offcanvasEl)
                            || new (window as any).bootstrap.Offcanvas(offcanvasEl);
          bsOffcanvas.hide();
        }

        // 2) (Opcional) Asegurar que el backdrop se elimine
        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) { backdrop.remove(); }
        // —————————————————————————————

      },
      error: err => {
        console.error(err);
        this.toastr.error('Error al actualizar');
      }
    });
}




 ngAfterViewInit(): void {
    const modalEl = document.getElementById('modalNuevoUsuario');
    if (!modalEl) return;

    // Usamos shown.bs.modal para resetear justo después de abierto
    modalEl.addEventListener('shown.bs.modal', () => {
      this.ngZone.run(() => {
        this.nuevoUsuario = { nombre: '', password: '', id_rol: 2 };
        this.isSaving = false;
        this.cdr.detectChanges();
      });
    });

    // Limpieza al cerrar (por si acaso)
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.nuevoUsuario = { nombre: '', password: '', id_rol: 2 };
      this.isSaving = false;
    });
  }



cerrarSesion() {
  localStorage.clear(); // o elimina solo el token si usas auth
  this.router.navigate(['/login']);
}

cargandoDashboard = false;

irAlDashboard() {
  this.cargandoDashboard = true;
  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 1000); // 1 segundo simulado de carga
}




}
