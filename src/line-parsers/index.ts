import {GameOverLineParser} from './game-over';
import {GameStartLineParser} from './game-start';
import {GameTagChangeLineParser} from './game-tag-change';
import {NewPlayerLineParser} from './new-player';
import {TurnLineParser} from './turn';
import {ZoneChangeLineParser} from './zone-change';
import {TagChangeLineParser} from './tag-change';
import {GameState} from '../GameState';
import {CombatStartsParser} from './combat-starts';
import {CombatEndsParser} from './combat-ends';
import {HeroAttackParser} from './hero-attack';
import {MulliganStartParser} from './mulligan-start';
import {ChoiceIdParser} from './choice-id';
import {DiscoveryEndParser} from './discovery-end';
import {DiscoveryStartParser} from './discovery-start';
import {MullinganResultParser} from './mulligan-result';
import {TagUpdateParser} from './tag-update';

export const lineParsers = [
	new GameOverLineParser(),
	new GameStartLineParser(),
	new NewPlayerLineParser(),
	new TurnLineParser(),
	new ZoneChangeLineParser(),
	new CombatStartsParser(),
	new CombatEndsParser(),
	new HeroAttackParser(),
	new TagChangeLineParser(),
	new GameTagChangeLineParser(),
	new MulliganStartParser(),
	new ChoiceIdParser(),
	new DiscoveryStartParser(),
	new DiscoveryEndParser(),
	new MullinganResultParser(),
	new TagUpdateParser()
];

export interface Events {
	'gamestate-changed': GameState;
	'game-over': void;
	'game-start': void;
	'game-tag-change': void;
	'player-joined': void;
	'turn-change': void;
	'tag-change': void;
	'zone-change': void;
	'mulligan-start': void;
	'choice-id': void;
	'discovery-start': void;
	'discovery-end': void;
	'mulligan-result': void;
	'minion-update': void;
	'combat-starts': void;
	'combat-ends': void;
	'hero-attack': void;
}
