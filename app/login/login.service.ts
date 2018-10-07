import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from "./user";
import { Config } from "../config";

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) { }

    async logIn(user: User): Promise<boolean> {
        const response = await this.http.post(
            Config.apiUrl + "api/login",
            {
                username: this.prepareUsername(user.email),
                password: user.password
            },
            { 
                headers: this.getCommonHeaders(),
                responseType: 'text'
            },
        ).toPromise();

        Config.token = response;
        return await this.isLoggedIn(user);
    }

    private async isLoggedIn(user: User): Promise<boolean> {
        // return new Promise(resolve => resolve(true));
        return await this.http.get<boolean>(
            Config.apiUrl + "api/login/" + this.prepareUsername(user.email),
            { headers: this.getCommonHeaders() }
        ).toPromise();
    }

    private prepareUsername(email: string) {
        return email.replace('@gmail.com', '');
    }

    getCommonHeaders() {
        let headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");
        return headers;
    }
}