// Utils needed by Vike's client runtime (with Client Routing)

// We call onLoad() here so that it's called even when only a subset of the runtime is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
import { onLoad } from './onLoad.js'
onLoad()

export * from '../../utils/assert.js'
export * from '../../utils/assertSingleInstance.js'
export * from '../../utils/getGlobalObject.js'
export * from '../../utils/hasProp.js'
export * from '../../utils/isBrowser.js'
export * from '../../utils/isCallable.js'
export * from '../../utils/isObject.js'
export * from '../../utils/isPlainObject.js'
export * from '../../utils/isReact.js'
export * from '../../utils/isSameErrorMessage.js'
export * from '../../utils/objectAssign.js'
export * from '../../utils/parseUrl.js'
export * from '../../utils/PromiseType.js'
export * from '../../utils/redirectHard.js'
export * from '../../utils/sleep.js'
export * from '../../utils/slice.js'
export * from '../../utils/throttle.js'
export * from '../../utils/assertRoutingType.js'
export * from '../../utils/onPageVisibilityChange.js'
export * from '../../utils/augmentType.js'
export * from '../../utils/PROJECT_VERSION.js'
export * from '../../utils/genPromise.js'
export * from '../../utils/catchInfiniteLoop.js'
