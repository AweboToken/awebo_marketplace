export type AweboGalleryCell = {
  id: string;
  label: string;
  title: string;
  price: string;
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const PRODUCT_IMAGE = '/awebo_hat image.webp';
export const PRODUCT_PRICE = '$22.99';

function cell(
  id: string,
  label: string,
  title: string,
  x: number,
  y: number,
  w: number,
  h: number
): AweboGalleryCell {
  return {
    id,
    label,
    title,
    price: PRODUCT_PRICE,
    image: PRODUCT_IMAGE,
    x,
    y,
    w,
    h,
  };
}

/** Hover regions on `awebo_front.webp` (~1536×1024) — percentages of image box. */
export const aweboGalleryCells: AweboGalleryCell[] = [
  cell('A01', 'Top left black founder box', 'Founder Box 01', 3, 0, 13, 18),
  cell('A02', 'Top black bear figure', '00 Bear — Onyx', 22, 7, 11, 17),
  cell('A03', 'Main hoodie display', 'Genesis Hoodie', 39, 11, 14, 34),
  cell('A04', 'Top hat display', 'Vault Cap', 56, 19, 10, 10),
  cell('A05', 'Top right black box', 'Collector Crate', 65, 18, 8, 16),
  cell('A06', 'Top right bear', '00 Bear — Snow', 72, 18, 8, 16),
  cell('B01', 'White sneaker display', 'Phygital Sneaker', 2, 31, 18, 14),
  cell('B02', 'Middle black box', 'Drop Box II', 25, 26, 10, 17),
  cell('B03', 'Right middle black box', 'Archive Box', 57, 34, 8, 15),
  cell('B04', 'Middle black bear', '00 Bear — Core', 66, 35, 7, 15),
  cell('B05', 'Purple bear', '00 Bear — Violet', 72, 35, 7, 15),
  cell('C01', 'Large left black box', 'Vault Edition', 1, 49, 15, 19),
  cell('C02', 'Transparent bear', '00 Bear — Clear', 24, 50, 10, 16),
  cell('C03', 'Shoe bundle center', 'Sneaker Bundle', 39, 52, 15, 12),
  cell('C04', 'White bear', '00 Bear — Frost', 58, 51, 7, 15),
  cell('C05', 'Black bear', '00 Bear — Noir', 66, 51, 7, 15),
  cell('C06', 'Right black box', 'Display Case', 72, 50, 7, 15),
  cell('D01', 'Bottom left purple bear', '00 Bear — Amethyst', 4, 71, 12, 20),
  cell('D02', 'Bottom left black box', 'Founder Box II', 24, 69, 12, 19),
  cell('D03', 'Bottom center box', 'Culture Crate', 39, 69, 9, 17),
  cell('D04', 'Bottom center-right box', 'Studio Box', 48, 67, 10, 18),
  cell('D05', 'Small boxed collectible', 'Micro Collectible', 57, 72, 8, 14),
  cell('D06', 'Bottom right black box', 'Vault Box', 67, 70, 8, 16),
];
