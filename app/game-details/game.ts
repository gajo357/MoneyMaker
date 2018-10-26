import { GameInfo } from '../games/game-info';

export interface Game extends GameInfo {
    sport: string, country: string, league: string,
    homeMeanOdd: number, drawMeanOdd: number, awayMeanOdd: number,
    homeOdd: number, drawOdd: number, awayOdd: number
}

export interface Odds {
    home: number, draw: number, away: number
}