import { Result } from 'npm-package-arg';
export interface IParseNameAndVersion extends Pick<Result, 'type' | 'raw'> {
    name: string;
    version: string;
    semver: string;
}
