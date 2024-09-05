import { PrismaClient } from '@prisma/client';
export async function getPaginatedData<T>(client: PrismaClient, model: string, query: object, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const modelClient = client[model];
    const [data, totalRecords] = await Promise.all([
    modelClient.findMany({
        ...query,
        skip,
        take: limit,
    }),
    modelClient.count(), // Get the total number of records
    ]);

    return {
    data,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    currentPage: page,
    };
}