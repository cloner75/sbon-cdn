// Packages
import joi from 'joi';

// Confings
import configs from './../configs/config';
const messages = {
    'any.required': configs.errors[1],
    'object.unknown': configs.errors[1],
    'array.base': configs.errors[2],
    'string.base': configs.errors[2],
    'string.pattern.base': configs.errors[2],
    'any.only': configs.errors[2],
    'string.empty': configs.errors[10],
    'string.min': configs.errors[11],
    'string.max': configs.errors[12],
};

// Export Schemas
export default {
    // TODO Export Deafualt Messages
    messages,

    // TODO  Schema Register
    upload: {
        schema: {
            body: joi
                .object({
                    password: joi.string().trim().required(),
                    phone: joi
                        .string()
                        .trim()
                        .pattern(/^09\d{9}$/)
                        .required(),
                    minishopId: joi
                        .string()
                        .trim()
                        .pattern(/^[0-9a-fA-F]{24}$/)
                        .required()
                })
        },
        validatorCompiler: ({ schema }) => {
            return (data) => schema.validate(data);
        },
    },

    // TODO Schema Find
    show: {
        schema: {
            querystring: joi
                .object({
                    skip: joi.number(),
                    limit: joi.number(),
                    sort: joi
                        .string()
                        .trim()
                        .valid('createdAt', 'updatedAt', 'minishopId'),
                    order: joi.string().trim().valid('asc', 'desc'),
                    fields: joi.string().trim(),
                })
        },
        validatorCompiler: ({ schema }) => {
            return (data) => schema.validate(data);
        },
    },

    // TODO Schema Find
    find: {
        schema: {
            querystring: joi
                .object({
                    skip: joi.number(),
                    limit: joi.number(),
                    sort: joi
                        .string()
                        .trim()
                        .valid('createdAt', 'updatedAt', 'minishopId'),
                    order: joi.string().trim().valid('asc', 'desc'),
                    fields: joi.string().trim(),
                }).unknown()
        },
        validatorCompiler: ({ schema }) => {
            return (data) => schema.validate(data);
        },
    },

    // TODO Schema FindOne
    findOne: {
        schema: {
            params: joi.object({
                id: joi
                    .string()
                    .trim()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .required()
                    .messages(messages),
            }),
            querystring: joi
                .object({
                    skip: joi.number(),
                    limit: joi.number(),
                    sort: joi
                        .string()
                        .trim()
                        .valid('createdAt', 'updatedAt', 'minishopId'),
                    order: joi.string().trim().valid('asc', 'desc'),
                    fields: joi.string().trim(),
                })
                .unknown(),
        },
        validatorCompiler: ({ schema }) => {
            return (data) => schema.validate(data);
        },
    },

    // TODO Schema Delete
    delete: {
        schema: {
            params: joi
                .object({
                    id: joi
                        .string()
                        .trim()
                        .pattern(/^[0-9a-fA-F]{24}$/)
                        .required()
                        .messages(messages),
                }),
        },
        validatorCompiler: ({ schema }) => {
            return (data) => schema.validate(data);
        },
    },
};