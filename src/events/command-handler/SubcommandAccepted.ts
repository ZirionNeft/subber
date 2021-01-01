import { Args, CommandAcceptedPayload, Event, Events, PieceContext } from '@sapphire/framework';
import { SubberCommand } from '../../lib/structures/SubberCommand';
import { SubberEvents } from '../../lib/utils/SubcommandsHandler';

export interface SubcommandAcceptedPayload extends CommandAcceptedPayload {
	subcommand: SubberCommand;
	args: Args;
}

export default class SubberEvent extends Event<SubberEvents.SubcommandAccepted> {

	public constructor(context: PieceContext) {
		super(context, { event: SubberEvents.SubcommandAccepted });
	}

	public async run({ message, command, parameters, context, subcommand, args }: SubcommandAcceptedPayload) {
		const options = this.context.subcommandsHandler.subberOptions;
		try {
			message.client.emit(SubberEvents.SubcommandRun, message, command, subcommand);
			const result = await subcommand.run(message, args, context);
			message.client.emit(SubberEvents.SubcommandSuccess, { message, command, subcommand, result, parameters });
		} catch (error) {
			message.client.emit(SubberEvents.SubcommandError, error, { piece: subcommand, message });
			if (!options.runParentAfterSubcommand && options.continueParent) {
				delete context.subcommandName;
				message.client.emit(Events.PreCommandRun, { message, command, parameters, context });
			}
		} finally {
			message.client.emit(SubberEvents.SubcommandFinish, message, subcommand);
			if (options.runParentAfterSubcommand) {
				message.client.emit(Events.PreCommandRun, { message, command, parameters, context });
			}
		}
	}

}
