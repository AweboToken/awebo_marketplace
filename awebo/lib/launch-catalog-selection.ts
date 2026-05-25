import type { LaunchCatalogProduct } from '@/lib/marketplace-data';
import type { LaunchWizardProduct } from '@/lib/launch-wizard-types';

export function mockProductToLaunchProduct(catalogProduct: LaunchCatalogProduct): LaunchWizardProduct {
  return {
    id: catalogProduct.id,
    name: catalogProduct.name,
    baseProductId: catalogProduct.id,
    categorySlug: catalogProduct.categorySlug,
    imageTone: catalogProduct.imageTone,
    status: 'Draft',
  };
}

export function isProductInCollection(
  products: LaunchWizardProduct[],
  catalogProductId: string
): boolean {
  return products.some((product) => product.id === catalogProductId);
}

export function toggleProductInCollection(
  products: LaunchWizardProduct[],
  catalogProduct: LaunchCatalogProduct
): LaunchWizardProduct[] {
  if (isProductInCollection(products, catalogProduct.id)) {
    return products.filter((product) => product.id !== catalogProduct.id);
  }
  return [...products, mockProductToLaunchProduct(catalogProduct)];
}

export function removeProductFromCollection(
  products: LaunchWizardProduct[],
  productId: string
): LaunchWizardProduct[] {
  return products.filter((product) => product.id !== productId);
}
