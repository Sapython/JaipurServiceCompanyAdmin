import { Injectable } from '@angular/core';
import { Booking, BookingUpdated } from './booking.structure';
import { Firestore, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Category, Service, SubCategory } from './category-structure';
import { BookingService } from './booking.service';
import { BehaviorSubject } from 'rxjs';
import Utils from '../Shared/shared-services/util';

@Injectable({
  providedIn: 'root'
})

export class CreateBookingService {
  cart$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  cartInitial:BookingUpdated = {
    id: '',
    subCategory: {
      id: '',
      name: '',
      image: ''
    },
    mainCategory: {
      id: '',
      name: '',
      image: '',
      icon: '',
    },
    services: [],
    billing: {
      grandTotal: 0,
      tax: 0,
      discount: 0,
      coupanDiscunt: undefined,
      subTotal: 0,
      totalJobTime: 0,
      totalJobAcceptanceCharge: 0
    },
    createdAt: Timestamp.fromDate(new Date()),
    jobOtp: '',
    currentUser: {
      userId: '',
      name: '',
      phoneNumber: ''
    }
  }
  cart: BookingUpdated = this.cartInitial;
  currentCustomer:any;
  applicableDiscounts :any[] = []
  constructor(
    private bookingService: BookingService
  ) {
    console.log("Loading bookings");
  }
  async addToCart(variantId: string, service: Service, mainCategory: Category, subCategory: SubCategory, taxes: any){
    let variant = service.variants.find(v=>v.id == variantId);
    if (variant){
      if (this.cart.mainCategory.id == mainCategory.id && this.cart.subCategory.id == subCategory.id){
        let serviceIndex = this.cart.services.findIndex(s=>s.serviceId == service.id);
        if (serviceIndex!=-1){
          let variantIndex = this.cart.services[serviceIndex].variants.findIndex(v=>v.variantId == variantId);
          if (this.cart.services[serviceIndex].variants[variantIndex]){
              this.cart.services[serviceIndex].variants[variantIndex].quantity++;
          } else {
            // add variant to the service
            this.cart.services[serviceIndex].variants.push({
              billing:{
                discountedPrice:0,
                originalPrice:0,
                discount:0,
                tax:0,
                totalPrice:0,
                untaxedPrice:0
              },
              quantity:1,
              description:variant.description,
              jobAcceptanceCharge:variant.jobAcceptanceCharge,
              jobDuration:variant.jobDuration,
              mainCategoryId:mainCategory.id,
              name:variant.name,
              price:variant.price,
              serviceId:service.id,
              subCategoryId:subCategory.id,
              variantId:variant.id,
            })
          }
        } else {
          this.cart.services.push({
            name:service.name,
            allowReviews:service.allowReviews,
            description:service.description,
            discounts:service.discounts,
            image:service.image,
            serviceId:service.id,
            taxes:service.taxes,
            variants:[
              {
                billing:{
                  discountedPrice:0,
                  originalPrice:0,
                  discount:0,
                  tax:0,
                  totalPrice:0,
                  untaxedPrice:0
                },
                quantity:1,
                description:variant.description,
                jobAcceptanceCharge:variant.jobAcceptanceCharge,
                jobDuration:variant.jobDuration,
                mainCategoryId:mainCategory.id,
                name:variant.name,
                price:variant.price,
                serviceId:service.id,
                subCategoryId:subCategory.id,
                variantId:variant.id,
              }
            ],
            video:service.video,
            color: service.color,
            taxType: service.taxType,
          });
        }
        this.calculateBilling(this.cart);
        this.cart$.next(this.cart);
        return;
      }
      let data:BookingUpdated = {
        mainCategory:{
          id:mainCategory.id,
          name:mainCategory.name,
          image:mainCategory.image,
          icon: mainCategory.icon || ''
        },
        subCategory:{
          id:subCategory.id,
          name:subCategory.name,
          image:subCategory.image
        },
        services:[
          {
            name:service.name,
            allowReviews:service.allowReviews,
            description:service.description,
            discounts:service.discounts,
            image:service.image,
            serviceId:service.id,
            taxes:service.taxes,
            variants:[
              {
                billing:{
                  discountedPrice:0,
                  originalPrice:0,
                  discount:0,
                  tax:0,
                  totalPrice:0,
                  untaxedPrice:0
                },
                quantity:1,
                description:variant.description,
                jobAcceptanceCharge:variant.jobAcceptanceCharge,
                jobDuration:variant.jobDuration,
                mainCategoryId:mainCategory.id,
                name:variant.name,
                price:variant.price,
                serviceId:service.id,
                subCategoryId:subCategory.id,
                variantId:variant.id,
              }
            ],
            video:service.video,
            color: service.color,
            taxType: service.taxType,
          }
        ],
        currentUser:{
          name:'',
          phoneNumber:'',
          userId:''
        },
        stage: Utils.stageMaster['allotmentPending'].key,
        jobOtp:this.generateOtpCode(),
        billing:{
          grandTotal:0,
          tax:0,
          discount:0,
          subTotal:0,
          totalJobTime:0,
          totalJobAcceptanceCharge:0
        },
        id:this.generateJobId(),
        createdAt:Timestamp.fromDate(new Date()),
        timeSlot: {
          date: Timestamp.fromDate(new Date()),
          time: {
            startTime : Timestamp.fromDate(new Date()),
            endTime : Timestamp.fromDate(new Date()),
          },
          id : ''
        }
      };
      this.cart = data;
      this.calculateBilling(this.cart);
      this.cart$.next(this.cart);
    }
  }

  async removeFromCart(service:any,cartItem:any){
    let data:BookingUpdated = {...this.cart};
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1 && data.services[serviceIndex].variants.length === 1){
      data.services.splice(serviceIndex,1);
    }
    serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1 && data.services[serviceIndex].variants.length >1){
    let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == cartItem.variantId);
      if(variantIndex != -1){
        data.services[serviceIndex].variants.splice(variantIndex,1);
      }
    }
    if(data.services.length ===0){
      this.cart = this.cartInitial;
    }else{
      this.cart = data;
      this.calculateBilling(this.cart);
      this.cart$.next(this.cart);
    }
   
  }

  async incrementQuantity(service:any,cartItem:any){
    let data:BookingUpdated = {...this.cart};
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == cartItem.variantId);
      if (variantIndex != -1){
        data.services[serviceIndex].variants[variantIndex] = {
          ...data.services[serviceIndex].variants[variantIndex],
          quantity:data.services[serviceIndex].variants[variantIndex].quantity + 1
        } as any;
      }
    }
    this.cart = data;
    this.calculateBilling(this.cart);
    this.cart$.next(this.cart);
  }

  async decrementQuantity(service:any,cartItem:any){
    let data:BookingUpdated = {...this.cart};
    let serviceIndex = data.services.findIndex(s=>s.serviceId == service.serviceId);
    if (serviceIndex != -1){
      let variantIndex = data.services[serviceIndex].variants.findIndex(v=>v.variantId == cartItem.variantId);
      if (variantIndex != -1){
        if(data.services[serviceIndex].variants[variantIndex].quantity === 1){
          data.services[serviceIndex].variants.splice(variantIndex,1);
        }else{
          data.services[serviceIndex].variants[variantIndex] = {
            ...data.services[serviceIndex].variants[variantIndex],
            quantity:data.services[serviceIndex].variants[variantIndex].quantity - 1
          } as any;
        }
      }
    }
    this.cart = data;
    this.calculateBilling(this.cart);
    this.cart$.next(this.cart);
  }

  generateOtpCode(){
    // 6 digit number
    let code = '';
    for(let i=0;i<6;i++){
      code += Math.floor(Math.random()*10);
    }
    return code;
  }

  generateJobId(){
    // 16 chars alpha num
    let code = '';
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0;i<16;i++){
      code += chars[Math.floor(Math.random()*chars.length)];
    }
    return code;
  }

  calculateBilling(booking:BookingUpdated){
    let totalJobAcceptanceCharge = 0;
    let totalJobTime = 0;
    booking.billing.coupanDiscunt = 0;
    if(booking.services){
      for (const service of booking?.services) {
        // we will first calculate the original price
        service.variants.forEach((variant)=>{
          variant.billing.originalPrice = variant.quantity * variant.price;
          // we will now calculate the total tax
          variant.billing.tax = 0;
          console.log(service)
          if (service.taxType.toLowerCase() === 'exclusive') {
            for (const tax of service.taxes) {
              if (tax.type == 'percentage'){
                variant.billing.tax += (variant.billing.originalPrice * tax.rate) / 100;
              } else {
                variant.billing.tax += tax.rate;
              }
            }
          }
          // we will now calculate the total discount
          variant.billing.discount = 0;
          for (const discount of this.applicableDiscounts) {
            
            if(booking.appliedCoupon?.id == discount.id){
              if(booking.appliedCoupon !== undefined && booking.appliedCoupon?.type == "flat" || booking.appliedCoupon?.type == "fixed"){
                if(variant.price >= (booking.appliedCoupon?.minimumRequiredAmount ?? 0))
                {
                  variant.billing.discount = (+discount.value);
                }
              }else if(booking.appliedCoupon !== undefined){
                if(variant.price >= (booking.appliedCoupon?.minimumRequiredAmount ?? 0))
                {
                  variant.billing.discount = parseFloat(((booking.appliedCoupon.value*variant.price)/100).toFixed(2));
                }
              }
              if(booking.appliedCoupon?.maximumDiscountAmount && variant.billing.discount > (booking.appliedCoupon?.maximumDiscountAmount)){
                variant.billing.discount = (+booking.appliedCoupon?.maximumDiscountAmount)
              }
            }
          }
          // we will now calculate the total price
          variant.billing.totalPrice = variant.billing.originalPrice + variant.billing.tax - variant.billing.discount;
          // we will now calculate the discounted price
          variant.billing.discountedPrice = variant.billing.originalPrice - variant.billing.discount;
          // we will now calculate the untaxed price
          variant.billing.untaxedPrice = variant.billing.originalPrice - variant.billing.tax;
          // we will now calculate the total job acceptance charge
          totalJobAcceptanceCharge += variant.jobAcceptanceCharge;
          // we will now calculate the total job time
          totalJobTime += (+variant.jobDuration * variant.quantity);
        })
      }
      // we will now calculate the billing for the booking
      // we will first calculate the sub total
      booking.billing.subTotal = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          booking.billing.subTotal += variant.billing.originalPrice;
        }
      }
      booking.billing.subTotal 
      // we will now calculate the total tax
      booking.billing.tax = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          if(variant.billing.tax)
          booking.billing.tax += variant.billing.tax;
        }
      }
      // we will now calculate the total discount
      booking.billing.discount = 0;
      for (const service of booking.services) {
        for (const variant of service.variants) {
          if(variant.billing.discount)
          booking.billing.discount += variant.billing.discount;
        }
      }
      booking.billing.grandTotal = booking.billing.subTotal + booking.billing.tax - booking.billing.discount
      booking.billing.coupanDiscunt = 0;
      
      // we will now calculate the grand total
   
      booking.billing.totalJobAcceptanceCharge = totalJobAcceptanceCharge;
      booking.billing.totalJobTime = totalJobTime;
    }
    
    return booking;
  }

}
