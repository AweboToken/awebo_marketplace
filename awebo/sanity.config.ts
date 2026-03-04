import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'awebo',
  title: 'AWEBO CMS',
  basePath: '/studio',
  projectId: projectId || 'placeholder',
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('App Page')
              .child(
                S.document().schemaType('appPage').documentId('appPage')
              ),
            S.listItem()
              .title('Home Page')
              .child(
                S.document().schemaType('homePage').documentId('homePage')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('topCreator').title('Top Creators'),
            S.documentTypeListItem('trustedByPartner').title('Trusted by partners'),
            S.documentTypeListItem('phygitalItem').title('Phygital items'),
            S.documentTypeListItem('howItWorksCard').title('How it works cards'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
