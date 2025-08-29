import type { Product } from '@/lib/types';

const mockProducts: Product[] = [
  {
    id: 'prod_lavender',
    displayName: 'Lavender',
    baseUOM: 'each',
    active: true,
    variants: [
      { id: 'var_lav_s', sku: 'SKU-A1-S', packageSize: 'Small', uom: 'each', active: true },
      { id: 'var_lav_m', sku: 'SKU-A1-M', packageSize: 'Medium', uom: 'each', active: true },
      { id: 'var_lav_l', sku: 'SKU-A1-L', packageSize: 'Large', uom: 'each', active: true },
    ],
  },
  {
    id: 'prod_rosemary',
    displayName: 'Rosemary',
    baseUOM: 'each',
    active: true,
    variants: [
      { id: 'var_ros_s', sku: 'SKU-R2-S', packageSize: 'Small', uom: 'each', active: true },
      { id: 'var_ros_l', sku: 'SKU-R2-L', packageSize: 'Large', uom: 'each', active: true },
    ],
  },
  {
    id: 'prod_mint',
    displayName: 'Mint',
    baseUOM: 'each',
    active: true,
    variants: [
        { id: 'var_mint_m', sku: 'SKU-M3-M', packageSize: 'Medium', uom: 'each', active: true },
        { id: 'var_mint_l', sku: 'SKU-M3-L', packageSize: 'Large', uom: 'each', active: true },
    ],
  },
  {
    id: 'prod_thyme',
    displayName: 'Thyme',
    baseUOM: 'each',
    active: false,
    variants: [
        { id: 'var_thyme_l', sku: 'SKU-T4-L', packageSize: 'Large', uom: 'each', active: true },
    ],
  },
  {
    id: 'prod_basil',
    displayName: 'Basil',
    baseUOM: 'each',
    active: true,
    variants: [
        { id: 'var_basil_s', sku: 'SKU-B5-S', packageSize: 'Small', uom: 'each', active: true },
    ],
  },
];

/**
 * A mock service to fetch products.
 * In a real application, this would fetch data from a database or API.
 */
export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
}