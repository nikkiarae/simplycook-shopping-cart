import { NotFoundException } from '@nestjs/common';
import { CartService } from '../cart.service';
import { AddItemDto } from '../dto/add-item.dto';

const sampleItem = (overrides: Partial<AddItemDto> = {}): AddItemDto => ({
  productId: 1,
  quantity: 1,
  unitPrice: 4.99,
  metadata: { name: 'Tomato Pasta Kit' },
  ...overrides,
});

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('creates an empty cart with totals', () => {
    const cart = service.createCart();

    expect(cart.id).toBeDefined();
    expect(cart.items).toEqual([]);
    expect(cart.totals).toEqual({ subtotal: 0, itemCount: 0 });
  });

  it('throws NotFound when getting an unknown cart', () => {
    expect(() => service.getCart('missing')).toThrow(NotFoundException);
  });

  it('adds an item and computes the subtotal', () => {
    const { id } = service.createCart();
    const cart = service.addItem(id, sampleItem({ quantity: 2, unitPrice: 4.5 }));

    expect(cart.items).toHaveLength(1);
    expect(cart.totals).toEqual({ subtotal: 9, itemCount: 2 });
  });

  it('merges quantity when the same productId is added twice', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem({ quantity: 1 }));
    const cart = service.addItem(id, sampleItem({ quantity: 3 }));

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
  });

  it('updates the quantity of an existing item', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem({ quantity: 1, unitPrice: 2 }));
    const cart = service.updateQuantity(id, 1, 5);

    expect(cart.items[0].quantity).toBe(5);
    expect(cart.totals).toEqual({ subtotal: 10, itemCount: 5 });
  });

  it('removes the item when quantity is updated to 0', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem());
    const cart = service.updateQuantity(id, 1, 0);

    expect(cart.items).toEqual([]);
    expect(cart.totals.itemCount).toBe(0);
  });

  it('throws NotFound when updating quantity of an unknown product', () => {
    const { id } = service.createCart();
    expect(() => service.updateQuantity(id, 999, 1)).toThrow(NotFoundException);
  });

  it('removes a specific item', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem({ productId: 1 }));
    service.addItem(id, sampleItem({ productId: 2, metadata: { name: 'Other' } }));
    const cart = service.removeItem(id, 1);

    expect(cart.items.map((i) => i.productId)).toEqual([2]);
  });

  it('throws NotFound when removing an unknown product', () => {
    const { id } = service.createCart();
    expect(() => service.removeItem(id, 999)).toThrow(NotFoundException);
  });

  it('clears all items', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem({ productId: 1 }));
    service.addItem(id, sampleItem({ productId: 2, metadata: { name: 'Other' } }));
    const cart = service.clearCart(id);

    expect(cart.items).toEqual([]);
  });

  it('computes totals across multiple items without floating-point drift', () => {
    const { id } = service.createCart();
    service.addItem(id, sampleItem({ productId: 1, quantity: 3, unitPrice: 0.1 }));
    service.addItem(id, sampleItem({ productId: 2, quantity: 1, unitPrice: 0.2, metadata: { name: 'B' } }));
    const cart = service.getCart(id);

    expect(cart.totals).toEqual({ subtotal: 0.5, itemCount: 4 });
  });
});
