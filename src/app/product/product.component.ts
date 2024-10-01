import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, NgIf, NavbarComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Obtener el ID del producto de la URL
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      // Cargar los detalles del producto desde el backend
      this.loadProductDetails(productId);
    }
  }

  loadProductDetails(productId: string) {
    this.backendService.getProductById(productId).subscribe(data => {
      console.log('Detalles del producto:', data); // Verifica los detalles
      this.product = {
        ...data,
        imagen: this.getProductImage(data.imagen) // Aquí simplemente devuelve la URL tal cual
      };
    });
  }

  getProductImage(imagePath: string):string {
    return imagePath;
  }

  back() {
    this.router.navigate(['/market']);
  }

  addToCart() {
    this.cartService.addToCart(this.product); // Llamada al servicio para añadir el producto
    console.log('Producto añadido al carrito:', this.product);
  }

}
