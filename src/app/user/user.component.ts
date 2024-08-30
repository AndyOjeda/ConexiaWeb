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
    this.backendService.getProducts().subscribe(
        (products) => {
            const userId = this.authService.getUserId();
            console.log('userId desde el token:', userId); // Verificar userId
            console.log('Productos obtenidos:', products); // Verificar productos

            // Filtrar productos que tienen un userId igual al del usuario autenticado
            this.products = products.filter(product => product.user_id === Number(userId));

            if (this.products.length === 0) {
                console.log('No hay productos para este usuario.');
            }
        },
        (error) => {
            console.error('Error al cargar productos del usuario:', error);
        }
    );
  }

  goToComponentA() {
    this.router.navigate(['/userConfig']);
  }

  editarProducto(productId: string) {
    this.router.navigate(['/editProduct', productId]);
  }
}
