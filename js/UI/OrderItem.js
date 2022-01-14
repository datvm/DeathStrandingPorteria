import { dsData } from "../Services/DataService.js";
export class OrderItem {
    el;
    order;
    constructor(el, order) {
        this.el = el;
        this.order = order;
        void this.init();
    }
    init() {
        const el = this.el;
        el.order = this;
        const item = this.order;
        el.setChildContent(".order-no", item.id.toString());
        el.setChildContent(".order-name", item.name);
        const locDict = dsData.dataDicts?.locations;
        if (!locDict) {
            throw new Error("Data unavailable");
        }
        el.setChildContent(".order-from", locDict[item.startLocationId].name);
        el.setChildContent(".order-to", locDict[item.destLocationId].name);
        el.setChildContent(".order-like-std", item.maxLike.toString());
        el.setChildContent(".order-like-pre", item.maxLikePremium.toString());
    }
}
//# sourceMappingURL=OrderItem.js.map