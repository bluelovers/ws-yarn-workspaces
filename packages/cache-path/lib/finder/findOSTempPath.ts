import { tmpdir } from "os";

/**
 * get os temp dir
 */
export function findOSTempPath(cwd?: string): string
{
	return tmpdir();
}
