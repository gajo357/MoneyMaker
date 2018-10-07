import { LoginService } from "./login.service";
import { Component, OnInit } from "@angular/core";
import { User } from "./user";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

@Component({
  selector: "ns-login",
  providers: [LoginService],
  styleUrls: ["./login/login.component.css"],
  templateUrl: "./login/login.component.html",
})
export class LoginComponent implements OnInit { 
    user: User;
    isLoggingIn = false;
    
    constructor(private router: Router, private loginService: LoginService, private page: Page) {
        this.user = new User();
      }
  
    async login() {
        try {
            this.isLoggingIn = true;
            
            if (await this.loginService.logIn(this.user)) {
                this.router.navigate(["/games"]);
            } else {
                alert('User was not recognized!');
            }
        } catch (error) {
            console.log(error);
            alert(error)
        } finally {
            this.isLoggingIn = false;
        }
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }
}
