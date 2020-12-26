import { PreCommandRunPayload, CommandOptions, CommandContext } from '@sapphire/framework';
import { SubberCommand } from '../structures/SubberCommand';

export class SubcommandsHandler {


	private readonly kCommandOptions: Array<CommandOptions>;

	public constructor() {
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

}

type ResolveSubcommandPayload = PreCommandRunPayload;
interface ResolveSubcommandResult {
	subcommand: SubberCommand | undefined;
	context: CommandContext;
}
