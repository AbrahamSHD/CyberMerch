import { Product } from './product.entity';

export class ProductImage {
  id: string;
  url: string;
  productId: Product;
}
