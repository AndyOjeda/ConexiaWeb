import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-configuration',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.css'
})
export class UserConfigurationComponent {

  userEmail: string | null = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail(); // Obtén el email del usuario al inicializar el componente
  }

  back() {
    this.router.navigate(['/user']);
  }

}
