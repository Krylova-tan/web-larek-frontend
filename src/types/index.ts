import { cloneTemplate } from "../utils/utils";

export interface IAppLarekApi {
  cdn: string;

  getProductList: () => Promise<IProduct[]>;
  getProduct: () => Promise<IProduct>;
  orderDataProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IProduct {
	id: string;
  title: string;
	description?: string;
  price: number | null;
  category?: string;
	image?: string;	
}

// отвечает за клик и событие (товар)
export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IAppState {
  catalog: IProduct[];
  basket: number;
  preview: string | null;
  order: IOrder | null;

  setProducts(items:IProduct[]):void;
  addProductBasket(item:string):void;
  deleteProductBasket(item:string):void;
  getIdProduct(id:string):void;
  checkIdInbasket(id:string):void;
  clearBasket():void;
  checkValidAdress():void;
  checkValidContact():void;
  clearInputOrder():void;
  getTotal():void; 
}

type TPaymentMethod = 'cash'|'card';
export type TOrderForm = Pick<IOrder, 'pay' | 'addres'>;
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;
export type TOrder = Omit<IOrder, 'items' | 'total'>;

export interface IOrderResult { 
  price: number;
}

interface IOrder {
  pay: TPaymentMethod;
  addres: string;
  phone: string;
  email: string;
  items?: string[];
	total?: number;
}

export type TFormErrors = Partial<Record<keyof IOrder, string>>;






