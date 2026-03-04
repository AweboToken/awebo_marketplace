import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'trustedByPartner',
  title: 'Trusted by partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoUrl',
      title: 'Or logo URL',
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
    select: { name: 'name', media: 'logo' },
    prepare({ name, media }) {
      return { title: name || 'Untitled partner', media };
    },
  },
});
