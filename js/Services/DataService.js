class DataService {
    orderList;
    dataDicts;
    async initAsync() {
        const data = await fetch("/DSOrders.json")
            .then(r => r.json());
        this.orderList = data.orders;
        this.dataDicts = {
            orders: data.orders.toDict(q => q.id.toString()),
            categories: data.categories.toDict(q => q.id.toString()),
            locations: data.locations.toDict(q => q.id.toString()),
            tags: data.tags.toDict(q => q.id.toString()),
        };
    }
}
export const dsData = new DataService();
//# sourceMappingURL=DataService.js.map