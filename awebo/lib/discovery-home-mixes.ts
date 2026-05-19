/**
 * Discovery breadcrumb mixes for the AWEBO home marketplace blocks.
 * The last crumb in each mix has href: null (current slice label).
 */

export type DiscoveryCrumb = {
  label: string;
  /** Listing URL; null = current context (not clickable). */
  href: string | null;
};

export const EXPLORE_BRANDS_MIXES: DiscoveryCrumb[][] = [
  [
    { label: 'Brands', href: '/brands' },
    { label: 'Memes', href: '/brands?tag=memes' },
    { label: 'New', href: '/brands?sort=new' },
    { label: 'Trending', href: null },
  ],
  [
    { label: 'Brands', href: '/brands' },
    { label: 'Art & Prints', href: '/brands?tag=art-prints' },
    { label: 'Verified', href: '/brands?verified=true' },
    { label: 'Top Rated', href: null },
  ],
  [
    { label: 'Brands', href: '/brands' },
    { label: 'Viking / Warrior', href: '/brands?theme=viking-warrior' },
    { label: 'New Drops', href: '/brands?sort=new' },
    { label: 'Popular', href: null },
  ],
];

/** Three segments: Products › middle › current */
export const TRENDING_PRODUCTS_MIXES: DiscoveryCrumb[][] = [
  [
    { label: 'Products', href: '/products' },
    { label: 'Trending', href: '/products?sort=trending' },
    { label: 'Best Sellers', href: null },
  ],
  [
    { label: 'Products', href: '/products' },
    { label: 'Summer', href: '/products?season=summer' },
    { label: 'Limited', href: null },
  ],
  [
    { label: 'Products', href: '/products' },
    { label: 'Discounts', href: '/products?deal=true' },
    { label: '25%+', href: null },
  ],
  [
    { label: 'Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=new' },
    { label: 'Streetwear', href: null },
  ],
];

export const CROWDFUNDING_MIXES: DiscoveryCrumb[][] = [
  [
    { label: 'Fundraising', href: '/fundraising' },
    { label: 'Live', href: '/fundraising?status=live' },
    { label: '70%+ funded', href: null },
  ],
  [
    { label: 'Fundraising', href: '/fundraising' },
    { label: 'New', href: '/fundraising?sort=new' },
    { label: 'Ending soon', href: null },
  ],
  [
    { label: 'Fundraising', href: '/fundraising' },
    { label: 'Memes', href: '/fundraising?tag=memes' },
    { label: 'Hot', href: null },
  ],
  [
    { label: 'Fundraising', href: '/fundraising' },
    { label: 'Verified', href: '/fundraising?verified=true' },
    { label: 'Top Supporters', href: null },
  ],
];

/** Variable root label for apparel / home / stickers rows */
export const APPAREL_HOME_MIXES: DiscoveryCrumb[][] = [
  [
    { label: 'Apparel', href: '/products?segment=apparel' },
    { label: 'Men', href: '/products?category=men' },
    { label: 'T-shirts', href: '/products?category=men&subcategory=tshirts' },
    { label: 'Best Sellers', href: null },
  ],
  [
    { label: 'Apparel', href: '/products?segment=apparel' },
    { label: 'Women', href: '/products?category=women' },
    { label: 'Hoodies', href: '/products?category=women&subcategory=hoodies' },
    { label: 'New', href: null },
  ],
  [
    { label: 'Home', href: '/products?category=home' },
    { label: 'Decor', href: '/products?category=home&subcategory=decor' },
    { label: 'Posters', href: '/products?category=home&subcategory=posters' },
    { label: 'Trending', href: null },
  ],
  [
    { label: 'Stickers', href: '/products?category=stickers' },
    { label: 'Memes', href: '/products?category=stickers&tag=memes' },
    { label: 'New', href: null },
  ],
];

/** Example mixes for infinite / feed rows */
export const FEED_MIXES: DiscoveryCrumb[][] = [
  [
    { label: 'Products', href: '/products' },
    { label: 'For You', href: '/products?forYou=true' },
    { label: 'Based on Favorites', href: null },
  ],
  [
    { label: 'Brands', href: '/brands' },
    { label: 'New Creators', href: '/brands?sort=new' },
    { label: 'Meme Category', href: null },
  ],
];
