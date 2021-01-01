import { Plugin, postInitialization, postLogin, SapphireClient, Store } from '@sapphire/framework';
import { SubberOptions, SubcommandsHandler } from './lib/utils/SubcommandsHandler';
import { join } from 'path';
import { ClientOptions, Collection } from 'discord.js';
import { SubberCommand } from './lib/structures/SubberCommand';

export class Subber extends Plugin {

	public static [postInitialization](this: SapphireClient, options: ClientOptions): void {
		Store.injectedContext.subcommandsHandler = new SubcommandsHandler(this, options.subber ?? {});
		this.events.registerPath(join(__dirname, 'events'));
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postLogin](this: SapphireClient, _options: ClientOptions): void {
		Store.injectedContext.subcommandsHandler.bindSubcommandsFromOptions();
	}

}

declare module '@sapphire/framework' {
	export interface CommandOptions {
		subcommands?: string[];
	}

	export interface CommandContext {
		subcommandName?: string;
	}

	export interface Command {
		subcommands: Collection<string, SubberCommand> | undefined;
	}

	export interface SapphireClientOptions {
		subber?: SubberOptions;
	}
}

declare module '@sapphire/pieces' {
	export interface PieceContextExtras {
		subcommandsHandler: SubcommandsHandler;
	}
}

SapphireClient.plugins.registerPostInitializationHook(Subber[postInitialization], 'SubberPostInitialization');
SapphireClient.plugins.registerPostLoginHook(Subber[postLogin], 'SubberPostLogin');
