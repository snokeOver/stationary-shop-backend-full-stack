import { Query } from "mongoose";

export class QueryBuilder<T> {
  constructor(
    public queryModel: Query<T[], T>,
    public query: Record<string, unknown>
  ) {}

  search(searchFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    const searchQuery = searchTerm
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" },
          })),
        }
      : {};

    this.queryModel = this.queryModel.find(searchQuery);
    return this;
  }

  filter() {
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    const copiedQuery = { ...this.query };

    excludeFields.forEach((el) => delete copiedQuery[el]);

    // Handle minPrice and maxPrice
    if (copiedQuery.minPrice || copiedQuery.maxPrice) {
      // Build the price filter object
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if (copiedQuery.minPrice) {
        priceFilter.$gte = Number(copiedQuery.minPrice);
      }
      if (copiedQuery.maxPrice) {
        priceFilter.$lte = Number(copiedQuery.maxPrice);
      }
      // Add price filter to the query
      copiedQuery.price = priceFilter;

      // Remove minPrice and maxPrice from the copied query
      delete copiedQuery.minPrice;
      delete copiedQuery.maxPrice;
    }

    this.queryModel = this.queryModel.find(copiedQuery);
    return this;
  }

  sort() {
    const sortQuery = this?.query?.sort || "-createdAt"; //Default sort based on createdAt

    this.queryModel = this.queryModel.sort(sortQuery as string);
    return this;
  }

  paginate() {
    const limitQuery = Number(this?.query?.limit) || 6;
    const pageQuery = Number(this?.query?.page) || 1;
    const skipQuery = (pageQuery - 1) * limitQuery;

    this.queryModel = this.queryModel.skip(skipQuery).limit(limitQuery);
    return this;
  }

  selectFields() {
    const fieldsQuery =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";

    this.queryModel = this.queryModel.select(fieldsQuery);
    return this;
  }
}
