import { Args, Command as BaseCommand, CommandOptions } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Collection, Message } from 'discord.js';

export abstract class SubberCommand<T = Args> extends BaseCommand<T> {

	public subcommands: Collection<string, SubberCommand> | undefined;

	/**
	 * @since 1.0.0
	 * @param context The context.
	 * @param options Optional Command settings.
	 */
	protected constructor(context: PieceContext, { name, subcommands, ...options }: CommandOptions = {}) {
		const pieceName = (name ?? context.name).toLowerCase();
		super(context, { ...options, name: pieceName });

		this.context.subcommandsHandler.storeOptions({ ...options, name: pieceName, subcommands: subcommands ?? [] });
	}

	/**
	 * The pre-parse method. This method can be overriden by plugins to define their own argument parser.
	 * @param message The message that triggered the command.
	 * @param parameters The raw parameters as a single string.
	 */
	public async preParse(message: Message, parameters: string): Promise<T> {
		const args = await super.preParse(message, parameters);
		// Picking out subcommand from core command arguments
		if (args instanceof Args) {
			await args.pickResult('string');
		}

		return args;
	}

}
