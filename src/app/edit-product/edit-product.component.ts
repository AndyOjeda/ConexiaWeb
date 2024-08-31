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

  // Definición de las nuevas propiedades
  buttonLabel: string = 'Guardar';
  buttonState: 'normal' | 'success' | 'error' = 'normal';

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
  }


  onInputChange(): void {
    this.hasChanges = true;
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

      const reader = new FileReader();
      reader.onload = () => {
        this.productImage = reader.result as string; // Mostrar la nueva imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  }


  onSave(): void {
    if (this.selectedFile) {
      // Subir la nueva imagen si se seleccionó una
      this.backendService.uploadImage(this.selectedFile).subscribe(
        (response) => {
          this.product.imagen = response.path; // Guardar la nueva ruta de la imagen
          this.saveProduct();
        },
        (error) => {
          this.setButtonState('Error al subir imagen', 'error');
        }
      );
    } else {
      // Guardar los cambios del producto con la imagen existente
      this.saveProduct();
    }
  }

  saveProduct(): void {
    if (!this.product.imagen) {
      this.product.imagen = this.productImage; // Asegúrate de que se envíe la imagen actual si no se ha seleccionado una nueva
    }

    this.backendService.updateProduct(this.product).subscribe(
      () => {
        this.setButtonState('Cambios exitosos', 'success');
        setTimeout(() => this.router.navigate(['/user']), 2000);
      },
      (error) => {
        this.setButtonState('Error al guardar', 'error');
      }
    );
  }


  setButtonState(message: string, state: 'success' | 'error') {
    this.buttonLabel = message;
    this.buttonState = state;
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
