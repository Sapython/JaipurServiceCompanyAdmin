export interface Service {
	id:string;
	name: string;
    image: string[];
    video:string;
    hsnCode:string;
    description: any;
    enabled: boolean;
    allowReviews: boolean;
    taxes: any[];
    services?: any[];
    taxType:'inclusive'|'exclusive';
    discounts: any[];
    price? :string;
	variants:Variant[];
    reviewEditable: number;
    color: string;
    tags: string[];
}

export interface Variant {
    price:number;
    name:string;
    description:string;
    jobDuration:number;
    jobAcceptanceCharge:number;
    id:string;
} 
export interface CategorizedService extends Service{
    category:{
        id:string;
        name:string;
    };
    subCategory:{
        id:string;
        name:string;
    };
}