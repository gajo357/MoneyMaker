import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Game } from "./game";
import { GamesService } from "../games/games.service";

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
    private margin: number;
    private gameLink: string;

    private _homeBooker: number
    get homeBooker() { return this._homeBooker; }
    set homeBooker(value) { this._homeBooker = value; this.calculateHomeBet(); }

    private _drawBooker: number
    get drawBooker() { return this._drawBooker; }
    set drawBooker(value) { this._drawBooker = value; this.calculateDrawBet(); }
    
    private _awayBooker: number
    get awayBooker() { return this._awayBooker; }
    set awayBooker(value) { this._awayBooker = value; this.calculateAwayBet(); }

    constructor(private gamesService: GamesService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.gameLink = this.route.snapshot.params["gameLink"];

        this.gamesService.currentAmount.subscribe(a => this.availableAmount = a);
        this.gamesService.currentMargin.subscribe(s => this.margin = s);
        
        this.refreash();
    }

    async refreash() {
        await this.setGame(this.gameLink);
    }
    private async setGame(gameLink) {
        this.game = await this.gamesService.getGame(gameLink);
        this.homeBooker = this.game.homeOdd;
        this.drawBooker = this.game.drawOdd;
        this.awayBooker = this.game.awayOdd;
    }

    private calculateAwayBet() {
        this.awayBet = this.calculateAmountToBet(this.game.awayMeanOdd, this.awayBooker);
    }
    private calculateDrawBet() {
        this.drawBet = this.calculateAmountToBet(this.game.drawMeanOdd, this.drawBooker);
    }
    private calculateHomeBet() {
        this.homeBet = this.calculateAmountToBet(this.game.homeMeanOdd, this.homeBooker);
    }

    calculateAmountToBet(myOdd, bookerOdd) {
        return this.getAmountToBet(this.margin, this.availableAmount, myOdd, bookerOdd)
    }

    kelly(myOdd: number, bookerOdd: number): number { 
        if (myOdd == 0) {
            return 0;
        }
        if (bookerOdd == 1)  {
            return 0;
        }
        
        return (bookerOdd/myOdd - 1) / (bookerOdd - 1);
    }
    moneyToBet(kelly: number, amount: number): number {
        let m = kelly * amount;
        if (m < 2)
            return 2;
        return m;
    }
    getAmountToBet(maxPercent: number, amount: number, myOdd: number, bookerOdd: number) {
        let k = this.kelly(myOdd, bookerOdd);
        if (k > 0 && k <= maxPercent)
            return this.moneyToBet(k, amount);
        return 0;
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
}
