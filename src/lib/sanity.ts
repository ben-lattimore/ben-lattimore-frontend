import { createClient } from '@sanity/client'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: '9cci858w',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
