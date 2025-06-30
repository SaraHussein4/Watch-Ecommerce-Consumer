export interface ProductFilter {
    searchTerm?: string;
    sortBy?: 'newest' | 'priceLowToHigh' | 'priceHighToLow';
    genders?: ('male' | 'female')[];
    categoryIds?: number[];
    brandIds?: number[];
    page?: number;
    pageSize?: number;
}