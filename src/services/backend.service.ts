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
    const headers = this.authService.getAuthHeaders();
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`, { headers });
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
    const headers = this.getAuthHeaders(); // Asegúrate de incluir los headers con el token
    return this.http.post<any>(`${this.apiUrl}/products`, formData, { headers });
  }


  getProducts(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/products`, { headers });
  }

  getImageUrl(imagePath: string): string {
    return `https://res.cloudinary.com/tu_cloud_name/image/upload/v123456789/${imagePath}`;
  }


  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/products/${category.toLowerCase()}`);
  }

  searchProducts(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/search`, { params: { q: query } });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const productId = product.id;
    return this.http.put<any>(`${this.apiUrl}/products/${productId}`, product, { headers });
  }

  deleteProduct(productId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}`, { headers });
  }

// backendService.ts
  uploadImage(file: File): Observable<{ path: string }> { // Indicar que se espera un objeto con una propiedad 'path'
    const formData = new FormData();
    formData.append('image', file);

    const headers = this.getAuthHeaders();

    return this.http.post<{ path: string }>(`${this.apiUrl}/products/upload-image`, formData, { headers });
}


}
