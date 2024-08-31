import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  products: any[] = [];

  constructor(private backendService: BackendService, private router: Router) {}

  onSearch(query: string): void {
    this.backendService.searchProducts(query).subscribe((data) => {
      this.products = data;
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

}
