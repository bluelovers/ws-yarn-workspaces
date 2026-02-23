import { ISimpleSemVer, ISimpleSemVerObject, ISimpleSemVerObjectBase } from "../../lib/types";


export interface IFixturesEntryCore<T>
{
	input: string;
	description?: string;
	expected?: T;
	reason?: string;
}

export interface IFixturesEntryMultipleVersionRange extends IFixturesEntryCore<Partial<ISimpleSemVerObjectBase>[]>
{

}

export interface IFixturesEntrySingleVersionRange extends IFixturesEntryCore<Partial<ISimpleSemVerObjectBase>>
{

}
