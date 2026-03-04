import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'appPage',
  title: 'App Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'grids', title: 'Projects / Grids' },
    { name: 'banner', title: 'Banner' },
    { name: 'featured', title: 'Featured content' },
    { name: 'cta', title: 'Call to action' },
  ],
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero logo image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Logo shown in the hero section on /app',
    }),
    defineField({
      name: 'projects',
      title: 'Projects (grid items)',
      type: 'array',
      group: 'grids',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Projects shown in horizontal and content grids. Order here controls display order.',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner image',
      type: 'image',
      group: 'banner',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bannerHeight',
      title: 'Banner height',
      type: 'string',
      group: 'banner',
      options: {
        list: [
          { title: 'Small (h-40)', value: 'h-40' },
          { title: 'Medium (h-48)', value: 'h-48' },
          { title: 'Large (h-56)', value: 'h-56' },
        ],
      },
      initialValue: 'h-40',
    }),
    defineField({
      name: 'featuredTitle',
      title: 'Featured section title',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'featuredDescription',
      title: 'Featured section description',
      type: 'text',
      group: 'featured',
      rows: 3,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      group: 'featured',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featuredCtaText',
      title: 'Featured CTA button text',
      type: 'string',
      group: 'featured',
    }),
    defineField({
      name: 'featuredCtaLink',
      title: 'Featured CTA link',
      type: 'url',
      group: 'featured',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Call to action title',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA button text',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA link',
      type: 'url',
      group: 'cta',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'App Page (/app)' };
    },
  },
});
