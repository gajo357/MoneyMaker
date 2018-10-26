import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Game, Odds } from "./game";
import { GamesService } from "../games/games.service";
import { __await } from 'tslib';

@Component({
    selector: "ns-details",
    moduleId: module.id,
    styleUrls: ["./game-detail.component.css"],
    templateUrl: "./game-detail.component.html",
})
export class GameDetailComponent implements OnInit {
    game: Game;
    homeBet: number;
    drawBet: number;
    awayBet: number;

    private availableAmount: number;
    private gameLink: string;

    homeBooker: number
    drawBooker: number
    awayBooker: number

    constructor(private gamesService: GamesService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.gameLink = this.route.snapshot.params["gameLink"];

        this.gamesService.currentAmount.subscribe(a => this.availableAmount = a);
        
        this.setGame(this.gameLink);
    }

    async refresh() {
        try {
            await this.calculateBets();
        } catch(e) {
            alert(e);
        }
    }

    private setGame(gameLink) {
        this.game = this.gamesService.getGame(gameLink);
        
        this.homeBooker = this.game.homeOdd;
        this.drawBooker = this.game.drawOdd;
        this.awayBooker = this.game.awayOdd;
    }

    private async calculateBets() {
        const amounts = await this.gamesService.getAmounts(this.myOdds(), this.bookerOdds(), this.availableAmount);
        
        this.homeBet = amounts.home;
        this.drawBet = amounts.draw;
        this.awayBet = amounts.away;
    }

    betHome() {
        this.bet(this.homeBet);
    }
    betDraw() {
        this.bet(this.drawBet);
    }
    betAway() {
        this.bet(this.awayBet);
    }
    private bet(amountToBet) {
        this.gamesService.betOnGame(this.availableAmount - +amountToBet.toFixed(2), this.gameLink);
        this.router.navigate(["/games"]);
    }

    private myOdds(): Odds {
        return { 
            home: this.game.homeMeanOdd,
            draw: this.game.drawMeanOdd,
            away: this.game.awayMeanOdd
        }
    }
    private bookerOdds(): Odds {
        return { 
            home: this.homeBooker,
            draw: this.drawBooker,
            away: this.awayBooker
        }
    }
}
