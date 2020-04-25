import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if a card is changing tags.
export class CombatEndsParser extends AbstractLineParser {
	
	private _shouldEmit = false;
	
  //regex = /GameState\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=BOARD_VISUAL_STATE value=1/;			// works ok, but tooo soon
  //regex = /GameState\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=STEP value=MAIN_NEXT/;						// does not work
  regex = /PowerTaskList\.DebugPrintPower\(\)\s*TAG_CHANGE Entity=GameEntity tag=STEP value=MAIN_READY/;


  eventName = 'combat-ends' as const;

  lineMatched(parts: string[], gameState: GameState): void {
  	//this._shouldEmit = gameState.inCombat;
  	gameState.inCombat = false;
  }

  formatLogMessage(): string {
    return 'combat ends';
  }

  shouldEmit(gameState: GameState): boolean {
  	return true;
  	//this._shouldEmit = !this._shouldEmit;
    //return !this._shouldEmit;
  }
}