import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { User } from "../Models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private userUrl = "http://localhost:8080/api/user/";

  // Admin Property
  private isAdminAuthenticated = false;
  private authAdminStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signup(username: string, email: string, password: string) {
    const user: User = { 
      username:username, 
      email: email, 
      password: password 
    };
    console.log("Hii");
    this.http
      .post(`${this.userUrl}signup`, user)
      .subscribe(response => {
        console.log(response);
      });
    this.router.navigate(["/Home"]);
  }

  login(username: string, email: string, password: string) {
    const user: User = {
       username: username, 
       email: email, 
       password: password 
      };
      console.log(user);
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${this.userUrl}login`,
        user
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(["/Home"]);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/Home"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getUser(email: string) {
    return this.http.get<{ username:string, email:string, password:string}>(
      `${this.userUrl}getUser/${email}`
    );
  }

  //Admin Login
  adminLogin(email,password){
    this.isAdminAuthenticated = true;
    this.authAdminStatusListener.next(true);
    localStorage.setItem("email", email);
    localStorage.setItem("passwoed", password);
    this.router.navigate(["/AdminHome"]);
  }

  adminLogout() {
    this.isAdminAuthenticated = false;
    this.authAdminStatusListener.next(false);
    localStorage.removeItem("email");
    localStorage.removeItem("passwoed");
    this.router.navigate(["/AdminLogin"]);
  }

  getAdminIsAuth() {
    return this.isAdminAuthenticated;
  }

  getAdminAuthStatusListener() {
    return this.authAdminStatusListener.asObservable();
  }
}
