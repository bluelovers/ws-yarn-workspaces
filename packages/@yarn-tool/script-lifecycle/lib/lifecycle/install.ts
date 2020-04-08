/**
 * Created by user on 2020/4/8.
 */

export default {
	name: "install" as const,
	ignoreSelf: false,
	before: [
		"preinstall",
	],
	after: [
		"postinstall",
		"prepublish",
		"prepare",
		"preshrinkwrap",
		"shrinkwrap",
		"postshrinkwrap",
	],
}
