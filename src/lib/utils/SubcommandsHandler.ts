import { CommandContext, CommandOptions, PreCommandRunPayload, SapphireClient } from '@sapphire/framework';
import { SubberCommand } from '../structures/SubberCommand';
import { Collection } from 'discord.js';
import { SubcommandNotLoadedError } from '../errors/SubcommandNotLoadedError';

export class SubcommandsHandler {

	private readonly kCommandOptions: Array<CommandOptions>;

	public constructor(private readonly client: SapphireClient) {
		this.client = client;
		this.kCommandOptions = [];
	}

	public storeOptions(options: CommandOptions) {
		this.kCommandOptions.push(options);
	}

	public get commandOptions() {
		return this.kCommandOptions;
	}

	public async resolveSubcommand({ command, message, parameters, context }: ResolveSubcommandPayload): Promise<ResolveSubcommandResult> {
		const args = await command.preParse(message, parameters);
		let subcommandFromArgs = await args.pickResult('string');
		let subcommand = undefined;
		do {
			if (!subcommandFromArgs.success || !command.subcommands) break;
			const soughtName = subcommandFromArgs.value.toLowerCase();

			subcommand = command.subcommands.find(c => c.name === soughtName || c.aliases.includes(soughtName));
			if (subcommand) {
				// TODO: resolving by function name inside class or separate class execute
				context.resolvedSubcommand = subcommand;
			}
		} while (subcommandFromArgs = await args.pickResult('string'));

		return { subcommand, context };
	}

	public bindSubcommandsFromOptions() {
		const { commands } = this.client;
		// Parsing subcommands from options after all commands instances was loaded
		for (const [name, command] of commands.entries()) {
			const commandOptions = commands.context.subcommandsHandler.commandOptions.find(opt => opt.name === name);
			if (!commandOptions || !commandOptions.subcommands?.length) continue;
			if (!command.subcommands) command.subcommands = new Collection();

			const subcommandNames = commandOptions.subcommands.map(s => s.name);
			for (const subcommandName of subcommandNames) {
				const subcommand = subcommandName && commands.get(subcommandName);
				if (!subcommand) throw new SubcommandNotLoadedError(subcommandName ?? '[empty name]', command.name);

				// TODO: solution with new preconditions
				// (this.preconditions as PreconditionContainerArray).add(new PreconditionContainerArray(subcommands.preconditions));

				// Setting up parent's preconditions to found subcommand
				subcommand.preconditions.entries.push(command.preconditions);

				command.subcommands.set(subcommandName as string, subcommand as SubberCommand);
			}
		}
	}

}

type ResolveSubcommandPayload = PreCommandRunPayload;
interface ResolveSubcommandResult {
	subcommand: SubberCommand | undefined;
	context: CommandContext;
}
