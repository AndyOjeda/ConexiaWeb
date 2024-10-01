import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidebarVisible: boolean = false;
  selectedProducts: any[] = [];
  isHome: boolean = false;
  isMenuOpen = false;
  showDialog = false;
  paymentMethod: string = '';
  isLoading = false;
  cardName: string = '';
  cardNumber: string = '';
  cardExpiration: string = '';
  cardCVV: string = '';
  isMobileMenuOpen: boolean = false;

  isProcessingPayment = false;
  isPaymentSuccessful = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/'; // Verifica si la ruta actual es la página de inicio
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit() {
    this.selectedProducts = this.cartService.getCartItems(); // Obtiene los productos del carrito
  }

  goHome() {
    this.router.navigate(['/']); // Redirige a la página principal
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-icon');

    if (!clickedInside) {
      this.isMenuOpen = false; // Cierra el menú de usuario si se hace clic fuera
    }
  }

  navigateTo(route: string) {
    this.isMenuOpen = false; // Cierra el menú antes de navegar
    this.router.navigate([`/${route}`]); // Navega a la ruta correspondiente
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Verifica si el usuario está autenticado
  }

  logout() {
    this.authService.logout(); // Cierra sesión
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Abre/cierra el menú de usuario
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  addToCart(product: any) {
    this.cartService.addToCart(product); // Añade el producto usando el CartService
    this.selectedProducts = this.cartService.getCartItems(); // Actualiza los productos
    this.cdr.detectChanges();
  }

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index); // Elimina el producto del carrito
    this.selectedProducts = this.cartService.getCartItems(); // Actualiza los productos
    this.cdr.detectChanges();
  }

  getTotalPrice() {
    return this.selectedProducts.reduce((total, product) => {
      return total + (product.quantity * product.precio);
    }, 0);
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.updateCartItems(this.selectedProducts); // Actualiza el carrito
    }
  }

  increaseQuantity(product: any) {
    product.quantity++;
    this.cartService.updateCartItems(this.selectedProducts); // Actualiza el carrito
  }

  checkout() {
    this.showDialog = true;
    this.sidebarVisible = false;
  }

  processPayment() {
    // Mostrar pantalla de carga
    this.isLoading = true;

    // Simular tiempo de procesamiento de pago (5 segundos)
    setTimeout(() => {
      // Después de 5 segundos
      this.isLoading = false;
      this.isPaymentSuccessful = true;

      // Mostrar pantalla de éxito por 2 segundos y redirigir a "market"
      setTimeout(() => {
        this.closeDialog();
        this.router.navigate(['market']);
      }, 2000);
    }, 5000);
  }

  closeDialog() {
    this.showDialog = false;
  }

  getProductImage(imagePath: string): string {
    return imagePath;
  }
}
