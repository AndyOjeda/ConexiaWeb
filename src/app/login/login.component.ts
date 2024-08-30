import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  login() {
    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.authService.setUserInfo(response.id, response.nombre);
        this.router.navigate(['/user']); // Cambia '/user' por la ruta que quieras redirigir después del login
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Email o contraseña incorrecta';
        console.error('Error de inicio de sesión:', error);
      }
    );
  }


  resetButton() {
    this.loading = false;
    this.errorMessage = null;
  }
}
