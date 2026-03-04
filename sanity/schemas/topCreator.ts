import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'topCreator',
  title: 'Top Creator',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageUrl',
      title: 'Or image URL',
      type: 'url',
      description: 'Use if image is hosted externally',
    }),
    defineField({
      name: 'statsLabel',
      title: 'Stats label',
      type: 'string',
      description: 'e.g. "Volume"',
    }),
    defineField({
      name: 'statsValue',
      title: 'Stats value',
      type: 'string',
      description: 'e.g. "12.4 ETH"',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { name: 'name', media: 'image' },
    prepare({ name, media }) {
      return { title: name || 'Untitled creator', media };
    },
  },
});
