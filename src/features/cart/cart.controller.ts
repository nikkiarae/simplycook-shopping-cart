import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@ApiTags('cart')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new empty cart' })
  @ApiResponse({ status: 201, description: 'Cart created' })
  createCart() {
    return this.cartService.createCart();
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get a cart with computed totals' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Post(':cartId/items')
  @ApiOperation({
    summary: 'Add an item to the cart',
    description:
      'If the productId already exists, its quantity is incremented (no duplicate entry).',
  })
  addItem(@Param('cartId') cartId: string, @Body() dto: AddItemDto) {
    return this.cartService.addItem(cartId, dto);
  }

  @Patch(':cartId/items/:productId')
  @ApiOperation({
    summary: 'Update the quantity of an item',
    description: 'Setting quantity to 0 removes the item.',
  })
  updateQuantity(
    @Param('cartId') cartId: string,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateQuantityDto,
  ) {
    return this.cartService.updateQuantity(cartId, productId, dto.quantity);
  }

  @Delete(':cartId/items/:productId')
  @ApiOperation({ summary: 'Remove a single item from the cart' })
  removeItem(
    @Param('cartId') cartId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(cartId, productId);
  }

  @Delete(':cartId/items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove all items from the cart' })
  clearCart(@Param('cartId') cartId: string) {
    return this.cartService.clearCart(cartId);
  }
}
