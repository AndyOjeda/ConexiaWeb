import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/'; // Verifica si la ruta actual es la página de inicio
    });
  }

  isHome: boolean = false;

  goHome() {
    this.router.navigate(['/']); // Aquí defines a qué componente quieres redirigir
  }

  isMenuOpen = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-icon');

    if (!clickedInside) {
      this.isMenuOpen = false; // Cierra el menú si se hace clic fuera
    }
  }

  navigateTo(route: string) {
    this.isMenuOpen = false;  // Cierra el menú antes de navegar
    this.router.navigate([`/${route}`]);  // Navega a la ruta correspondiente
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
