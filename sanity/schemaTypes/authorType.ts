import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title / Role',
      type: 'string',
      description: '肩書きや役割（例: BTCインサイト編集長）',
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: '所属（例: Diamond Hands）',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: '任意: 拠点（例: Tokyo, JP）',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {title: 'URL', name: 'href', type: 'url'},
                  {title: 'Open in new tab', name: 'blank', type: 'boolean', initialValue: false},
                ],
              },
            ],
          },
        }),
      ],
      description: '150-300文字程度の略歴',
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise (topics)',
      type: 'array',
      of: [{type: 'string'}],
      description: '専門領域や扱うトピック（3〜6個程度）',
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements / Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: '受賞、登壇、出版、メディア掲載など',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [{type: 'string'}],
      description: '資格・肩書き（任意）',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'nostr', title: 'Nostr (npub/URL)', type: 'string', description: 'npub もしくは URL'},
        {name: 'x', title: 'X (Twitter)', type: 'string', description: 'URL または @なしのID'},
        {name: 'github', title: 'GitHub', type: 'string', description: 'URL またはユーザーID'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
