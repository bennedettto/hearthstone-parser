import {AbstractLineParser} from './AbstractLineParser';
import {GameState} from '../GameState';

// Check if a card is changing tags.
export class CombatEndsParser extends AbstractLineParser {

  private _shouldEmit = false;

  regex = /.*/;
  regex1 = /GameState\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=BOARD_VISUAL_STATE value=1/;      // works ok, but tooo soon
  regex2 = /GameState\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=STEP value=MAIN_NEXT/;            // does not work
  regex3 = /PowerTaskList\.DebugPrintPower\(\) -\s*TAG_CHANGE Entity=GameEntity tag=STEP value=MAIN_READY/;

  eventName = 'combat-ends' as const;

  lineMatched(parts: string[], gameState: GameState): void {
    this._shouldEmit = gameState.inCombat;
    gameState.inCombat = false;
  }

  formatLogMessage(): string {
    return 'combat ends';
  }

  parseLine(line: string): any {
    let x: any;
    if (x = this.regex1.exec(line)) {
      console.log("combat ends (1)");
      return x; // eslint-disable-line
    }
    if (x = this.regex2.exec(line)) {
      console.log("combat ends (2)");
      return x; // eslint-disable-line
    }
    if (x = this.regex3.exec(line)) {
      console.log("combat ends (3)");
      return x; // eslint-disable-line
    }
  }

  shouldEmit(gameState: GameState): boolean {
	// if (this._shouldEmit) {
	// 	this._shouldEmit = false;
	// 	return true;
	// }
	// return false;
    return true;
  }
}
