import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-subasta',
  standalone: true,
  imports: [ NavbarComponent, NgIf, NgFor, CommonModule, FormsModule ],
  templateUrl: './subasta.component.html',
  styleUrl: './subasta.component.css'
})
export class SubastaComponent {

  products: any[] = [];
  activeButton: string | null = null; // Por defecto, mostrar productos de Plástico
  filteredProducts: any[] = [];

  productoSeleccionado: any = null;
  ofertaUsuario: number = 0;
  tiempoRestante: string = '';
  temporizador: any;
  tiempoLimite: number = 30 * 60;

  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.backendService.getProductsByState('Subasta').subscribe((products: any) => {
        this.products = products;
        this.filteredProducts = products; // Inicialmente, mostrar todos los productos
    });
  }



  setActiveButton(category: string) {
    this.activeButton = category;

    // Filtra los productos según la categoría seleccionada
    this.filteredProducts = this.products.filter(product => {
        if (category === 'Plastico') {
            return product.categoria_id === 1; // Filtra por `categoria_id` 1 para Plástico
        } else if (category === 'Textil') {
            return product.categoria_id === 2; // Filtra por `categoria_id` 2 para Textil
        } else {
            return true; // Si no hay categoría seleccionada, muestra todos los productos
        }
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

  abrirDialogoOferta(producto: any) {
    this.productoSeleccionado = producto;
    this.ofertaUsuario = producto.precioActual + 1;
    this.iniciarTemporizador();
  }

  cerrarDialogo() {
    this.productoSeleccionado = null;
    clearInterval(this.temporizador);
  }

  confirmarOferta() {
    if (this.ofertaUsuario > this.productoSeleccionado.precio) {
      // Llamar al backend para actualizar solo el precio en la base de datos
      this.backendService.updateProductPrice(this.productoSeleccionado.id, this.ofertaUsuario)
        .subscribe(
          response => {
            this.productoSeleccionado.precio = this.ofertaUsuario;
            alert('¡Oferta realizada con éxito!');
            this.cerrarDialogo();
          },
          error => {
            console.error('Error al actualizar la oferta:', error);
            alert('Hubo un problema al realizar la oferta.');
          }
        );
    } else {
      alert('La oferta debe ser mayor al precio actual.');
    }
  }


  // Temporizador para el contador de tiempo restante
  iniciarTemporizador() {
    this.tiempoRestante = this.formatoTiempo(this.tiempoLimite);
    const interval = setInterval(() => {
      this.tiempoLimite--;

      if (this.tiempoLimite <= 0) {
        clearInterval(interval);
        this.cerrarDialogo();
        alert('El tiempo ha terminado para realizar una oferta.');
      } else {
        this.tiempoRestante = this.formatoTiempo(this.tiempoLimite);
      }
    }, 1000);
  }

  formatoTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
  }



}
