// Packages
import fs from 'fs';

// Models
import UploadModel from './../models/upload';

// Helpers
import MongoHelper from './../helpers/mongo';
import Response from './../helpers/response';
import UploadHelper from './../helpers/uploader';
import Logger from './../helpers/logger';

// Configs
import configTypes from './../configs/mimeTypes';


// Consts
const Upload = new UploadHelper();
const UPLOAD = 'upload';

/**
 * TODO: The Controller service
 *
 * @class Controller
 * @example
 * var Ctrl = new Controller();
 */
export default class UploadController {
    /**
     * TODO Create Document
     * @param {request} req 
     * @param {Reply} reply 
     */
    async upload(req, reply) {
        const start = Date.now();
        try {
            req.body.type = req.url.split('/')[4];
            const urls = await Upload.upload({
                body: req.body,
                files: req.body.type === 'product' ? req.files : [req.file],
            });
            const create = await UploadModel.insertMany(urls);
            Logger.info({
                controller: 'UploadController',
                api: 'upload',
                isSuccess: true,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(200).send({
                message: true,
                create: req.body.type === 'product' ? create : create[0],
            });
        } catch (err) {
            Logger.error({
                controller: 'UploadController',
                api: 'upload',
                isSuccess: false,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * TODO Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async show(req, reply) {
        const start = Date.now();
        try {
            const fileName = req.params.name;
            const { type } = req.query;
            const file = await UploadModel.findOne({ fileName });
            if (!file) {
                return reply.status(404).send(Response.generator(404));
            }
            const types = ['thumbnail', '128', '512', 'blur'];
            let addressFile = fileName;
            if (
                configTypes.mimetypes[file.mimeType].type === 'image' &&
                type !== undefined &&
                types.includes(type)
            ) {
                addressFile = `${type}-${fileName}`;
            }
            fs.readFile(`./uploads/${addressFile}`, (_err, fileBuffer) => {
                Logger.info({
                    controller: 'UploadController',
                    api: 'show',
                    isSuccess: true,
                    message: '200',
                    time: start - Date.now()
                });
                reply
                    .header('Content-Type', `${file.mimeType};application/octet-stream`)
                    .send(fileBuffer);
            });
        } catch (err) {
            Logger.error({
                controller: 'UploadController',
                api: 'upload',
                isSuccess: false,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * TODO Get Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async find(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, UPLOAD);
            const result = await UploadModel.paginate(where, options);
            Logger.info({
                controller: 'UploadController',
                api: 'find',
                isSuccess: true,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(200).send(Response.generator(200, result));
        } catch (err) {
            Logger.error({
                controller: 'UploadController',
                api: 'find',
                isSuccess: false,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * TODO Get One Document
     * @param {request} req 
     * @param {Reply} reply 
     */
    async findOne(req, reply) {
        const start = Date.now();
        try {
            const { where, options } = MongoHelper.initialMongoQuery(req.query, UPLOAD);
            const result = await UploadModel.paginate({ _id: req.params.id, ...where }, options);
            Logger.info({
                controller: 'UploadController',
                api: 'findOne',
                isSuccess: true,
                message: '200',
                time: start - Date.now()
            });
            return reply.status(200).send(Response.generator(200, result.docs[0]));
        } catch (err) {
            Logger.error({
                controller: 'UploadController',
                api: 'findOne',
                isSuccess: true,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }

    /**
     * TODO Remove Documents
     * @param {request} req 
     * @param {Reply} reply 
     */
    async remove(req, reply) {
        const start = Date.now();
        try {
            const getFile = await UploadModel.findByIdAndDelete(req.params.id);
            if (!getFile) {
                Logger.info({
                    controller: 'UploadController',
                    api: 'remove',
                    isSuccess: true,
                    message: '404',
                    time: start - Date.now()
                });
                return reply.status(404).send(Response.generator(404));
            }
            await fs.unlinkSync(`./uploads/${getFile.fileName}`);
            if (getFile.typeFile === 'image') {
                await fs.unlinkSync(`./uploads/128-${getFile.fileName}`);
                await fs.unlinkSync(`./uploads/512-${getFile.fileName}`);
                await fs.unlinkSync(`./uploads/blur-${getFile.fileName}`);
                await fs.unlinkSync(`./uploads/thumbnail-${getFile.fileName}`);
            }
            Logger.info({
                controller: 'UploadController',
                api: 'upload',
                isSuccess: true,
                message: '200',
                time: start - Date.now()
            });
            return reply.send(Response.generator(200));
        } catch (err) {
            Logger.error({
                controller: 'UploadController',
                api: 'remove',
                isSuccess: false,
                message: err.message,
                time: start - Date.now()
            });
            return reply.status(500).send(Response.generator(500, err.message));
        }
    }
}