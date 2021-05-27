// Controllers
import UploadController from '../controllers/upload';

// Midds
import Midd from './../middlewares/schema';

// Hookes
import Hooks from './../helpers/hooks';
import UploadHelper from './../helpers/uploader';

// Controller
const Upload = new UploadController();

// Consts
const uploader = new UploadHelper();
const uploadProduct = uploader.config('product');
const uploadProfile = uploader.config('profile');
const uploadCategory = uploader.config('category');
const uploadBrand = uploader.config('brand');
const uploadOption = uploader.config('option');

const url = '/api/v1/upload';

// Routes
export default (fastify, _opts, done) => {
    // Hooks
    fastify.addHook('preHandler', Hooks.authorization);

    // Routes
    fastify.route({
        method: 'POST',
        url: '/product',
        preHandler: [uploadProduct],
        handler: Upload.upload,
    });

    fastify.route({
        method: 'POST',
        url: '/profile',
        preHandler: [uploadProfile],
        handler: Upload.upload,
    });

    fastify.route({
        method: 'POST',
        url: '/category',
        preHandler: [uploadCategory],
        handler: Upload.upload,
    });

    fastify.route({
        method: 'POST',
        url: '/brand',
        preHandler: [uploadBrand],
        handler: Upload.upload,
    });

    fastify.route({
        method: 'POST',
        url: '/option',
        preHandler: [uploadOption],
        handler: Upload.upload,
    });

    fastify.get('/show/:name', Upload.show);

    done();
};
