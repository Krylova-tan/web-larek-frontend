export interface IProduct {
	id: string;
  title: string;
	description?: string;
  price: number | null;
  category?: string;
	image?: string;	
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IAppState {
  catalog: IProduct[];
  basket: TBasket;
  preview: string | null;
  order: TOrder;

  formErrors: TFormErrors;

  setProducts(items:IProduct[]):void;
  addProductBasket(item:IProduct):void;
  deleteProductBasket(item: IProduct): void;
  setPreview(item: IProduct): void;
  checkIdInbasket(item: IProduct): void;
  clearBasket():void;

  checkValidAddress():void;
  checkValidContact():void;
  clearInputOrder():void;
  setOrderField(field: keyof TOrder, value: string): void;
  setContactsField(field: keyof TOrder, value: string): void;
}

export type TOrderForm = Pick<IOrder, 'payment' | 'address'>;
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;
export type TOrder = Omit<IOrder, 'items' | 'total'>;
export type TBasket = Pick<IOrder, 'items' | 'total'>;

export interface IOrderResult { 
  price: number;
  id: string;
}

export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export type TFormErrors = Partial<Record<keyof IOrder, string>>;






