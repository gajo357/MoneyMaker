import { Routes } from "@angular/router";

import { GamesComponent } from "./games/games.component";
import { GameDetailComponent } from "./game-details/game-detail.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
    { path: "", component: GamesComponent },
    { path: "games", component: GamesComponent },
    { path: "game/:gameLink", component: GameDetailComponent },
];

export const navigatableComponents = [
    LoginComponent,
    GamesComponent,
    GameDetailComponent
  ];