import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ FormsModule, NgClass, NgIf, CommonModule ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})

export class EditProductComponent implements OnInit {
  product: any = {};
  productImage: string = '';
  hasChanges: boolean = false;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.backendService.getProductById(productId).subscribe((data) => {
        this.product = data;
        this.productImage = this.backendService.getImageUrl(this.product.imagen);
      });
    }

    // Escuchar cambios en el formulario
    this.route.queryParams.subscribe(() => {
      this.hasChanges = true; // Cambia esto para verificar cambios en los inputs
    });
  }

  onInputChange(): void {
    this.hasChanges = true; // Cambia a true si algún input ha cambiado
  }

  back(): void {
    this.router.navigate(['/user']);
  }

  onImageChange(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.hasChanges = true;

      // Mostrar la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.productImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.selectedFile) {
      // Subir la nueva imagen si se seleccionó una
      this.backendService.uploadImage(this.selectedFile).subscribe((imagePath) => {
        this.product.imagen = imagePath;
        this.saveProduct();
      });
    } else {
      // Guardar los cambios del producto sin cambiar la imagen
      this.saveProduct();
    }
  }

  saveProduct(): void {
    this.backendService.updateProduct(this.product).subscribe(
      () => {
        this.router.navigate(['/user']);
      },
      (error) => {
        // Mostrar un mensaje de error
        alert('Error al actualizar el producto. Por favor, intenta nuevamente.');
      }
    );
  }


  onDelete(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.backendService.deleteProduct(productId).subscribe(() => {
        this.router.navigate(['/user']);
      });
    }
  }
}
