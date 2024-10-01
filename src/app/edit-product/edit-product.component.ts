import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


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
  isUploading: boolean = false;
  imageUploaded: boolean = false;

  // Definición de las nuevas propiedades
  buttonLabel: string = 'Guardar';
  buttonState: 'normal' | 'success' | 'error' = 'normal';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.backendService.getProductById(productId).subscribe((data) => {
        this.product = data;

        if (this.product.imagen) {
          this.productImage = this.product.imagen;
          console.log('Imagen URL:', this.productImage);
        }

        this.cdr.detectChanges();
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

      // Quitar la previsualización y mostrar mensaje de "Cargando..."
      this.imageUploaded = false;
      this.isUploading = true;

      // Subir la imagen inmediatamente después de seleccionarla
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.backendService.uploadImage(file).subscribe(
      (response) => {
        this.isUploading = false;
        this.product.imagen = response.path; // Guardar la nueva ruta de la imagen

        // Mostrar mensaje de "Nueva foto cargada" en lugar de la previsualización
        this.imageUploaded = true;
      },
      (error) => {
        this.isUploading = false;
        this.setButtonState('Error al subir imagen', 'error');
      }
    );
  }



  onSave(): void {
    if (!this.product.imagen && this.imageUploaded) {
      // Si hay una imagen subida, asegurarse de que se guarda correctamente
      this.product.imagen = this.productImage;
    }

    this.saveProduct();
  }

  saveProduct(): void {
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
