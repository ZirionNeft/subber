import { Args, CommandOptions, PreCommandRunPayload, PreconditionContainerArray, SapphireClient } from '@sapphire/framework';
import { SubberCommand } from '../structures/SubberCommand';
import { Collection } from 'discord.js';
import { SubcommandNotLoadedError } from '../errors/SubcommandNotLoadedError';
import { SubberOptions } from '../Subber';

export type ResolveSubcommandPayload = Omit<PreCommandRunPayload, 'context'>;
export interface ResolveSubcommandResult {
	args: Args;
	subcommand: SubberCommand | undefined;
}

export class SubcommandsHandler {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public readonly subberOptions: SubberOptions;

	private readonly kCommandOptions: Array<CommandOptions>;

	public constructor(private readonly client: SapphireClient, options: SubberOptions) {
		this.client = client;
		this.kCommandOptions = [];
		this.subberOptions = {
			continueParent: options?.continueParent ?? false,
			runParentAfterSubcommand: options?.runParentAfterSubcommand ?? false
		};
	}

	public storeOptions(options: CommandOptions) {
		this.kCommandOptions.push(options);
	}

	public get commandOptions() {
		return this.kCommandOptions;
	}

	public async resolveSubcommand({ command, message, parameters }: ResolveSubcommandPayload): Promise<ResolveSubcommandResult> {
		const args = await command.preParse(message, parameters);
		let subcommandFromArgs = await args.pickResult('string');
		let subcommand = undefined;
		do {
			if (!subcommandFromArgs.success || !command.subcommands) break;
			const soughtName = subcommandFromArgs.value.toLowerCase();

			subcommand = command.subcommands.find(c => c.name === soughtName || c.aliases.includes(soughtName));
		} while (subcommandFromArgs = await args.pickResult('string'));

		return { subcommand, args };
	}

	public bindSubcommandsFromOptions() {
		const { commands } = this.client;
		// Parsing subcommands from options after all commands instances was loaded
		for (const [name, command] of commands.entries()) {
			const commandOptions = commands.context.subcommandsHandler.commandOptions.find(opt => opt.name === name);
			if (!commandOptions || !commandOptions.subcommands?.length) continue;
			if (!command.subcommands) command.subcommands = new Collection();

			const subcommandNames = commandOptions.subcommands;
			for (const subcommandName of subcommandNames) {
				const subcommand = subcommandName && commands.get(subcommandName);
				if (!subcommand) throw new SubcommandNotLoadedError(subcommandName ?? '[empty name]', command.name);

				// Setting up parent's preconditions to found subcommand
				(subcommand.preconditions as PreconditionContainerArray).add(command.preconditions);

				command.subcommands.set(subcommandName as string, subcommand as SubberCommand);
			}
		}
	}

}
