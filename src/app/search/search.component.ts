import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  products: any[] = [];

  constructor(private backendService: BackendService) {}

  onSearch(query: string): void {
    this.backendService.searchProducts(query).subscribe((data) => {
      this.products = data;
    });
  }

  getProductImage(imagePath: string): string {
    return this.backendService.getImageUrl(imagePath);
  }

  openProduct(product: any): void {
    // Lógica para abrir la vista del producto
  }

}
