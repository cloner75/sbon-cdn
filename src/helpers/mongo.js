// Configs
import config from './../configs/config';

// CONSTS
// const ASC = 'asc';
const ORDER_DEFAULT = -1;
const CREATED_AT = 'createdAt';
const LIMIT_DEFAULT = 10;
const SKIP_DEFAULT = 1;
const PAGE_DEFAULT = 1;
const DATE_DEFAULT = '2017-01-01T01:00:00.000Z';
const ISO_DATE = 'T01:00:00.000Z';

class Mongo {
    constructor() { }
    /**
     * TODO select allow fields
     * @param {string} fields
     * @returns {string} allowFields
     */
    static selectAllowFields(fields, select) {
        let result = '';
        for (let item of fields.split(',')) {
            if (config.defaultFields[select].includes(item)) {
                result += `${item} `;
            }
        }
        return result;
    }
    /**
     * TODO initial option and where query
     * @param {object} query
     * @return {object} option
     * @return {object} where
     */
    static initialMongoQuery(query, select) {
        const { fields, limit, skip, sort, order, page, ids, ...where } = query;
        const {
            createdAtFrom,
            createdAtTo,
            updatedAtFrom,
            updatedAtTo,
            ...rest
        } = where;
        const result = {
            options: {
                select: fields
                    ? this.selectAllowFields(fields, select)
                    : config.defaultFields[select].join(' '),
                limit: Number(limit) || LIMIT_DEFAULT,
                skip: Number(skip) || SKIP_DEFAULT,
                page: Number(page) || PAGE_DEFAULT,
                sort: sort || CREATED_AT,
                order: order
                    ? order.replace('asc', 1).replace('desc', -1)
                    : ORDER_DEFAULT,
            },
            where: {
                ...rest,
                createdAt: {
                    $gte: createdAtFrom ? createdAtFrom.concat(ISO_DATE) : DATE_DEFAULT,
                    $lt: createdAtTo
                        ? createdAtTo.concat(ISO_DATE)
                        : new Date().toISOString(),
                },
                updatedAt: {
                    $gte: updatedAtFrom ? updatedAtFrom.concat(ISO_DATE) : DATE_DEFAULT,
                    $lte: updatedAtTo
                        ? updatedAtTo.concat(ISO_DATE)
                        : new Date().toISOString(),
                },
            },
        };
        // Add ids to where
        if ('ids' in query) {
            const idResult = Helper.makeArrayFromIds(ids);
            if (idResult) {
                Object.assign(result.where, { _id: { $in: idResult } });
            }
        }
        return result;
    }
}
export default Mongo;
