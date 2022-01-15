const CompletionStorageKey = "completions";

export const CompletionStatusCount = 5;
class DataService {

    orderList?: IOrderInfo[];
    locationList?: IOrderLocation[];
    dataDicts?: IOrderDataRefined;

    async initAsync() {
        const data: IOrderData = await fetch("./DSOrders.json")
            .then(r => r.json());

        this.orderList = data.orders;
        await this.addCompletionStatusToDataAsync(data.orders);

        this.locationList = data.locations;
        this.dataDicts = {
            orders: data.orders.toDict(q => q.id.toString()),
            categories: data.categories.toDict(q => q.id.toString()),
            locations: data.locations.toDict(q => q.id.toString()),
            tags: data.tags.toDict(q => q.id.toString()),
        };
    }

    private async addCompletionStatusToDataAsync(orders: IOrderInfo[]) {
        const completionDict =await this.getCompletionStatusAsync();

        for (const order of orders) {
            order.completionStatus = completionDict[order.id.toString()] || 0;
        }
    }

    async getCompletionStatusAsync(): Promise<ObjDict<number>> {
        const raw = localStorage.getItem(CompletionStorageKey);
        return raw ? JSON.parse(raw) : {};
    }

    async setCompletionStatusAsync(id: number, status: number) {
        const curr = await this.getCompletionStatusAsync();
        curr[id] = status;
        localStorage.setItem(CompletionStorageKey, JSON.stringify(curr));

        this.dataDicts!.orders[id.toString()].completionStatus = status;
    }

    getCompletionImageUrl(i: number) {
        return "img/" +
            (i == 0 ? "tag.png" :
                i == 1 ? "mark.png" : `diff-${i - 1}.png`
            );
    }

    getCompletionText(i: number) {
        return i == 0 ? "New" :
            i == 1 ? "Normal" : `Premium ${i - 1}`;
    }

}

export enum OrderRequirementType {
    TimeLimit = 0,
    Quantity = 1,
    MinWeight = 2,
    Condition = 3
}

export enum CargoSize {
    S = 1,
    M = 2,
    L = 4,
    XL = 6
}

export const dsData = new DataService();