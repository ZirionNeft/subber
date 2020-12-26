import { Event, Events, isErr, PreCommandRunPayload, UserError } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';

export class CoreEvent extends Event<Events.PreCommandRun> {

	public constructor(context: PieceContext) {
		super(context, { event: Events.PreCommandRun });
	}

	public async run({ message, command, parameters, context }: PreCommandRunPayload) {

		const subcommandResult = await this.context.subcommandsHandler.resolveSubcommand({ command, message, parameters, context });

		if (!command.enabled || (subcommandResult.subcommand && !subcommandResult.subcommand.enabled)) {
			message.client.emit(Events.CommandDenied, new UserError('CommandDisabled', 'This command is disabled.'), {
				message,
				command: (subcommandResult.subcommand ? subcommandResult.subcommand : command),
				parameters,
				context
			});
			return;
		}

		const result = await command.preconditions.run(message, subcommandResult.subcommand ?? command);

		if (isErr(result)) {
			message.client.emit(Events.CommandDenied, result.error, {
				message,
				command,
				parameters,
				context
			});
		} else {
			message.client.emit(Events.CommandAccepted, {
				message,
				command,
				parameters,
				context
			});
		}
	}

}
