import { splitSmartly, EnumIncludeSeparatorMode } from 'split-smartly2';
import { reDoubleVerticalBar, reSpaces } from '../const';

export const splitDoubleVerticalBar = splitSmartly(reDoubleVerticalBar, {
	includeSeparatorMode: EnumIncludeSeparatorMode.INCLUDE_SEPARATOR_NONE,
	brackets: true,
}) as (str: string) => string[];

export const splitSpace = splitSmartly(reSpaces, {
	includeSeparatorMode: EnumIncludeSeparatorMode.INCLUDE_SEPARATOR_NONE,
	brackets: true,
}) as (str: string) => string[];
