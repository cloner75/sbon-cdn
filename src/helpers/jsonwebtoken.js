// Package
import jsonwebtoken from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Consts
// const privateKey = fs.readFileSync(path.resolve(__dirname, './../../jwtRS256.key'));
// const cert = fs.readFileSync(path.resolve(__dirname, './../../jwtRS256.key.pub'));

/**
 * TODO Manage Jsonwebtoken
 */
class JWT {
    constructor() {
    }
    /**
     * TODO Sign Jwt
     * @param {object} data 
     */
    async generate(data = {}) {
        return jsonwebtoken.sign(data, process.env.SECRET_JWT, { expiresIn: '24h' });
    }

    /**
     * TODO verify token
     * @param {string} token 
     */
    verify(token) {
        return jsonwebtoken.verify(token, process.env.SECRET_JWT);
    }

    /**
     * TODO Decode token
     * @param {string} token 
     */
    decode(token) {
        return jsonwebtoken.decode(token, process.env.SECRET_JWT);
    }
}

export default JWT;