// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'
import { Layout } from './Layout'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page, pageProps } = pageContext

  const page = (
    <Layout pageContext={pageContext}>
      <Page {...pageProps} />
    </Layout>
  )

  // Streaming is optional and we can use renderToString() instead
  const stream = await renderToStream(page, { userAgent: pageContext.headers['user-agent'] })

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`
}
