export const appPageQuery = `*[_type == "appPage" && _id == "appPage"][0]{
  heroImage,
  "projects": projects[]->{
    _id,
    title,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, "")
  },
  bannerImage,
  bannerHeight,
  featuredTitle,
  featuredDescription,
  featuredImage,
  featuredCtaText,
  featuredCtaLink,
  ctaTitle,
  ctaButtonText,
  ctaLink,
  "heroImageUrl": heroImage.asset->url,
  "bannerImageUrl": bannerImage.asset->url,
  "featuredImageUrl": featuredImage.asset->url
}`;

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0]{
  heroBadge,
  heroHeadline,
  heroSubtext,
  heroSlides,
  howItWorksLabel,
  howItWorksTitle,
  howItWorksDescription,
  howItWorksCtaText,
  howItWorksCtaLink,
  ecosystemTitle,
  ecosystemDescription,
  ecosystemProductTitle,
  ecosystemProductDescription,
  ecosystemProductPrice,
  "ecosystemProductImageUrl": coalesce(ecosystemProductImage.asset->url, ecosystemProductImageUrl),
  ctaBannerTitle,
  ctaBannerDescription,
  "ctaBannerBackgroundImageUrl": coalesce(ctaBannerBackgroundImage.asset->url, ctaBannerBackgroundImageUrl),
  ctaBannerPrimaryText,
  ctaBannerSecondaryText,
  ctaBannerSecondaryLink
}`;

export const topCreatorsQuery = `*[_type == "topCreator"] | order(order asc, name asc){
  _id,
  name,
  "slug": slug.current,
  tagline,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  statsLabel,
  statsValue
}`;

export const trustedByPartnersQuery = `*[_type == "trustedByPartner"] | order(order asc, name asc){
  _id,
  name,
  "logoUrl": coalesce(logo.asset->url, logoUrl)
}`;

export const phygitalItemsQuery = `*[_type == "phygitalItem"] | order(order asc, title asc){
  _id,
  title,
  description,
  meta,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  href
}`;

export const howItWorksCardsQuery = `*[_type == "howItWorksCard"] | order(order asc, name asc){
  _id,
  name,
  designation,
  content,
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;
