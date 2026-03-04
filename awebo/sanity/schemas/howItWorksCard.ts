import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'howItWorksCard',
  title: 'How it works card',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Card title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'designation',
      title: 'Designation / subtitle',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
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
      name: 'order',
      title: 'Display order',
      type: 'number',
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { name: 'name', media: 'image' },
    prepare({ name, media }) {
      return { title: name || 'Untitled card', media };
    },
  },
});
