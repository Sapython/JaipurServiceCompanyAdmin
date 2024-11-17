import { Injectable } from '@angular/core';
import { Assignment, Booking, BookingUpdated } from './booking.structure';
import { Firestore, doc,collection, getDocs, addDoc, setDoc, collectionData, docData, query, collectionGroup, updateDoc, Timestamp, where, documentId, or, startAt } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { faker } from '@faker-js/faker';
import Utils from '../Shared/shared-services/util';
import { endAt, orderBy } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookings:Booking[] = [];
  userAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  addressAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public refreshCounts: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  bookingsSubject:Subject<Booking[]> = new Subject<Booking[]>();
  public selectedBooking$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedDate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    public firestore:Firestore,
  ) {
    console.log("Loading bookings");
  }

  getAllReviews(){
    return getDocs(collection(this.firestore,'Review'));
  }

  addBooking(booking:BookingUpdated,userId:string){
    return setDoc(doc(this.firestore,'users',userId,'bookings',booking.id!),booking);
  }

  getBookings(date?: string){
    return getDocs(collectionGroup(this.firestore,'bookings'));
  }

  getTaxes(){
    return getDocs(collectionGroup(this.firestore,'taxes'));
  }

  getDiscounts(){
    return getDocs(collectionGroup(this.firestore,'coupons'));
  }

  getSubCategories(categoryId :string){
    return getDocs(query(collection(this.firestore,'service-catalogue','1OtfZ7RzJOyRWSGpTR3t','categories',categoryId,'categories')));
  }

  getCategories(){
    return getDocs(query(collection(this.firestore,'service-catalogue','1OtfZ7RzJOyRWSGpTR3t','categories')));
  }

  getServices(categoryId :string,subCategoryId:string){
    return getDocs(query(collection(this.firestore,'service-catalogue','1OtfZ7RzJOyRWSGpTR3t','categories', categoryId, 'categories',subCategoryId,'services')));
  }

  getBookingsByDate(startDate:Date,endDate:Date){
    // set time of the start date to 00:00:00
    // set the time of the end date to 23:59:59
    startDate.setHours(0,0,0);
    endDate.setHours(23,59,59);
    return getDocs(query(collectionGroup(this.firestore,'bookings'),where('createdAt','>=',Timestamp.fromDate(startDate)),where('createdAt','<=',Timestamp.fromDate(endDate))));
	}

  getBookingsByKey(key: string, bookingSearchInput: string){
    return getDocs(query(collectionGroup(this.firestore, 'bookings'), where(key, '>=', bookingSearchInput)));
	}
	
  assignAgent(userId:string,bookingId:string,agentId:string){
    return updateDoc(doc(this.firestore,'users',userId,'bookings',bookingId),{assignedAgent:agentId,stage:'assigned'});
  }

  reAssignAgent(userId:string,bookingId:string,agentId:string){
    return updateDoc(doc(this.firestore,'users',userId,'bookings',bookingId),{assignedAgent:agentId});
  }

  getUsers(){
    return getDocs(collection(this.firestore,'users'));
  }

  getUsersByText(text:string,key:string){
    text = text.toUpperCase();
    return getDocs(query(collection(this.firestore,'users'),where(key,'>=',text)))
  }

  getSlots(){
    return getDocs(collection(this.firestore,'slots'));
  }

  updateSlotStatus(slotId:string,slotStatus:boolean){
    return updateDoc(doc(this.firestore,'slots',slotId),{active:slotStatus});
  }

  getAddressByCustomerId(userId: string){
    return getDocs(query(collection(this.firestore, 'users', userId, 'addresses')));
	}

  getAllFakeBookings(){
    // generate fake bookings using faker js
    let bookings:Booking[] = [];
    for(let i=0;i<100;i++){
      let booking:Booking = {
        id:faker.datatype.uuid(),
        subCategory:{
          id:faker.datatype.uuid(),
          name:faker.commerce.productName(),
          image:faker.image.imageUrl()
        },
        jobOtp:faker.datatype.number().toString(),
        mainCategory:{
          id:faker.datatype.uuid(),
          name:faker.commerce.productName(),
          image:faker.image.imageUrl()
        },
        services:[],
        billing:{
          grandTotal:faker.datatype.number(),
          tax:faker.datatype.number(),
          discount:faker.datatype.number(),
          subTotal:faker.datatype.number(),
          totalJobTime:faker.datatype.number(),
          totalJobAcceptanceCharge:faker.datatype.number()
        },
        createdAt:Timestamp.fromDate(faker.date.recent()),
        address:{
          addressLine1:faker.address.streetAddress(),
          addressLine2:faker.address.secondaryAddress(),
          pinCode:faker.address.zipCode(),
          name:faker.person.jobArea(),
        },
        timeSlot:{
          date:Timestamp.fromDate(faker.date.recent()),
          time:Timestamp.fromDate(faker.date.recent())
        },
        currentUser:{
          userId:faker.datatype.uuid(),
          name:faker.person.fullName(),
          phoneNumber:faker.phone.number()
        },
        payment:{
          amount:faker.datatype.number(),
          paymentId:faker.datatype.uuid(),
          paymentMethod:faker.finance.currencyName(),
          paymentStatus:faker.finance.transactionType()
        },
        assignedAgent:faker.datatype.uuid(),
        stage:'assigned'
      };
      bookings.push(booking);
    }
    return new Promise<Booking[]>((resolve,reject)=>{
      resolve(bookings);
    })
  }

  updateBooking(userId: string, bookingId: string, nextStage: string, agentId?: string, data?: any) {
    let obj: any = {};
    if (nextStage === Utils.stageMaster.acceptancePending.key) {
      obj['assignedAgent'] = agentId;
      obj['allotmentAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.jobAccepted.key) {
      obj['acceptedAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.inProgress.key) {
      obj['otpAt'] = new Date();
      obj['progressAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.completed.key) {
      obj['completedAt'] = new Date();
    } else if (nextStage === Utils.stageMaster.discarded.key) {
      obj['discardedAt'] = new Date();
    }
    obj['stage'] = nextStage;
    if (data) {
      obj = {...obj, ...data}
    }
    return updateDoc(doc(this.firestore, 'users', userId, 'bookings', bookingId), obj);
  }

  updateBookingAssignment(userId: string, bookingId: string, assignmentId: string, obj: any) {
    return updateDoc(doc(this.firestore, 'users', userId, 'bookings', bookingId, 'assignments', assignmentId), obj);
  }

  addBookingAssignments(userId: string, bookingId: string, assignment: Assignment) {
    return addDoc(collection(this.firestore, 'users', userId, 'bookings', bookingId, 'assignments'), assignment);
  }

  addAddress(userId: string, address:any) {
    return addDoc(collection(this.firestore, 'users', userId, 'addresses'), address);
  }

  getBookingsById(userId: string, bookingId: string){
    return getDocs(query(collection(this.firestore, 'users', userId, 'bookings'), where(documentId(), '==', bookingId)));
	}

  getBookingsAssignment(userId: string, bookingId: string){
    return getDocs(collection(this.firestore, 'users', userId, 'bookings', bookingId, 'assignments'));
	}

  getAgentBookingSlots(agentId: string, date: string){
    return getDocs(query(collection(this.firestore, 'agents', agentId, 'slots'), where(documentId(), '==', date)));
	}

  updAgentBookingSlots(agentId: string, slotId: string, obj: any){
    return updateDoc(doc(this.firestore, 'agents', agentId, 'slots', slotId), obj);
	}

  updateBookingPics(userId: string, bookingId: string, obj: any) {
    return updateDoc(doc(this.firestore, 'users', userId, 'bookings', bookingId), obj);
  }

}
