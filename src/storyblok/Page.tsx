import * as React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import Footer from '../components/Footer'
import type { PageContent } from '../content'
import Content from './Content'

export type PageProps = {
  blok: PageContent
}

function Page(props: PageProps) {
  return (
    <div
      className="flex flex-col items-stretch"
      {...storyblokEditable(props.blok)}
    >
      {/* AppBar is rendered globally in src/app/layout.tsx; remove local AppBar here to avoid duplicate headers */}
      {props.blok.body?.map((content, index) => (
        <Content
          blok={content}
          key={index}
        />
      ))}
      <Footer />
    </div>
  )
}

export default Page
