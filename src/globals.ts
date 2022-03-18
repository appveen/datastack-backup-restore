import { DataStack } from '@appveen/ds-sdk';
import { Logger } from 'log4js';

declare global {
	var logger: Logger;
	var dataStack: DataStack
}