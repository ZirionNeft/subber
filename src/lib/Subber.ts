import {
	Plugin,
	postInitialization,
	postLogin,
	SapphireClient,
	SapphireClientOptions,
	Store
} from '@sapphire/framework';
import { SubcommandsHandler } from './utils/SubcommandsHandler';
import { Collection } from 'discord.js';
import { SubberCommand } from './structures/SubberCommand';
import { SubcommandNotLoadedError } from './errors/SubcommandNotLoadedError';

export class Subber extends Plugin {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static [postInitialization](this: SapphireClient, options: SapphireClientOptions): void {
		Store.injectedContext.subcommandsHandler = new SubcommandsHandler();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static async [postLogin](this: SapphireClient, _options: SapphireClientOptions): Promise<void> {
		// Parsing subcommands from options after all commands instances was loaded
		for await (const [name, command] of this.commands.entries()) {
			const commandOptions = this.commands.context.subcommandsHandler.commandOptions.find(opt => opt.name === name);
			if (!commandOptions || !commandOptions.subcommands?.length) continue;
			if (!command.subcommands) command.subcommands = new Collection();

			const subcommandNames = commandOptions.subcommands.map(s => s.name);
			for (const subcommandName of subcommandNames) {
				const subcommand = subcommandName && this.commands.get(subcommandName) as SubberCommand;
				if (!subcommand) throw new SubcommandNotLoadedError(subcommandName ?? '', command.name);
				command.subcommands.set(subcommandName as string, subcommand);
			}
		}
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
		parentCommand?: SubberCommand;
	}
}

declare module '@sapphire/pieces' {
	interface PieceContextExtras {
		subcommandsHandler: SubcommandsHandler;
	}
}
