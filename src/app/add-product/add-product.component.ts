import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [NavbarComponent, NgIf, FormsModule, CommonModule],
  providers: [BackendService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  categories: any[] = [];
  newProduct = { titulo: '', descripcion: '', precio: 0, categoria_id: 1 };
  selectedImage: string | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  buttonLabel: string = 'Agregar';
  buttonState: 'normal' | 'success' | 'error' | 'loading' = 'normal';

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.backendService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  createProduct(): void {
    if (!this.newProduct.titulo || !this.newProduct.descripcion || !this.newProduct.precio || !this.selectedImage) {
      this.setButtonState('Todos los campos son obligatorios', 'error');
      return;
    }

    this.setButtonState('Cargando...', 'loading'); // Estado de carga

    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('titulo', this.newProduct.titulo);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('precio', this.newProduct.precio.toString());
    formData.append('categoria_id', this.newProduct.categoria_id.toString());
    formData.append('user_id', userId!);

    if (this.fileInput.nativeElement.files[0]) {
      formData.append('imagen', this.fileInput.nativeElement.files[0]);
    }

    this.backendService.createProduct(formData).subscribe(
      () => {
        this.setButtonState('Producto añadido correctamente', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (error) => {
        this.setButtonState('Error al crear el producto', 'error');
        console.error('Error al crear el producto', error);
      }
    );
  }

  setButtonState(message: string, state: 'success' | 'error' | 'loading' | 'normal') {
    this.buttonLabel = message;
    this.buttonState = state;

    if (state === 'success' || state === 'error') {
      setTimeout(() => {
        this.resetButton();
      }, 2000); // Volver al estado normal después de 2 segundos
    }
  }

  resetButton() {
    this.buttonLabel = 'Agregar';
    this.buttonState = 'normal';
  }

  removeImage() {
    this.selectedImage = null;
    this.fileInput.nativeElement.value = '';
  }
}
