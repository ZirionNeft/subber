import { Plugin, postInitialization, postLogin, SapphireClient, SapphireClientOptions, Store } from '@sapphire/framework';
import { SubcommandsHandler } from './utils/SubcommandsHandler';
import { Collection } from 'discord.js';
import { SubberCommand } from './structures/SubberCommand';

export class Subber extends Plugin {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postInitialization](this: SapphireClient, options: SapphireClientOptions): void {
		Store.injectedContext.subcommandsHandler = new SubcommandsHandler(this, options.subber ?? {});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postLogin](this: SapphireClient, _options: SapphireClientOptions): void {
		Store.injectedContext.subcommandsHandler.bindSubcommandsFromOptions();
	}

}
declare module '@sapphire/framework' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface CommandOptions {
		subcommands?: string[];
	}

	interface CommandContext {
		subcommandName?: string;
	}

	interface Command {
		subcommands: Collection<string, SubberCommand> | undefined;
	}

	interface SapphireClientOptions {
		subber?: SubberOptions;
	}
}

export interface SubberOptions {
	/**
	 * Continue execution of parent command if command is disabled or error occurred
	 * @since 1.0.0
	 * @default false
	 */
	continueParent?: boolean;

	/**
	 * Run parent command when subcommand execution was ended
	 * @since 1.0.0
	 * @default false
	 */
	runParentAfterSubcommand?: boolean;
}


declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		subcommandsHandler: SubcommandsHandler;
	}
}
