import { useEffect } from 'react'

import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '@/lib/seo'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function SeoUpdater() {
  useEffect(() => {
    const url = `${SITE_URL}/`

    document.title = DEFAULT_TITLE
    upsertMeta('name', 'description', DEFAULT_DESCRIPTION)
    upsertMeta('property', 'og:title', DEFAULT_TITLE)
    upsertMeta('property', 'og:description', DEFAULT_DESCRIPTION)
    upsertMeta('property', 'og:url', url)
    upsertCanonical(url)
  }, [])

  return null
}
