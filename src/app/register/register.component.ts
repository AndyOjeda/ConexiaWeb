import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  buttonText: string = 'Continuar';
  buttonColor: string = '#22c55e'; // Verde por defecto

  constructor(private router: Router, private backendService: BackendService) {}

  register() {
    const user = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    this.backendService.createUser(user).subscribe({
      next: (res) => {
        console.log('User created successfully', res);
        this.buttonColor = '#007bff'; // Cambia el color a azul
        this.buttonText = 'Usuario creado'; // Cambia el texto
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirige al login después de 1.5 segundos
      },
      error: (err) => {
        console.error('Error creating user', err);
        this.buttonColor = '#dc3545'; // Cambia el color a rojo
        this.buttonText = 'Email ya registrado'; // Cambia el texto
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
