/**
 * Created by user on 2020/4/8.
 */

export default {
	name: "pack" as const,
	ignoreSelf: true,
	before: [
		"prepublish",
		"prepare",
		"prepack",
	],
	after: [
		"postpack"
	],
}
