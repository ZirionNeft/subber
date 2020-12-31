declare module '@sapphire/plugin-subber' {

	export const enum SubberEvents {
		PreSubcommandRun = 'preCommandRun',
		SubcommandDenied = 'subCommandDenied',
		SubcommandAccepted = 'subcommandAccepted',
		SubcommandRun = 'subcommandRun',
		SubcommandSuccess = 'subcommandSuccess',
		SubcommandError = 'subcommandError',
		SubcommandFinish = 'subcommandFinish'
	}
}
