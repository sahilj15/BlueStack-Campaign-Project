// campaign and price model definition
export interface PriceInfo {
    firstMonth: Number;
    sixMonth: Number;
    year: Number;
}

export interface Campaign {
    id: number;
    campaignDate: string;
    dateDiffText: string;
    name: string;
    region: string;
    image_url: string;
    csv: string;
    report: string;
    price: PriceInfo;
    sortValue: number;
}
