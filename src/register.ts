import { postInitialization, postLogin, SapphireClient } from '@sapphire/framework';
import { Subber } from './index';

SapphireClient.plugins.registerPostInitializationHook(Subber[postInitialization], 'SubberPostInitialization');
SapphireClient.plugins.registerPostLoginHook(Subber[postLogin], 'SubberPostLogin');

export * from './index';
