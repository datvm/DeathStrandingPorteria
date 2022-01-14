import { dsData } from "./Services/DataService.js";
import { OrderItem } from "./UI/OrderItem.js";

export class OrderPage extends HTMLElement {

    loader = this.querySelector(".loader")!;

    lstOrders = this.querySelector(".list-orders")!;
    templateOrderItem = this.querySelector(".template-order-item")!.innerHTML;

    constructor() {
        super();
        void this.init();
    }

    async init() {
        await dsData.initAsync();

        this.showOrders();

        this.setLoading(false);
    }

    showOrders() {
        const orders = dsData.orderList;
        if (!orders) { throw new Error("This should not happen"); }

        const frag = new DocumentFragment();
        for (let order of orders) {
            const el = this.templateOrderItem.toElement();
            frag.appendChild(el);

            new OrderItem(el, order);
        }

        this.lstOrders.setContent(frag, true);
    }

    setLoading(isLoading: boolean) {
        this.loader.setDisplay(isLoading);
    }

    static register() {
        customElements.define("order-page", this);
    }

}
OrderPage.register();