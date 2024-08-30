import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/market']); // Aquí defines a qué componente quieres redirigir
  }

}
