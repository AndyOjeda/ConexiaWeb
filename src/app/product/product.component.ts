import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private router: Router
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
      this.product = {
        ...data,
        imagen: this.backendService.getImageUrl(data.imagen) // Obtener la URL completa de la imagen
      };
    });
  }

  back() {
    this.router.navigate(['/market']);
  }

  buyNow() {
    window.open('https://wa.link/94otp0', '_blank'); // Redirigir al enlace externo en una nueva pestaña
  }
}
