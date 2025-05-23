export { createPageContextServerSide }
export { createPageContextServerSideWithoutGlobalContext }
export type { PageContextCreatedServerSide }

import { assert, assertUsage, assertWarning, augmentType, normalizeHeaders, objectAssign } from '../utils.js'
import { getPageContextUrlComputed } from '../../../shared/getPageContextUrlComputed.js'
import type { GlobalContextServerInternal, GlobalContextServer } from '../globalContext.js'
import type { PageContextInit } from '../renderPage.js'
import { createPageContextShared } from '../../../shared/createPageContextShared.js'

type PageContextCreatedServerSide = Awaited<ReturnType<typeof createPageContextServerSide>>
async function createPageContextServerSide(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextServerInternal,
  globalObject_public: GlobalContextServer,
  {
    isPrerendering,
    ssr: { urlHandler, isClientSideNavigation } = {
      urlHandler: null,
      isClientSideNavigation: false
    }
  }:
    | {
        isPrerendering: false
        ssr: {
          urlHandler: null | ((url: string) => string)
          isClientSideNavigation: boolean
        }
      }
    | {
        isPrerendering: true
        ssr?: undefined
      }
) {
  assert(pageContextInit.urlOriginal)

  const pageContextCreated = createPageContext(pageContextInit, isPrerendering)

  objectAssign(pageContextCreated, {
    /* Don't spread globalContext for now? Or never spread it as it leads to confusion? The convenience isn't worth the added confusion?
    // We must use Flatten<T> otherwise TypeScript complains upon assigning types
    ...(globalContext as Flatten<typeof globalContext>), // least precedence
    */
    globalContext: globalObject_public,
    _globalContext: globalContext,
    // The following is defined on `pageContext` because we can eventually make these non-global
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    // TODO/now: add meta.default
    _includeAssetsImportedByServer: globalContext.config.includeAssetsImportedByServer ?? true,
    // TODO/soon: use GloablContext instead
    _pageFilesAll: globalContext._pageFilesAll,
    _pageConfigs: globalContext._pageConfigs,
    _pageConfigGlobal: globalContext._pageConfigGlobal,
    _allPageIds: globalContext._allPageIds,
    _pageRoutes: globalContext._pageRoutes,
    _onBeforeRouteHook: globalContext._onBeforeRouteHook,
    _pageContextInit: pageContextInit,
    _urlRewrite: null,
    _urlHandler: urlHandler,
    isClientSideNavigation
  })

  // pageContext.urlParsed
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  // pageContext.headers
  {
    let headers: null | Record<string, string>
    if (pageContextInit.headersOriginal) {
      headers = normalizeHeaders(pageContextInit.headersOriginal)
      assertUsage(
        !('headers' in pageContextInit),
        "You're defining pageContextInit.headersOriginal as well as pageContextInit.headers but you should only define pageContextInit.headersOriginal instead, see https://vike.dev/headers"
      )
    } else if (pageContextInit.headers) {
      headers = pageContextInit.headers as Record<string, string>
      // TODO/next-major-release: remove
      assertWarning(
        false,
        'Setting pageContextInit.headers is deprecated: set pageContextInit.headersOriginal instead, see https://vike.dev/headers',
        { onlyOnce: true }
      )
    } else {
      headers = null
    }
    objectAssign(pageContextCreated, { headers })
  }

  const pageContextAugmented = await createPageContextShared(pageContextCreated, globalContext._pageConfigGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
function createPageContextServerSideWithoutGlobalContext(pageContextInit: PageContextInit) {
  const pageContext = createPageContext(pageContextInit, false)
  return pageContext
}
function createPageContext(pageContextInit: PageContextInit | null, isPrerendering: boolean) {
  const pageContext = {
    isClientSide: false,
    isPrerendering
  }
  objectAssign(pageContext, pageContextInit)
  return pageContext
}

type Flatten<T> = Pick<T, keyof T>
