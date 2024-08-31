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

  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.backendService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  setActiveButton(category: string) {
    if (this.activeButton === category) {
      // Si el filtro ya está activo, se desactiva y no muestra ningún producto
      this.activeButton = null;
      this.products = [];
    } else {
      // Si no está activo, filtra por la categoría seleccionada
      this.activeButton = category;
      this.backendService.getProductsByCategory(category.toLowerCase()).subscribe(data => {
        this.products = data;
      });
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
