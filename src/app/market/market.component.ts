import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor, CommonModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})


export class MarketComponent implements OnInit {
  products: any[] = [];
  activeButton: string | null = null; // Por defecto, mostrar productos de Plástico
  filteredProducts: any[] = [];

  constructor(private router: Router, private backendService: BackendService, private cartService: CartService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.backendService.getProductsByState('Venta').subscribe((products: any) => {
        this.products = products;
        this.filteredProducts = products; // Inicialmente, mostrar todos los productos
    });
  }


  setActiveButton(category: string) {
    this.activeButton = category;

    // Filtra los productos según la categoría seleccionada
    this.filteredProducts = this.products.filter(product => {
        if (category === 'Plastico') {
            return product.categoria_id === 1; // Filtra por `categoria_id` 1 para Plástico
        } else if (category === 'Textil') {
            return product.categoria_id === 2; // Filtra por `categoria_id` 2 para Textil
        } else {
            return true; // Si no hay categoría seleccionada, muestra todos los productos
        }
    });
}

  getProductImage(imagePath: string):string {
    return imagePath;
  }

  openProduct(product: any) {
    // Lógica para abrir el producto (por ejemplo, navegar a una nueva vista)
    console.log('Producto seleccionado:', product);
    this.router.navigate(['/product', product.id]);
  }


  addToCart(product: any) {
    this.cartService.addToCart(product); // Añade el producto al carrito
    console.log('Producto agregado al carrito:', product);
  }
}
