import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GameInfo } from "./game-info";
import { Game, Odds } from '../game-details/game';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../config';

@Injectable()
export class GamesService {
    private games: Game[];
    private fixedGames = new Array<GameInfo>(
        { gameLink: 'http://www.oddsportal.com/soccer/romania/liga-1/din-bucuresti-sepsi-QH8qfItJ/', homeTeam: 'Din. Bucuresti', awayTeam: 'Sepsi', date: new Date('09/28/2018 20:00') },
        { gameLink: 'http://www.oddsportal.com/soccer/germany/bundesliga/hertha-berlin-bayern-munich-fkjKsmik/', homeTeam: 'Hertha Berlin', awayTeam: 'Bayern Munich', date: new Date('09/28/2018 20:30') },
        { gameLink: 'http://www.oddsportal.com/soccer/poland/ekstraklasa/legia-arka-gdynia-GrytVUNt/', homeTeam: 'Legia', awayTeam: 'Arka Gdynia', date: new Date('09/28/2018 20:30') },
    );

    private gamesBeh = new BehaviorSubject<Game[]>([]);
    currentGames = this.gamesBeh.asObservable();

    private downloadingGames = new BehaviorSubject<boolean>(false);
    currentDownloadingGames = this.downloadingGames.asObservable();

    private amount = new BehaviorSubject<number>(500);
    currentAmount = this.amount.asObservable();

    private margin = new BehaviorSubject<number>(0.02);
    currentMargin = this.margin.asObservable();
    
    private minutes = new BehaviorSubject<number>(30);
    currentMinutes = this.minutes.asObservable();

    constructor(private http: HttpClient) {
        this.currentGames.subscribe(games => this.games = games);
    }

    async downloadGames(count: number): Promise<void> {
        try {
            this.downloadingGames.next(true);

            const response = await this.http.get<Game[]>(
                Config.apiUrl + "api/getGames/" + count,
                { headers: this.getCommonHeaders() }
            ).toPromise();
            
            this.gamesBeh.next(response);
            // this.gamesBeh.next(this.fixedGames);
            // return new Promise(r => r());
        } finally {
            this.downloadingGames.next(false);
        }
    }

    getGame(gameLink: string): Game {
        return this.games.find(g => g.gameLink === gameLink);
    }

    async getAmounts(myOdds, bookerOdds, amount): Promise<Odds> {
        return await this.http.post<Odds>(
            Config.apiUrl + "api/CalculateAmounts",
            { 
                Amount: amount,
                MyOdds: myOdds,
                BookerOdds: bookerOdds 
            },
            { headers: this.getCommonHeaders() }
        ).toPromise();
    }

    private getCommonHeaders() {
        return new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", Config.token);
    }

    setAmount(amount) {
        this.amount.next(amount);
    }
    setMargin(margin) {
        this.margin.next(margin);
    }
    setMinutes(minutes) {
        this.minutes.next(minutes);
    }

    betOnGame(newAmount, gameLink) {
        this.setAmount(newAmount);
        this.gamesBeh.next(this.games.filter(g => g.gameLink !== gameLink));
    }
}
