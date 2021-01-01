import { Args, Command as BaseCommand, CommandOptions } from '@sapphire/framework';
import { PieceContext } from '@sapphire/pieces';
import { Collection } from 'discord.js';

export abstract class SubberCommand<T = Args> extends BaseCommand<T> {

	public subcommands: Collection<string, SubberCommand> | undefined;

	/**
	 * @since 1.0.0
	 * @param context The context.
	 * @param options Optional Command settings.
	 */
	protected constructor(context: PieceContext, { name, ...options }: CommandOptions = {}) {
		const pieceName = (name ?? context.name).toLowerCase();
		super(context, { ...options, name: pieceName });

		this.context.subcommandsHandler.storeOptions({ ...options, name: pieceName, subcommands: options?.subcommands ?? [] });
	}

}
