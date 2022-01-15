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

        completionStatus: number;
    }


    interface IOrderRequirement {
        reqType: number;
        valueX10: number;
        unit?: string;
    }


    interface INamedEntity {
        id: number;
        name: string;
    }

    interface IOrderLocation extends INamedEntity { }

    interface IOrderCategory extends INamedEntity { }

    interface IOrderTag extends INamedEntity { }

    interface IOrderFilter {
        locType: number;
        locId?: number;
        completions: ObjDict<boolean>;
    }

}

export { };