interface IBasket {
  items: HTMLElement[];
  total: number;

  toggleButtonStatus(state:boolean):void;
}