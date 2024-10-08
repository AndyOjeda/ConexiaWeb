import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  products: any[] = [];
  userName: string | null = null;

    // Variables para manejar la visibilidad de los diálogos
    displayNotifications: boolean = false;
    displayMessages: boolean = false;

    // Datos ficticios para las notificaciones y mensajes
    notifications = [];
    messages = [];


  constructor(
    private router: Router,
    public backendService: BackendService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.loadUserProducts();
  }

  loadUserProducts() {
    this.backendService.getProductsByUser().subscribe(
      (products) => {
        console.log('Productos obtenidos del usuario:', products); // Verificar productos
        this.products = products;

        if (this.products.length === 0) {
          console.log('No hay productos para este usuario.');
        }
      },
      (error) => {
        console.error('Error al cargar productos del usuario:', error);
      }
    );
  }

  getProductImage(imagePath: string):string {
    return imagePath;
  }

  goToComponentA() {
    this.router.navigate(['/userConfig']);
  }

  editarProducto(productId: string) {
    this.router.navigate(['/editProduct', productId]);
  }

  toggleNotifications() {
    this.displayNotifications = !this.displayNotifications;
  }

  toggleMessages() {
    this.displayMessages = !this.displayMessages;
  }
}
