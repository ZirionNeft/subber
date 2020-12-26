import { SubberError, SubberErrorType } from './SubberError';


/**
 * Describes a [[LoaderErrorType.EmptyModule]] loader error and adds a path for easy identification.
 */
export class SubcommandNotLoadedError extends SubberError {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly commandName: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly parentName: string;

	public constructor(commandName: string, parentName: string) {
		super(SubberErrorType.NotLoaded, `A subcommand for command ${parentName} with data '${commandName}' not loaded.`);
		this.commandName = commandName;
		this.parentName = parentName;
	}

}
