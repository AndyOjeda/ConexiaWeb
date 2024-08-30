import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-user-configuration',
  standalone: true,
  imports: [ NavbarComponent ],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.css'
})
export class UserConfigurationComponent {

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/user']); // Aquí defines a qué componente quieres redirigir
  }

}
