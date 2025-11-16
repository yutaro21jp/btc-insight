import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('tag').title('Tags'),
      S.documentTypeListItem('author').title('Authors'),
      S.listItem()
        .title('Unused Images')
        .child(
          S.documentTypeList('sanity.imageAsset')
            .title('Unused Images')
            .filter(
              '_type == "sanity.imageAsset" && count(*[!(_id in path("drafts.**")) && references(^._id)]) == 0',
            ),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'tag'].includes(item.getId()!),
      ),
    ])
