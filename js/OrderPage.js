import { dsData } from "./Services/DataService.js";
import { FilterPanel } from "./UI/FilterPanel.js";
import { OrderItem } from "./UI/OrderItem.js";
export class OrderPage extends HTMLElement {
    loader = this.querySelector(".loader");
    lstOrders = this.querySelector(".list-orders");
    pnlFilter = this.querySelector(".panel-filter");
    templateOrderItem = this.querySelector(".template-order-item").innerHTML;
    constructor() {
        super();
        void this.init();
    }
    async init() {
        await dsData.initAsync();
        await this.pnlFilter.init();
        this.onOrderFilter();
        this.pnlFilter.addEventListener("filter-request", () => this.onOrderFilter());
        this.setLoading(false);
    }
    onOrderFilter() {
        const filter = this.pnlFilter.filters;
        const list = dsData.orderList;
        if (!list) {
            throw new Error("This should not happen");
        }
        const filtered = list.filter(order => {
            if (filter.locType > 0) {
                if ((filter.locType == 1 && order.startLocationId != filter.locId) ||
                    (filter.locType == 2 && order.destLocationId != filter.locId)) {
                    return false;
                }
            }
            if (!filter.completions[order.completionStatus]) {
                return false;
            }
            return true;
        });
        this.showOrders(filtered);
    }
    showOrders(orders) {
        const frag = new DocumentFragment();
        for (let order of orders) {
            const el = this.templateOrderItem.toElement();
            frag.appendChild(el);
            new OrderItem(el, order);
        }
        this.lstOrders.setContent(frag, true);
    }
    setLoading(isLoading) {
        this.loader.setDisplay(isLoading);
    }
    static register() {
        customElements.define("order-page", this);
        FilterPanel.register();
    }
}
OrderPage.register();
//# sourceMappingURL=OrderPage.js.map