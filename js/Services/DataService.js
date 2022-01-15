const CompletionStorageKey = "completions";
export const CompletionStatusCount = 5;
class DataService {
    orderList;
    locationList;
    dataDicts;
    async initAsync() {
        const data = await fetch("./DSOrders.json")
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
    async addCompletionStatusToDataAsync(orders) {
        const completionDict = await this.getCompletionStatusAsync();
        for (const order of orders) {
            order.completionStatus = completionDict[order.id.toString()] || 0;
        }
    }
    async getCompletionStatusAsync() {
        const raw = localStorage.getItem(CompletionStorageKey);
        return raw ? JSON.parse(raw) : {};
    }
    async setCompletionStatusAsync(id, status) {
        const curr = await this.getCompletionStatusAsync();
        curr[id] = status;
        localStorage.setItem(CompletionStorageKey, JSON.stringify(curr));
        this.dataDicts.orders[id.toString()].completionStatus = status;
    }
    getCompletionImageUrl(i) {
        return "img/" +
            (i == 0 ? "tag.png" :
                i == 1 ? "mark.png" : `diff-${i - 1}.png`);
    }
    getCompletionText(i) {
        return i == 0 ? "New" :
            i == 1 ? "Standard" : `Premium ${i - 1}`;
    }
}
export var OrderRequirementType;
(function (OrderRequirementType) {
    OrderRequirementType[OrderRequirementType["TimeLimit"] = 0] = "TimeLimit";
    OrderRequirementType[OrderRequirementType["Quantity"] = 1] = "Quantity";
    OrderRequirementType[OrderRequirementType["MinWeight"] = 2] = "MinWeight";
    OrderRequirementType[OrderRequirementType["Condition"] = 3] = "Condition";
})(OrderRequirementType || (OrderRequirementType = {}));
export var CargoSize;
(function (CargoSize) {
    CargoSize[CargoSize["S"] = 1] = "S";
    CargoSize[CargoSize["M"] = 2] = "M";
    CargoSize[CargoSize["L"] = 4] = "L";
    CargoSize[CargoSize["XL"] = 6] = "XL";
})(CargoSize || (CargoSize = {}));
export const dsData = new DataService();
//# sourceMappingURL=DataService.js.map