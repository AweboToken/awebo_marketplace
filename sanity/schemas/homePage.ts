import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'howItWorks', title: 'How it works' },
    { name: 'ecosystem', title: 'Ecosystem' },
    { name: 'ctaBanner', title: 'CTA Banner' },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroBadge',
      title: 'Hero badge text',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Live now: Genesis Creator Drop"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'text',
      group: 'hero',
      rows: 4,
      description: 'Main headline (use line breaks for multiple lines)',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero subtext',
      type: 'text',
      group: 'hero',
      rows: 2,
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero carousel slides',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          name: 'slide',
          fields: [
            { name: 'mediaType', type: 'string', options: { list: ['image', 'video'] } },
            { name: 'url', type: 'url', title: 'Image or video URL' },
            { name: 'alt', type: 'string', title: 'Alt text (images)' },
          ],
          preview: {
            select: { mediaType: 'mediaType', url: 'url' },
            prepare({ mediaType, url }) {
              return { title: `${mediaType || 'media'}`, subtitle: url };
            },
          },
        },
      ],
    }),
    // How it works section
    defineField({
      name: 'howItWorksLabel',
      title: '"How it works" label',
      type: 'string',
      group: 'howItWorks',
      initialValue: 'How it works',
    }),
    defineField({
      name: 'howItWorksTitle',
      title: 'Section title',
      type: 'string',
      group: 'howItWorks',
    }),
    defineField({
      name: 'howItWorksDescription',
      title: 'Section description',
      type: 'text',
      group: 'howItWorks',
      rows: 3,
    }),
    defineField({
      name: 'howItWorksCtaText',
      title: 'CTA button text',
      type: 'string',
      group: 'howItWorks',
      initialValue: 'Start with AWEBO',
    }),
    defineField({
      name: 'howItWorksCtaLink',
      title: 'CTA link',
      type: 'string',
      group: 'howItWorks',
      initialValue: '/launch',
    }),
    // Ecosystem section
    defineField({
      name: 'ecosystemTitle',
      title: 'Ecosystem section title',
      type: 'string',
      group: 'ecosystem',
    }),
    defineField({
      name: 'ecosystemDescription',
      title: 'Ecosystem section description',
      type: 'text',
      group: 'ecosystem',
      rows: 2,
    }),
    defineField({
      name: 'ecosystemProductTitle',
      title: 'Featured product title',
      type: 'string',
      group: 'ecosystem',
    }),
    defineField({
      name: 'ecosystemProductDescription',
      title: 'Featured product description',
      type: 'text',
      group: 'ecosystem',
      rows: 2,
    }),
    defineField({
      name: 'ecosystemProductPrice',
      title: 'Featured product price',
      type: 'string',
      group: 'ecosystem',
    }),
    defineField({
      name: 'ecosystemProductImage',
      title: 'Featured product image',
      type: 'image',
      group: 'ecosystem',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ecosystemProductImageUrl',
      title: 'Or product image URL (if not using upload)',
      type: 'url',
      group: 'ecosystem',
      description: 'Override if you prefer an external URL',
    }),
    // CTA Banner
    defineField({
      name: 'ctaBannerTitle',
      title: 'CTA banner title',
      type: 'string',
      group: 'ctaBanner',
    }),
    defineField({
      name: 'ctaBannerDescription',
      title: 'CTA banner description',
      type: 'text',
      group: 'ctaBanner',
      rows: 2,
    }),
    defineField({
      name: 'ctaBannerBackgroundImage',
      title: 'CTA banner background image',
      type: 'image',
      group: 'ctaBanner',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaBannerBackgroundImageUrl',
      title: 'Or background image URL',
      type: 'url',
      group: 'ctaBanner',
    }),
    defineField({
      name: 'ctaBannerPrimaryText',
      title: 'Primary button text',
      type: 'string',
      group: 'ctaBanner',
      initialValue: 'Launch Brand',
    }),
    defineField({
      name: 'ctaBannerSecondaryText',
      title: 'Secondary button text',
      type: 'string',
      group: 'ctaBanner',
      initialValue: 'View Ecosystem',
    }),
    defineField({
      name: 'ctaBannerSecondaryLink',
      title: 'Secondary button link',
      type: 'string',
      group: 'ctaBanner',
      initialValue: '/ecosystem',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
