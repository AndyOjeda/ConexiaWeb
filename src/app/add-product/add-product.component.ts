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
  providers: [BackendService, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  products: any[] = [];
  categories: any[] = [];
  newProduct = { titulo: '', descripcion: '', precio: 0, imagen: '', categoria_id: 1 };

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedImage: string | null = null;

  // Variables para manejar el estado del botón
  buttonLabel: string = 'Agregar';
  buttonState: 'normal' | 'success' | 'error' = 'normal';

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = [
      { id: 1, nombre: 'Plastico' },
      { id: 2, nombre: 'Textil' },
    ];
  }

  createProduct(): void {
    // Validar que todos los campos estén llenos
    if (!this.newProduct.titulo || !this.newProduct.descripcion || !this.newProduct.precio || !this.selectedImage) {
      this.setButtonState('Todos los campos son obligatorios', 'error');
      return;
    }

    const formData = new FormData();
    const userId = localStorage.getItem('userId'); // Obtén el userId desde localStorage

    formData.append('titulo', this.newProduct.titulo);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('precio', this.newProduct.precio.toString());
    formData.append('categoria_id', this.newProduct.categoria_id.toString());
    formData.append('userId', userId!);

    if (this.fileInput.nativeElement.files[0]) {
      formData.append('imagen', this.fileInput.nativeElement.files[0]);
    }

    this.backendService.createProduct(formData).subscribe(
      () => {
        this.newProduct = { titulo: '', descripcion: '', precio: 0, imagen: '', categoria_id: 1 };
        this.selectedImage = null;
        this.fileInput.nativeElement.value = '';

        // Cambiar el estado del botón a éxito
        this.setButtonState('Producto añadido correctamente', 'success');
      },
      (error) => {
        if (error.status === 400) {
          this.setButtonState('Producto ya creado con ese nombre', 'error');
        } else {
          this.setButtonState('Error al añadir el producto', 'error');
        }
      }
    );
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

  removeImage() {
    this.selectedImage = null;
    this.fileInput.nativeElement.value = ''; // Resetear el input
  }

  resetButton() {
    this.buttonLabel = 'Agregar';
    this.buttonState = 'normal';
  }

  setButtonState(message: string, state: 'success' | 'error') {
    this.buttonLabel = message;
    this.buttonState = state;

    if (state === 'success') {
      setTimeout(() => {
        this.resetButton();
      }, 3000); // Volver al estado normal después de 3 segundos
    }
  }
}
