// Packages
import multer from 'fastify-multer';
import sizeOf from 'image-size';
import jimp from 'jimp';
import { promisify } from 'util';

// Helpers
import Response from './response';

// Configs
import configTypes from './../configs/mimeTypes';

// Consts
const LIMIT = 100000;

// modules
class Upload {
    /**
     * TODO Set config
     */
    config(type) {
        switch (type) {
            case 'product':
                return multer({
                    storage: multer.diskStorage({
                        destination: (_req, _file, cb) => {
                            cb(null, 'uploads/');
                        },
                    }),
                    fileFilter: (_req, file, cb) => {
                        const checkType = configTypes.mimetypes[file.mimetype];
                        checkType && checkType.type === 'image'
                            ? cb(null, true)
                            : cb(new Error('File Type Not Permissend'));
                    },
                    limits: { fileSize: LIMIT * 1024 * 1024 },
                    preservePath: true,
                }).array('product', 15);
            case 'profile':
                return multer({
                    storage: multer.diskStorage({
                        destination: (_req, _file, cb) => {
                            cb(null, 'uploads/');
                        },
                    }),
                    fileFilter: (_req, file, cb) => {
                        Object.keys(configTypes.mimetypes).includes(file.mimetype)
                            ? cb(null, true)
                            : cb(new Error('File Type Not Permissend'));
                    },
                    limits: { fileSize: LIMIT * 1024 * 1024 },
                    preservePath: true,
                }).single('profile');
            case 'category':
                return multer({
                    storage: multer.diskStorage({
                        destination: (_req, _file, cb) => {
                            cb(null, 'uploads/');
                        },
                    }),
                    fileFilter: (_req, file, cb) => {
                        const checkType = configTypes.mimetypes[file.mimetype];
                        checkType && checkType.type === 'image'
                            ? cb(null, true)
                            : cb(new Error('File Type Not Permissend'));
                    },
                    limits: { fileSize: LIMIT * 1024 * 1024 },
                    preservePath: true,
                }).single('category');
            case 'brand':
                return multer({
                    storage: multer.diskStorage({
                        destination: (_req, _file, cb) => {
                            cb(null, 'uploads/');
                        },
                    }),
                    fileFilter: (_req, file, cb) => {
                        const checkType = configTypes.mimetypes[file.mimetype];
                        checkType && checkType.type === 'image'
                            ? cb(null, true)
                            : cb(new Error('File Type Not Permissend'));
                    },
                    limits: { fileSize: LIMIT * 1024 * 1024 },
                    preservePath: true,
                }).single('brand');
            case 'option':
                return multer({
                    storage: multer.diskStorage({
                        destination: (_req, _file, cb) => {
                            cb(null, 'uploads/');
                        },
                    }),
                    fileFilter: (_req, file, cb) => {
                        const checkType = configTypes.mimetypes[file.mimetype];
                        checkType && checkType.type === 'image'
                            ? cb(null, true)
                            : cb(new Error('File Type Not Permissend'));
                    },
                    limits: { fileSize: LIMIT * 1024 * 1024 },
                    preservePath: true,
                }).single('option');
        }
    }

    /**
     * TODO Updload File
     * @param {object} files
     */
    upload({ body, files }) {
        return new Promise(async (resolve, reject) => {
            try {
                const { HOST } = process.env;
                const urls = [];
                for (let file of files) {
                    const {
                        filename,
                        fieldname,
                        path,
                        originalname: originalName,
                        mimetype: mimeType,
                        size,
                        encoding,
                        destination,
                    } = file;
                    const typeFile = configTypes.mimetypes[mimeType].type;
                    const fileUrls = {
                        cdnAddress: `${HOST}${filename}`,
                    };
                    Object.assign(fileUrls, {
                        success: true,
                        cdnAddress: `${HOST}${filename}`,
                        channelId: body.channelId,
                        fileName: filename,
                        userId: body.userId,
                        path,
                        originalName,
                        mimeType,
                        size,
                        typeFile,
                        typeReceive: body.type,
                        encoding,
                        destination,
                        fieldname,
                    });
                    if (typeFile === 'image') {
                        Object.assign(fileUrls, {
                            formats: {
                                thumbnail: `${HOST}${filename}?type=thumbnail`,
                                512: `${HOST}${filename}?type=512`,
                                128: `${HOST}${filename}?type=128`,
                                blur: `${HOST}${filename}?type=blur`,
                            },
                        });
                        this.resizeImage(filename);
                    }
                    urls.push(fileUrls);
                }
                resolve(urls);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * TODO Resize Image
     * @param {files} files
     */
    resizeImage(filename) {
        const { height, width } = sizeOf(`./uploads/${filename}`);
        const converLiset = [
            {
                fileName: `thumbnail-${filename}`,
                width: 256,
                height: height / (width / 256),
                quality: 50,
            },
            {
                fileName: `512-${filename}`,
                width: 512,
                height: height / (width / 512),
                quality: 40,
            },
            {
                fileName: `128-${filename}`,
                width: 128,
                height: height / (width / 128),
                quality: 30,
            },
            {
                fileName: `blur-${filename}`,
                width: 128,
                height: height / (width / 128),
                quality: 50,
                blur: 5,
            },
        ];
        jimp.read(`./uploads/${filename}`, (_err, image) => {
            for (let item of converLiset) {
                image.resize(item.width, item.height).quality(item.quality);
                item.blur ? image.blur(item.blur) : false;
                image.write(`./uploads/${item.fileName}`);
            }
        });
    }

    /**
     * TODO Error Handl Multer
     *
     */
    async errorHandler(req, res, next) {
        try {
            const checkFile = promisify(this.config);
            await checkFile(req, res);
            next();
        } catch (error) {
            return res.status(422).send(Response.generator(422));
        }
    }
}

export default Upload;
