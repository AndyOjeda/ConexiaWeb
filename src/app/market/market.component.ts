import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.backendService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Inicialmente muestra todos los productos
    });
  }

  setActiveButton(category: string) {
    if (this.activeButton === category) {
      // Si ya está activo, desactiva el filtro y muestra todos los productos
      this.activeButton = null;
      this.filteredProducts = this.products;
    } else {
      // Filtra los productos por la categoría seleccionada
      this.activeButton = category;
      this.filteredProducts = this.products.filter(product => product.categoria.toLowerCase() === category.toLowerCase());
    }
  }

  getProductImage(imagePath: string):string {
    return imagePath;
  }

  openProduct(product: any) {
    // Lógica para abrir el producto (por ejemplo, navegar a una nueva vista)
    console.log('Producto seleccionado:', product);
    this.router.navigate(['/product', product.id]);
  }
}
