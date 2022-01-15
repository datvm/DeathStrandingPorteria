import { CargoSize, CompletionStatusCount, dsData } from "../Services/DataService.js";

export class OrderItem {

    constructor(public el: HTMLElement, public order: IOrderInfo) {
        void this.init();

        el.querySelector(".btn-change-completion")!.addClick(e => {
            e.preventDefault();
            void this.onChangeStatusRequested();
        });
    }

    init() {
        const el = this.el;
        el.order = this;
        const item = this.order;

        el.setChildContent(".order-no", item.id.toString());
        el.setChildContent(".order-name", item.name);

        const imgCompletion = el.querySelector(".order-completion")!;
        imgCompletion.setAttribute("src", dsData.getCompletionImageUrl(item.completionStatus));
        imgCompletion.setAttribute("title", dsData.getCompletionText(item.completionStatus));

        const locDict = dsData.dataDicts?.locations;
        if (!locDict) { throw new Error("Data unavailable"); }

        el.setChildContent(".order-from", locDict[item.startLocationId].name);
        el.setChildContent(".order-to", locDict[item.destLocationId].name);

        el.setChildContent(".order-like-std", item.maxLike.toString());
        el.setChildContent(".order-like-pre", item.maxLikePremium.toString());

        el.setChildContent(".cargo-weight", this.getFloatValue(item.weightX10));

        const sizes: string[] = [];
        for (let key in item.sizes) {
            const count = item.sizes[key];
            sizes.push(`${count}${CargoSize[Number(key)]}`);
        }
        el.setChildContent(".cargo-sizes", sizes.join(" - "));
    }

    private async onChangeStatusRequested() {
        const newStatus = (this.order.completionStatus + 1) % CompletionStatusCount;
        await dsData.setCompletionStatusAsync(this.order.id, newStatus);

        this.init();
    }

    private getFloatValue(x10: number) {
        return (x10 / 10).toString();
    }

}