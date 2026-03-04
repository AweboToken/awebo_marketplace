import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'phygitalItem',
  title: 'Phygital item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'meta',
      title: 'Meta (e.g. price)',
      type: 'string',
      description: 'e.g. "0.85 ETH"',
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
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'e.g. /explore',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Untitled', media };
    },
  },
});
