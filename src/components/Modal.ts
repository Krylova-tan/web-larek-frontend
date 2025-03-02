interface IModal {
  content: HTMLElement;
  closeButton: HTMLButtonElement;

  openModal():void;
  closeModal():void;
  render(data:HTMLElement):HTMLElement;
  set(value: HTMLElement):void;
}