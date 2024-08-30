import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/user']); // Aquí defines a qué componente quieres redirigir
  }

}
