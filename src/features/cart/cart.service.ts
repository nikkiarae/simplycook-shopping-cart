import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AddItemDto } from './dto/add-item.dto';
import {
  Cart,
  CartItem,
  CartTotals,
  CartView,
} from './cart.types';

@Injectable()
export class CartService {
  private readonly carts = new Map<string, Cart>();

  // Service Methods

  createCart(): CartView {
    const cart: Cart = {
      id: randomUUID(),
      items: [],
    };
    this.carts.set(cart.id, cart);
    return this.toView(cart);
  }

  getCart(cartId: string): CartView {
    return this.toView(this.findCartOrThrow(cartId));
  }

  addItem(cartId: string, dto: AddItemDto): CartView {
    const cart = this.findCartOrThrow(cartId);
    const existing = cart.items.find((i) => i.productId === dto.productId);

    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      const item: CartItem = {
        productId: dto.productId,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        metadata: { ...dto.metadata },
      };
      cart.items.push(item);
    }

    return this.toView(cart);
  }

  updateQuantity(
    cartId: string,
    productId: number,
    quantity: number,
  ): CartView {
    const cart = this.findCartOrThrow(cartId);
    const index = cart.items.findIndex((i) => i.productId === productId);

    if (index === -1) {
      throw new NotFoundException(
        `Product ${productId} not found in cart ${cartId}`,
      );
    }

    if (quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    return this.toView(cart);
  }

  removeItem(cartId: string, productId: number): CartView {
    const cart = this.findCartOrThrow(cartId);
    const index = cart.items.findIndex((i) => i.productId === productId);

    if (index === -1) {
      throw new NotFoundException(
        `Product ${productId} not found in cart ${cartId}`,
      );
    }

    cart.items.splice(index, 1);
    return this.toView(cart);
  }

  clearCart(cartId: string): CartView {
    const cart = this.findCartOrThrow(cartId);
    cart.items = [];
    return this.toView(cart);
  }

  // Helper Methods

  private findCartOrThrow(cartId: string): Cart {
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart ${cartId} not found`);
    }
    return cart;
  }

  private computeTotals(cart: Cart): CartTotals {
    let subtotal = 0;
    let itemCount = 0;
    for (const item of cart.items) {
      subtotal += item.unitPrice * item.quantity;
      itemCount += item.quantity;
    }
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      itemCount,
    };
  }

  private toView(cart: Cart): CartView {
    return { ...cart, items: [...cart.items], totals: this.computeTotals(cart) };
  }
}
