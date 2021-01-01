import { Collection } from 'discord.js';
import { SubberCommand } from './lib/structures/SubberCommand';
import { SubberOptions, SubcommandsHandler } from './lib/utils/SubcommandsHandler';

export * from './lib/structures/SubberCommand';
export * from './lib/utils/SubcommandsHandler';
export * from './lib/errors/SubberError';
export * from './lib/errors/SubcommandNotLoadedError';

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

export const main = () => 'this builds and pushes';
