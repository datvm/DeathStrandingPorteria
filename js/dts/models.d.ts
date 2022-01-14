declare global {

    interface IOrderDataRefined {
        orders: ObjDict<IOrderInfo>;
        locations: ObjDict<IOrderLocation>;
        categories: ObjDict<IOrderCategory>;
        tags: ObjDict<IOrderTag>;
    }

    interface IOrderData {
        orders: IOrderInfo[];
        locations: IOrderLocation[];
        categories: IOrderCategory[];
        tags: IOrderTag[];
        
        // Enums are not used for now
    }

    interface IOrderInfo {
        id: number;
        name: string;
        startLocationId: number;
        destLocationId: number;
        categoryId: number;
        reqStandard: IOrderRequirement[];
        reqPremium: IOrderRequirement[];
        tags: number[];
        maxLike: number;
        maxLikePremium: number;
        weightX10: number;
        sizes: ObjDict<number>;
    }

    enum CargoSize {
        S = 1,
        M = 2,
        L = 4,
        XL = 6
    }

    interface IOrderRequirement {
        reqType: OrderRequirementType;
        valueX10: number;
        unit?: string;
    }

    enum OrderRequirementType {
        TimeLimit = 0,
        Quantity = 1,
        MinWeight = 2,
        Condition = 3
    }

    interface INamedEntity {
        id: number;
        name: string;
    }

    interface IOrderLocation extends INamedEntity { }

    interface IOrderCategory extends INamedEntity { }

    interface IOrderTag extends INamedEntity { }

}

export { };