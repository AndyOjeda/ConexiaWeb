import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { UserProfile } from '../app/models/userProfile.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = environment.apiUrl;
  private imageUrl = environment.imageUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Usuarios
  createUser(user: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/user-profile');
  }

  // Categorías
  createCategory(category: { nombre: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }


  // Productos

  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, formData);
  }

  getProducts(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers });
  }

  getImageUrl(imagePath: string): string {
    return `${this.imageUrl}${imagePath}`;
  }

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/products/${category}`);
  }

  searchProducts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/search`, { params: { q: query } });
  }



}
