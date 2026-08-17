import { getStoryPath } from '@/delivery-api'
import {
  BridgeSearchParams,
  parseBridgeSearchParams,
} from '@/BridgeSearchParams'
import {
  array,
  formatResult,
  object,
  parseString,
  withDefault,
} from 'pure-parse'
import { notFound } from 'next/navigation'
import { getStoryblokApi } from '@/lib/storyblok'
import { StoryblokStory } from '@storyblok/react/rsc'
// Parsing: uncomment the lines below to perform runtime validation of the story content
// import { parseContent } from '@/content'

const resolveRelations = ['teamMembers.teamMembers']

type DynamicPageProps = {
  params: Promise<unknown>
  searchParams: Promise<unknown>
}

const parseParams = object<{ slugs: string[] }>({
  slugs: withDefault(array(parseString), []),
})

/**
 * Fetch a story from the Storyblok delivery API.
 * @throws an error if the story could not be fetched or parsed.
 * @param slugs an array of the path segments of the current page
 * @param bridgeSearchParams an object containing the parsed search parameters from the Storyblok bridge
 */
const getStory = async (
  slugs: string[],
  bridgeSearchParams: BridgeSearchParams,
) => {
  const client = getStoryblokApi()

  return await client
    .get(`cdn/stories/${getStoryPath(slugs, bridgeSearchParams)}`, {
      resolve_relations: resolveRelations,
      version: bridgeSearchParams.version,
      // To support internationalization in production, you'll want to adjust this;
      //  for example, by parsing the language code from the path.
      language:
        bridgeSearchParams.version === 'draft'
          ? bridgeSearchParams._storyblok_lang
          : 'default',
    })
    .then((result) => result.data)
    .catch((error: { status: number; message: string }) => {
      if (error.status === 404) {
        notFound()
      }
      throw new Error(`Failed to fetch story: ${error.status} ${error.message}`)
    })
}

export default async function DynamicPage(props: DynamicPageProps) {
  const paramsResult = parseParams(await props.params)

  if (paramsResult.error) {
    throw new Error(
      `Failed to parse params: the folders in the app directory are likely misconfigured ${formatResult(paramsResult)}`,
    )
  }

  const bridgeSearchParams = parseBridgeSearchParams(await props.searchParams)

  const { story } = await getStory(paramsResult.value.slugs, bridgeSearchParams)

  // Remove any navigation blocks from the story content so the global AppBar/Layout provides the header
  const sanitizedStory = (() => {
    if (!story || !story.content) return story
    const content = story.content as { body?: unknown }
    const body = Array.isArray(content.body)
      ? content.body.filter((b) => {
          if (typeof b === 'object' && b !== null) {
            const comp = (b as Record<string, unknown>)['component']
            return comp !== 'navigation'
          }
          return true
        })
      : content.body

    return { ...story, content: { ...content, body } }
  })()

  return (
    <StoryblokStory
      story={sanitizedStory as unknown as Record<string, unknown>}
      bridgeOptions={{
        resolveRelations,
      }}
    />
  )
}
