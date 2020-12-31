import { Event, Events, isErr, PreCommandRunPayload, UserError } from '@sapphire/framework';
import type { PieceContext } from '@sapphire/pieces';
import { SubberEvents } from '@sapphire/plugin-subber';

export interface PreSubcommandPayload extends PreCommandRunPayload {}

export class SubberEvent extends Event<SubberEvents.PreSubcommandRun> {

	public constructor(context: PieceContext) {
		super(context, { event: SubberEvents.PreSubcommandRun });
	}

	public async run({ message, command, parameters, context }: PreSubcommandPayload) {

		const { subcommand, args } = await this.context.subcommandsHandler.resolveSubcommand({ command, message, parameters });

		if (subcommand) {
			if (!subcommand.enabled) {
				message.client.emit(SubberEvents.SubcommandDenied, new UserError('SubcommandDisabled', 'This subcommand is disabled.'), {
					message,
					command,
					subcommand,
					parameters,
					context
				});
			}

			const result = await command.preconditions.run(message, subcommand);

			if (isErr(result)) {
				message.client.emit(SubberEvents.SubcommandDenied, result.error, {
					message,
					command,
					subcommand,
					parameters,
					context
				});

				if (this.context.subcommandsHandler.subberOptions.continueParent) {
					message.client.emit(Events.PreCommandRun, { message, command, parameters, context });
				}
			} else {
				message.client.emit(SubberEvents.SubcommandAccepted, {
					message,
					command,
					subcommand,
					args,
					parameters,
					context: { ...context, subcommandName: subcommand.name }
				});
			}

			return;
		}

		message.client.emit(Events.PreCommandRun, { message, command, parameters, context });
	}

}
