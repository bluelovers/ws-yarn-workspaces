/**
 * Created by user on 2020/4/8.
 */

export default {
	name: "publish" as const,
	ignoreSelf: false,
	before: [
		"prepublish",
		"prepare",
		"prepublishOnly",
		"prepack",
		"postpack",
	],
	after: [
		"postpublish"
	],
}
