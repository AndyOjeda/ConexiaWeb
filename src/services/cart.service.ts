import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];

  addToCart(product: any) {
    const price = parseFloat(product.precio.replace(/,/g, ''));
    const existingProduct = this.cartItems.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.totalPrice = existingProduct.quantity * price;
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1,
        totalPrice: price
      });
    }
  }

  getCartItems() {
    return this.cartItems;
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, product) => {
      const price = parseFloat(product.precio.replace(/,/g, ''));
      return total + (product.quantity * price);
    }, 0);
  }

  updateCartItems(newCartItems: any[]) {
    this.cartItems = newCartItems;
  }
}
