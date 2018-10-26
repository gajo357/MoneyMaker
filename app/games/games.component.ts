import { Component, OnInit } from "@angular/core";

import { GameInfo } from "~/games/game";
import { GamesService } from "~/games/games.service";

@Component({
    selector: "ns-games",
    moduleId: module.id,
    templateUrl: "./games.component.html",
})
export class GamesComponent implements OnInit {
    games: GameInfo[];
    
    private _availableAmount: number
    get availableAmount() { return this._availableAmount; }
    set availableAmount(value) { this.gamesService.setAmount(value); }

    private _margin: number
    get margin() { return this._margin; }
    set margin(value) { this.gamesService.setMargin(value); }

    private _minutes: number
    get minutes() { return this._minutes; }
    set minutes(value) { this.gamesService.setMinutes(value); }

    downloading: boolean;

    constructor(private gamesService: GamesService) { }

    ngOnInit(): void {
        this.gamesService.currentAmount.subscribe(s => this._availableAmount = s);
        this.gamesService.currentMargin.subscribe(s => this._margin = s);
        this.gamesService.currentMinutes.subscribe(s => this._minutes = s);
        this.gamesService.currentGames.subscribe(s => this.games = s);
        this.gamesService.currentDownloadingGames.subscribe(s => this.downloading = s);
    }

    async refresh() {
        try {
            await this.gamesService.downloadGames(this.minutes);
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }
}