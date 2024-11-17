import { Injectable, inject } from '@angular/core';
import {Router} from '@angular/router';
import 'firebase/auth';
import { Auth, GoogleAuthProvider, User, authState, signInWithPopup, signOut, user} from '@angular/fire/auth';
import { collection, doc, documentId, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs';
import { getDoc } from 'firebase/firestore';
import { NotificationService } from '../Shared/core/notification.service';
// import { GoogleAuthProvider,signInWithPopup,getAuth } from 'firebase/auth';
// import { signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private _firestore = inject(Firestore)
    private _auth = inject(Auth);
    authState$ = authState(this._auth)
    user$:Observable<User | null> = user(this._auth);
    userDetails: any | null = null;
    constructor(
        private router: Router,
        private notificationService: NotificationService
    ) {
        this.user$.subscribe(async (user) => {
            if(user) {
                const validUser = await this.checkValidUser(user.email || '');
                if (!validUser) {
                    this.notificationService.presentErrorToast('Invalid User');
                    return
                }
                this.userDetails = user;
                localStorage.setItem('token', this.userDetails.accessToken)
                if (this.router.url == '/privacy-policy' || this.router.url == 'terms-and-conditions') {
                    return
                }
                this.router.navigate(['bookings'])
            } else {
                this.userDetails = null;
                localStorage.removeItem('token')
            }
        })
    }

    async checkValidUser(email: string) {
        const chkUser = await this.getUserData(email);
        let isActiveUser = false;
        chkUser.docs.map((user) => {
            if (user.data()['active']) {
                isActiveUser = true;
            }
            return user;
        });
        return isActiveUser;
    }

    async googleSignin() {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(this._auth, provider);
        return this.updateUserData(credential.user);
    }

    async signout() {
        await signOut(this._auth)
        localStorage.removeItem('token')
        return this.router.navigate(['login'])
    }

    private updateUserData(user:any) {
        const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }
        const userRef = doc(this._firestore,`users/${user.uid}`);
        return setDoc(userRef, data, {merge: true})
    }

    private getUserData(email: any) {
        return getDocs(query(collection(this._firestore, 'admin-user'), where(documentId(), '==', email)));
    }
}