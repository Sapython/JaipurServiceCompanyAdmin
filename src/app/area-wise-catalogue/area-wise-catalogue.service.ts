import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, doc,collection, getDocs, addDoc, setDoc, collectionData, docData, query, collectionGroup, updateDoc, Timestamp, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaWiseCatalogueService {
  constructor(
    private firestore:Firestore,
    private http: HttpClient,
  ) { }
  searchAPIResult2: any = {
    "html_attributions" : [],
    "result" : 
    {
       "address_components" : 
       [
          {
             "long_name" : "Plot GH-03",
             "short_name" : "Plot GH-03",
             "types" : 
             [
                "subpremise"
             ]
          },
          {
             "long_name" : "Sector 16B Road",
             "short_name" : "Sector 16B Rd",
             "types" : 
             [
                "route"
             ]
          },
          {
             "long_name" : "Noida Extension Greater Noida West",
             "short_name" : "Noida Extension Greater Noida West",
             "types" : 
             [
                "neighborhood",
                "political"
             ]
          },
          {
             "long_name" : "Bhangel",
             "short_name" : "Bhangel",
             "types" : 
             [
                "sublocality_level_1",
                "sublocality",
                "political"
             ]
          },
          {
             "long_name" : "Greater Noida",
             "short_name" : "Greater Noida",
             "types" : 
             [
                "locality",
                "political"
             ]
          },
          {
             "long_name" : "Gautam Buddh Nagar",
             "short_name" : "Gautam Buddh Nagar",
             "types" : 
             [
                "administrative_area_level_3",
                "political"
             ]
          },
          {
             "long_name" : "Meerut Division",
             "short_name" : "Meerut Division",
             "types" : 
             [
                "administrative_area_level_2",
                "political"
             ]
          },
          {
             "long_name" : "Uttar Pradesh",
             "short_name" : "UP",
             "types" : 
             [
                "administrative_area_level_1",
                "political"
             ]
          },
          {
             "long_name" : "India",
             "short_name" : "IN",
             "types" : 
             [
                "country",
                "political"
             ]
          },
          {
             "long_name" : "201318",
             "short_name" : "201318",
             "types" : 
             [
                "postal_code"
             ]
          }
       ],
       "adr_address" : "Plot GH-03, \u003cspan class=\"street-address\"\u003eSector 16B Rd\u003c/span\u003e, \u003cspan class=\"extended-address\"\u003eNoida Extension Greater Noida West, Bhangel\u003c/span\u003e, \u003cspan class=\"locality\"\u003eGreater Noida, Ghaziabad\u003c/span\u003e, \u003cspan class=\"region\"\u003eUttar Pradesh\u003c/span\u003e \u003cspan class=\"postal-code\"\u003e201318\u003c/span\u003e, \u003cspan class=\"country-name\"\u003eIndia\u003c/span\u003e",
       "business_status" : "OPERATIONAL",
       "current_opening_hours" : 
       {
          "open_now" : true,
          "periods" : 
          [
             {
                "close" : 
                {
                   "date" : "2023-12-17",
                   "day" : 0,
                   "time" : "2359",
                   "truncated" : true
                },
                "open" : 
                {
                   "date" : "2023-12-11",
                   "day" : 1,
                   "time" : "0000",
                   "truncated" : true
                }
             }
          ],
          "weekday_text" : 
          [
             "Monday: Open 24 hours",
             "Tuesday: Open 24 hours",
             "Wednesday: Open 24 hours",
             "Thursday: Open 24 hours",
             "Friday: Open 24 hours",
             "Saturday: Open 24 hours",
             "Sunday: Open 24 hours"
          ]
       },
       "formatted_address" : "Jagatpura",
       "geometry" : 
       {
          "location" : 
          {
             "lat" : 28.606858,
             "lng" : 77.44653219999999
          },
          "viewport" : 
          {
             "northeast" : 
             {
                "lat" : 28.6082183802915,
                "lng" : 77.44788938029151
             },
             "southwest" : 
             {
                "lat" : 28.6055204197085,
                "lng" : 77.44519141970849
             }
          }
       },
       "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
       "icon_background_color" : "#7B9EB0",
       "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
       "name" : "AJNARA HOMES",
       "opening_hours" : 
       {
          "open_now" : true,
          "periods" : 
          [
             {
                "open" : 
                {
                   "day" : 0,
                   "time" : "0000"
                }
             }
          ],
          "weekday_text" : 
          [
             "Monday: Open 24 hours",
             "Tuesday: Open 24 hours",
             "Wednesday: Open 24 hours",
             "Thursday: Open 24 hours",
             "Friday: Open 24 hours",
             "Saturday: Open 24 hours",
             "Sunday: Open 24 hours"
          ]
       },
       "photos" : 
       [
          {
             "height" : 3024,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/112696043604930210456\"\u003eAJNARA HOMES\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFiOMkpDgPLpH_I3iMVwBgHgoqj1SShONGcZTo_xoowdqpVvQHQD3etlMuM3qvuFBBtcUzvUVmQxQ9VC11WXXq3pW7vO-izO2Tq7dXPpgLwQ7PRA1EAhBweJn7s-lT_8A2JW0v8dVtCZF8e18kuCVbR-tfzji2Oiy-Jk_6VswX7VwMS9",
             "width" : 4032
          },
          {
             "height" : 4032,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/115644745963634909364\"\u003eHemant Kumar Singh\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFjYPwUHf-ylf6t_Ma734N5_w2fWwUgoXzHnDA_epPruR9cHgYASoAH0MMBfASn_GP7HLlmouWme2PpZltv_WN4uPZUHp1KWqDy-IYDrltwXgB9NopY7DuBL9IYiGecrln3B_wS722tw1VEWnHHRhOvDeite8BnW6SC2EVgOqKbAe4DG",
             "width" : 3024
          },
          {
             "height" : 3464,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/111574484348146699925\"\u003eShashank Thakur\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFjEO0zyV6doIKwnZNdJgTujsKsbFeiMUXWIZ-cb5bwYrVPGA8zp5WHAmg3hiQoWb3u_21hqWWLdcIZMvxp-HH2QaCHGdYfD5C_5NeCJqtPxeHa-Wqm40rSnUvOaaf4Hm_x6dChIVv2y3FIkdtNo9mIdL3liGnNYFE3xBtrlPwAAE-Mf",
             "width" : 4618
          },
          {
             "height" : 3000,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/101676139524967758107\"\u003eKumar Anuj\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFi4u1hlIGNHGwDWiJtph0LTVJ-cC_ve67kvixZ3npgF1bEcrSGdDYx5pUUd0W93mBlbgmEKiP8vm1d_k23bt5Rh4VHut2riD6NTDg_xuZurz19oaUqDDmusHEh0Qd_nwfWMDXx2riDeV-Qe2tf_EBM5OSfIX9lrxJVhep6psS3mKuWq",
             "width" : 4000
          },
          {
             "height" : 1200,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/108803609224455825924\"\u003eSK Upadhyay\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFiBmHh7yA7im0P0xEsOVZd5aHEawSOCMH6JfHG3ldLgEYN32ECObk0mfpwKX_7ajB-0T8X-iWQwdq53CqmPUQVar581jKuLlh0MYfRDNjRQdZA69xI8GeLMz1r3bt8hObn6d2miXqB6Xmfqbf2hWVJgURumOMbeWZjEWxS7dOd3rTCD",
             "width" : 1600
          },
          {
             "height" : 3000,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/101539016231786209546\"\u003esanjay Chaudhary\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFjD2mIaRHP7KNzHK_EaVLfmgjvM7nRMs9XaAhbg8FuU6YXML1fuyBY6I_pDua_yHnwoTkfunUBsobGjwiP6l4gAMhxS0yQO8K5wz9XvITVa_y5DsAGJl6UZsTdAPegFG2s36gTKhY7uMd2C_xLPUrbZu3w9-sFf408TfYzp-HDZEa4S",
             "width" : 4000
          },
          {
             "height" : 4160,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/118319967527519893564\"\u003ePramukh Chaudhary\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFi0CKJVaZ2zDItW6oErMe0yf6p7nzHct5681D6MaH2Zw_j9zMpim73Iv00vvX4tElDywbmmpOTOeWhtuXvQCxgIMlOEriWoVLF-DhJukASr13Do4_-2atSU7DfEOnoiKOwg8TtpTUNEEu6R97bnK15kv2RolG8B19zAzdv8huHvTwFF",
             "width" : 3120
          },
          {
             "height" : 4032,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/102035671043593667405\"\u003eMohit Agarwal\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFgRcH2tnUJhxNbsfy5OAYqT-7nBJ8qmCLen0uV243_T6pVbMQ38y0BzRnR98HwFvF7a5QrcBXBhYYyryPqVbavUPgbM8p3_1_8aw3RWAs25R_kypteJbXnDbigknyuLqCg5RoL-VVyc3CgAtpVJFZN3GcbELJnga1d5E-hbbxN1JM9s",
             "width" : 2268
          },
          {
             "height" : 3120,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/116428551890202248782\"\u003eAnshul Kushwaha\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFgzz6PO9OqC9rkh1h-Yuxur1SQyuqk4p50cPtE2Cv-_xLAv_nvY4qDkLz4zx8bOnr7G1-kiHbv3kpMN3XH4xZVVSEx_7EsnJV7a-c6RHOUViHpyClGf-HICml4UWkeYZpLHTA4p_gmVBqIQ2H0-6Wu8sLZsRBVgeIiYyTTw1YGPluYm",
             "width" : 4160
          },
          {
             "height" : 3000,
             "html_attributions" : 
             [
                "\u003ca href=\"https://maps.google.com/maps/contrib/111042242464707364565\"\u003eJMD9X “Fitness Funda”\u003c/a\u003e"
             ],
             "photo_reference" : "AWU5eFgHKJR4LKssvOU9LEVP7ECx6Q1B5qk-kdR2ThqB3_0fWBhfVlqcODS_lx6Y5kzuPMUnmsaYNffV662EORDZwxwEpwFAh4fZlaPHnH_tXNYuzibWSo7zweBUyv_ZgbDIMf9kByyxbm7MYAlTfxGBBU4W4kKDwDvnBBTkLcT8LK4DF95F",
             "width" : 4000
          }
       ],
       "place_id" : "ChIJ8foGNV3uDDkRwWQdX_uJt_E",
       "plus_code" : 
       {
          "compound_code" : "JC4W+PJ Greater Noida, Uttar Pradesh, India",
          "global_code" : "7JWVJC4W+PJ"
       },
       "rating" : 4,
       "reference" : "ChIJ8foGNV3uDDkRwWQdX_uJt_E",
       "reviews" : 
       [
          {
             "author_name" : "Hemant Kumar Singh",
             "author_url" : "https://www.google.com/maps/contrib/115644745963634909364/reviews",
             "language" : "en",
             "original_language" : "en",
             "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjVJSML4utnhXjsURsFguzGqAR5IY17skvTc4HGVxelbN8U=s128-c0x00000000-cc-rp-mo-ba5",
             "rating" : 4,
             "relative_time_description" : "3 months ago",
             "text" : "Its a good society with decent construction. There are all basic amenities.There is a park, pool sports courts and clubs. This society is adjacent to multiple underconstruction malls. There are local markets available to this for your basic needs.\nOverall its located in good location and a good society I would say",
             "time" : 1693642389,
             "translated" : false
          },
          {
             "author_name" : "Ajeet Singh",
             "author_url" : "https://www.google.com/maps/contrib/110418991077525046653/reviews",
             "language" : "en",
             "original_language" : "en",
             "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjVmpvdnBd-D4UABnX3dPA9VAaU8jblrQJkonT_OGF9kfKQ=s128-c0x00000000-cc-rp-mo-ba5",
             "rating" : 5,
             "relative_time_description" : "4 months ago",
             "text" : "This is a good society; there are basketball and cricket grounds for children to play on, as well as a swimming pool.And there's a temple for worship too. Security and maintenance service are also good; without a society sticker, we cannot take vehicles inside.",
             "time" : 1690349131,
             "translated" : false
          },
          {
             "author_name" : "Anishya",
             "author_url" : "https://www.google.com/maps/contrib/104341916714828693907/reviews",
             "language" : "en",
             "original_language" : "en",
             "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjVNaxXVcxiEVJxZEzLCRXng-Kt2RMvjELidAW3YTxmFi4Ao=s128-c0x00000000-cc-rp-mo-ba6",
             "rating" : 5,
             "relative_time_description" : "2 months ago",
             "text" : "The reception, the parking area, basement were too 🔥awesome. I feel like I have come to 5 Start Hotel, the basement seems like an elite hotel gallery. The balcony view, and the rooms were up to the mark and beautiful. Peaceful it was.",
             "time" : 1695063532,
             "translated" : false
          },
          {
             "author_name" : "Niraj Mishra",
             "author_url" : "https://www.google.com/maps/contrib/116809352154563370001/reviews",
             "language" : "en",
             "original_language" : "en",
             "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjVMIOD5tNJje4Q22rjgzTBKyGksRf3dpWaYNE169gb11sY=s128-c0x00000000-cc-rp-mo-ba4",
             "rating" : 4,
             "relative_time_description" : "a week ago",
             "text" : "Well maintained. Clean. Enough parking spaces. Flats are moderately experience though.",
             "time" : 1701617050,
             "translated" : false
          },
          {
             "author_name" : "Deepak Sinha",
             "author_url" : "https://www.google.com/maps/contrib/117588389840366383328/reviews",
             "language" : "en",
             "original_language" : "en",
             "profile_photo_url" : "https://lh3.googleusercontent.com/a-/ALV-UjUUEGoSDkiRq-5YSDwAGc__NzPRuunA7lssmkLmZolJcso=s128-c0x00000000-cc-rp-mo-ba4",
             "rating" : 2,
             "relative_time_description" : "3 months ago",
             "text" : "So much congested. Some towers don't have a good distance between each other. How government approve such type of plan only money knows.\nGood thing is I found good ppl arround.",
             "time" : 1693366054,
             "translated" : false
          }
       ],
       "types" : 
       [
          "point_of_interest",
          "establishment"
       ],
       "url" : "https://maps.google.com/?cid=17417541796604241089",
       "user_ratings_total" : 2006,
       "utc_offset" : 330,
       "vicinity" : "Plot GH-03, Sector 16B Road, Noida Extension Greater Noida West, Bhangel, Greater Noida",
       "wheelchair_accessible_entrance" : true
    },
    "status" : "OK"
  };
  searchAPIResult1: any = {
    "html_attributions" : [],
    "results" : 
    [
       {
          "business_status" : "OPERATIONAL",
          "formatted_address" : "Civil Lines Jaipur, Rajasthan",
          "geometry" : 
          {
             "location" : 
             {
                "lat" : 28.606858,
                "lng" : 77.44653219999999
             },
             "viewport" : 
             {
                "northeast" : 
                {
                   "lat" : 28.60821922989272,
                   "lng" : 77.44789022989272
                },
                "southwest" : 
                {
                   "lat" : 28.60551957010728,
                   "lng" : 77.44519057010729
                }
             }
          },
          "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
          "icon_background_color" : "#7B9EB0",
          "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
          "name" : "AJNARA HOMES",
          "opening_hours" : 
          {
             "open_now" : true
          },
          "photos" : 
          [
             {
                "height" : 3024,
                "html_attributions" : 
                [
                   "\u003ca href=\"https://maps.google.com/maps/contrib/112696043604930210456\"\u003eA Google User\u003c/a\u003e"
                ],
                "photo_reference" : "AWU5eFinZokLyTImyz6Mx4cT40Fcr1Hf3cbIinFcCc_ih5ZT6vvd217DQoyEbkNneRToltNYOBHzo1tDSlhfb1h7gZUewu0sHbKQHeanxgRa2xYZz45JCRWJ0KT39vGPLlPCjI6xY4eKWDAOw6lhrnNDeEMP7S5yPIzzYollV8i8i-xWHn_c",
                "width" : 4032
             }
          ],
          "place_id" : "ChIJ8foGNV3uDDkRwWQdX_uJt_E",
          "plus_code" : 
          {
             "compound_code" : "JC4W+PJ Greater Noida, Uttar Pradesh",
             "global_code" : "7JWVJC4W+PJ"
          },
          "rating" : 4,
          "reference" : "ChIJ8foGNV3uDDkRwWQdX_uJt_E",
          "types" : 
          [
             "point_of_interest",
             "establishment"
          ],
          "user_ratings_total" : 2006
       },
       {
          "business_status" : "OPERATIONAL",
          "formatted_address" : "Kalwar Road Jaipur",
          "geometry" : 
          {
             "location" : 
             {
                "lat" : 28.608746,
                "lng" : 77.44726829999999
             },
             "viewport" : 
             {
                "northeast" : 
                {
                   "lat" : 28.61010662989272,
                   "lng" : 77.44871202989272
                },
                "southwest" : 
                {
                   "lat" : 28.60740697010728,
                   "lng" : 77.44601237010728
                }
             }
          },
          "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
          "icon_background_color" : "#7B9EB0",
          "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
          "name" : "Ajnara Homes E Tower",
          "place_id" : "ChIJcfysto7vDDkRSb4ilW8Zul4",
          "plus_code" : 
          {
             "compound_code" : "JC5W+FW Greater Noida, Uttar Pradesh",
             "global_code" : "7JWVJC5W+FW"
          },
          "rating" : 4,
          "reference" : "ChIJcfysto7vDDkRSb4ilW8Zul4",
          "types" : 
          [
             "point_of_interest",
             "establishment"
          ],
          "user_ratings_total" : 2
       }
    ],
    "status" : "OK"
 };

  getCity() {
    return getDocs(collection(this.firestore, 'areas'));
  }

  updateCityStatus(stateId: string, cityId: string, status: boolean) {
    return updateDoc(doc(this.firestore, 'areas', stateId, 'cities', cityId), {active: status});
  }

  getStateSubscription(){
    return collectionData(collection(this.firestore, 'areas'), {idField: 'id'});
  }

  getCitySubscription(stateId: string){
    return collectionData(collection(this.firestore, 'areas', stateId, 'cities'), {idField: 'id'});
  }

  getAreaSubscription(stateId: string, cityId: string){
    return collectionData(collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'), {idField: 'id'});
  }

  updateAreaStatus(stateId: string, cityId: string, areaId: string, status: boolean) {
    return updateDoc(doc(this.firestore, 'areas', stateId, 'cities', cityId, 'areas', areaId), {active: status});
  }

  updateAreaCatalogue(stateId: string, cityId: string, areaId: string, catalogueId: string) {
    return updateDoc(doc(this.firestore, 'areas', stateId, 'cities', cityId, 'areas', areaId), {serviceCatalogue: catalogueId});
  }

  addAreaInCity(stateId:string, cityId:string, area: any){
    return addDoc(collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),area);
  }

  addCityInState(stateId: string, obj: any){
   return addDoc(collection(this.firestore, 'areas', stateId, 'cities'), obj);
 }

  getAreaOnSearch(searchInput: string) {
   return this.http.get(
      `${environment.firebase.functionURL}getAreaOnSearch?searchInput=${searchInput}`
   );
  }

  getAreaDetail(latitude: string, longitude : string){
    return this.http.get(`${environment.firebase.functionURL}getAreaDetail?latitude=${latitude}&longitude=${longitude}`);
  }

  getAreaDetailByPlaceId(placeId: string){
      return this.http.get(`${environment.firebase.functionURL}getAreaDetailByPlaceId?placeId=${placeId}`);
  }
}