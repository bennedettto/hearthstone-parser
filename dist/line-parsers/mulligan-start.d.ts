import { AbstractLineParser } from './AbstractLineParser';
import { GameState } from '../GameState';
export declare class MulliganStartLineParser extends AbstractLineParser {
    regex: RegExp;
    eventName: string;
    lineMatched(_parts: string[], gameState: GameState): void;
    formatLogMessage(_parts: string[], _gameState: GameState): string;
    shouldEmit(_gameState: GameState): boolean;
}
