import {
  ConstructionOutlined,
  GavelOutlined,
  PlayArrowRounded,
  PublishedWithChangesOutlined
} from '@mui/icons-material';

const doc = {
  version: '0.1',
  sections: [
    {
      name: 'Setting Up Your Search Studio',
      icon: PlayArrowRounded,
      url: 'setup',
      sections: [
        {
          name: 'Data Management',
          url: 'data-management',
          description: 'Learn how to manage your data in Search Studio',
          headings: [
            {
              name: 'SFTP your data to Search Studio',
              content: '/settingup/datamanagement/sftp.md'
            },
            {
              name: 'Use data connectors for delta update',
              content: '/settingup/datamanagement/dataconnectors.md'
            },
            {
              name: 'Benefits of Using Usecases',
              content: '/settingup/datamanagement/usecases.md'
            }
          ]
        },
        {
          name: 'Exploring the Search',
          description: 'Learn how to explore the search engine in Search Studio',
          url: 'explore',
          headings: [
            {
              name: 'Creating an Index',
              content: '/settingup/exploringsearch/creatingindex.md'
            },
            {
              name: 'Uploading Data to Index',
              content: '/settingup/exploringsearch/uploadingdata.md'
            },
            {
              name: 'Managing Data Updates and Deltas',
              content: '/settingup/exploringsearch/dataupdates.md'
            }
          ]
        }
      ]
    },

    {
      name: 'Configuration',
      icon: ConstructionOutlined,
      url: 'configuration',
      sections: [
        {
          name: 'Attributes',
          url: 'attributes',
          description:
            'Configure searchable attributes, facets, and filters to refine search results and improve user experience.',
          headings: [
            {
              name: 'Searchable Attributes',
              content: '/configuration/attributes/searchable-attributes.md'
            },
            {
              name: 'Facets and Filters',
              content: '/configuration/attributes/facets-filters.md'
            }
          ]
        },
        {
          name: 'Stop & Optional Words',
          url: 'stop-optional-words',
          description: 'Optimize search performance by managing stop words and optional keywords.',
          headings: [
            {
              name: 'Stop Words',
              content: '/configuration/stop-optional-words/stop-words.md'
            },
            {
              name: 'Optional Words',
              content: '/configuration/stop-optional-words/optional-words.md'
            }
          ]
        },
        {
          name: 'Domain Dictionary',
          url: 'domain-dictionary',
          description:
            'Define domain-specific terminology to enhance search precision and relevance.',
          headings: [
            {
              name: 'Managing Domain Dictionary',
              content: '/configuration/domain-dictionary/manage-dictionary.md'
            }
          ]
        }
      ]
    },
    {
      name: 'Business Rules',
      icon: GavelOutlined,
      url: 'business-rules',
      sections: [
        {
          name: 'Trigger',
          url: 'trigger',
          description: 'Learn about triggers in Search Studio and how they affect search behavior',
          headings: [
            {
              name: 'What is Trigger?',
              content: '/businessrules/trigger/what-is-trigger.md'
            },
            {
              name: 'How to set the Trigger?',
              content: '/businessrules/trigger/how-to-set-trigger.md'
            },
            {
              name: 'When to use the Trigger?',
              content: '/businessrules/trigger/when-to-use-trigger.md'
            }
          ]
        },
        {
          name: 'Consequences',
          url: 'consequences',
          description:
            'Learn about consequences in Search Studio and how they affect search behavior.',
          headings: [
            {
              name: 'Introduction',
              content: '/businessrules/consequence/introduction.md'
            },
            {
              name: 'All Available Consequences',
              content: '/businessrules/consequence/all.md'
            }
          ]
        },
        {
          name: 'Pin Products',
          url: 'pin',
          description: 'Learn about Pinning in Search Studio and how they affect search behavior.',
          headings: [
            {
              name: 'Content',
              content: '/businessrules/pin/content.md'
            }
          ]
        },
        {
          name: 'Hide Products',
          url: 'hide',
          description: 'Learn about Hiding in Search Studio and how they affect search behavior.',
          headings: [
            {
              name: 'Content',
              content: '/businessrules/hide/content.md'
            }
          ]
        },
        {
          name: 'Boost & Bury Products',
          url: 'boost-bury',
          description:
            'Learn about boosting & burying in Search Studio and how they affect search behavior.',
          headings: [
            {
              name: 'Content',
              content: '/businessrules/boostbury/content.md'
            }
          ]
        },
        {
          name: 'Filter Products',
          url: 'boost-bury',
          description:
            'Learn about filtering in Search Studio and how they affect search behavior.',
          headings: [
            {
              name: 'Content',
              content: '/businessrules/filter/content.md'
            }
          ]
        }
      ]
    },
    {
      // data ingestion
      name: 'Data Ingestion',
      icon: PublishedWithChangesOutlined,
      url: 'data-ingestion',
      sections: [
        {
          name: 'Basics',
          url: 'basics',
          description: 'Learn about data ingestion in Search Studio',
          headings: [
            {
              name: 'What is Data Ingestion?',
              content: '/dataingestion/introduction/what-is-data-ingestion.md'
            },
            {
              name: 'Why Data Ingestion?',
              content: '/dataingestion/introduction/why-data-ingestion.md'
            },
            {
              name: 'How Data Ingestion Works?',
              content: '/dataingestion/introduction/how-data-ingestion-works.md'
            }
          ]
        },
        // schena
        {
          name: 'API & Schema',
          url: 'schema',
          description: 'Learn about schema in Search Studio',
          headings: [
            {
              name: 'API Redocs',
              content: '/dataingestion/schema/apidocs.md'
            },
            {
              name: 'Schema',
              content: '/dataingestion/schema/schema.md'
            }
          ]
        }
      ]
    }
  ]
};
export default doc;
