import { Plugin, postInitialization, postLogin, SapphireClient, SapphireClientOptions, Store } from '@sapphire/framework';
import { SubcommandsHandler } from './utils/SubcommandsHandler';
import { Collection } from 'discord.js';
import { SubberCommand } from './structures/SubberCommand';

export class Subber extends Plugin {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postInitialization](this: SapphireClient, options: SapphireClientOptions): void {
		Store.injectedContext.subcommandsHandler = new SubcommandsHandler(this);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postLogin](this: SapphireClient, _options: SapphireClientOptions): void {
		Store.injectedContext.subcommandsHandler.bindSubcommandsFromOptions();
	}

}
declare module '@sapphire/framework' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface CommandOptions {
		subcommands?: CommandOptions & {
			name: string;
		}[];
	}

	interface CommandContext {
		resolvedSubcommand?: SubberCommand;
	}

	interface Command {
		subcommands: Collection<string, SubberCommand> | undefined;
	}
}

declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		subcommandsHandler: SubcommandsHandler;
	}
}
