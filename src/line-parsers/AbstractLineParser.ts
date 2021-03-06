import {GameState} from '../GameState';
import * as debug from 'debug';
import {Events} from './index';

export abstract class AbstractLineParser {
	abstract readonly regex: RegExp;

	abstract readonly eventName: keyof Events;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	private _logger: debug.IDebugger;

	get logger(): debug.IDebugger {
		if (!this._logger) {
			this._logger = debug(`hlp:${this.eventName}`);
		}

		return this._logger;
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	parseLine(line: string): RegExpExecArray | null {
		return this.regex.exec(line);
	}

	abstract lineMatched(parts: string[], gameState: GameState): void;

	abstract formatLogMessage(parts: string[], gameState: GameState): string | false;

	abstract shouldEmit(gameState: GameState): boolean;
}
