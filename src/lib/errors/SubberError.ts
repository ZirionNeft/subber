export const enum SubberErrorType {
	'NotLoaded'= 'NOT_LOADED'
}

/**
 * The UserError class to be emitted in the pieces.
 * @property name This will be `'UserError'` and can be used to distinguish the type of error when any error gets thrown
 */
export class SubberError extends Error {

	/**
	 * The type of the error that was thrown.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly type: SubberErrorType;

	/**
	 * Constructs an UserError.
	 * @param type The identifier, useful to localize emitted errors.
	 * @param message The error message.
	 */
	public constructor(type: SubberErrorType, message: string) {
		super(message);
		this.type = type;
	}

	public get name() {
		return `${super.name} [${this.type}]`;
	}

}
