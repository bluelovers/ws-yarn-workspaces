import { tmpdir } from "os";

/**
 * get os temp dir
 */
export function findOSTempPath(cwd?: string, processEnv = process.env): string
{
	return tmpdir();
}
