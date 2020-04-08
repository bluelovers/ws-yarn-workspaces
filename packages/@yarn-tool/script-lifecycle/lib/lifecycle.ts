
import install from './lifecycle/install'
import pack from './lifecycle/pack'
import publish from './lifecycle/publish'

export const lifecycleMap = {
	install,
	pack,
	publish
}
export default lifecycleMap
