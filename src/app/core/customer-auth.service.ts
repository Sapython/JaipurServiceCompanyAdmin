import { Injectable } from '@angular/core';
import { ApplicationVerifier, Auth, ConfirmationResult, User, signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthService {
  loginConfirmationResult:ConfirmationResult|undefined;
  currentUser:{
    user:User,
    userData:any;
  }|undefined;
  constructor(private router:Router,public auth:Auth,private firestore:Firestore) {
    
  }
 
  getUserData(uid:string){
    return docData(doc(this.firestore,'users',uid));
  }

  async loginWithPhoneNumber(phone:string,appVerifier:ApplicationVerifier){
    if(phone.length != 10){
      return Promise.reject(new Error("Invalid Phone Number"));
    }
    return signInWithPhoneNumber(this.auth,'+91'+phone,appVerifier);
  }

  async setUserData(user:any){
    let userDoc = await getDoc(doc(this.firestore,'users',user.uid));
    if(userDoc.exists()){
      return;
    }
    
    let newUserData = {
      name:user.displayName || '',
      email:user.email || '',
      phoneNumber:user.phoneNumber || '',
      photoURL:user.photoURL || '',
      uid:user.uid || '',
      type:'customer',
      dateofbirth: user.dateofbirth
    };
    await setDoc(doc(this.firestore,'users',user.uid),newUserData);
    await addDoc(collection(this.firestore, 'users', user.uid, 'addresses'),user.addresses);
    return;
  }
}
