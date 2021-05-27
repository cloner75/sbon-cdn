// Package

// Consts
import configs from './../configs/config';

/**
 * TODO Manage Response
 */
class Response {
    constructor() {
    }
    /**
     * TODO Response Generator
     * @param {object} data 
     */
    static generator(status, data = null) {
        const config = configs.status[status];
        return {
            success: config.success,
            message: config.message,
            data,
        };
    }
}

export default Response;