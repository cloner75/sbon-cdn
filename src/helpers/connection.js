// Packages
import mongoose from 'mongoose';

/**
 * TODO Class For Connection Service
 */
class Connection {
    /**
     * TODO Constructor
     * @param {class} app
     */
    constructor(app) {
        this._port = process.env.PORT;
        this.app = app;
    }

    /**
     * TODO Setting And Router
     */
    async settings() {
        this.app.addContentTypeParser('*', (_req, done) => done());
        this.app.setErrorHandler((error, request, reply) => {
            if (error) {
                reply.send(error);
            }
        });
        this.app.register(require('./../routers'), { logLevel: 'info' });
        await this.app.register(require('fastify-express'));
        this.app.use(require('cors')());
        this.app.use(require('dns-prefetch-control')());
        this.app.use(require('frameguard')());
        this.app.use(require('hsts')());
        this.app.use(require('ienoopen')());
        this.app.use(require('x-xss-protection')());
        return this.app;
    }

    /**
     * TODO Connect To Mongodb
     */
    database() {
        const {
            MONGO_HOST,
            MONGO_PORT,
            MONGO_DATABASE,
            MONGO_USERNAME,
            MONGO_PASSWORD
        } = process.env;
        let dbConfig = {
            auth: 'authSource=admin&w=1'
        };
        switch (process.env.NODE_ENV) {
            case 'production':
                Object.assign(dbConfig, {
                    address: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
                });
                break;
            case 'development':
                Object.assign(dbConfig, {
                    address: `mongodb://localhost:27017/sbon`
                });
                break;
        }
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(
                `${dbConfig.address}?${dbConfig.auth}`,
                {
                    useNewUrlParser: true,
                    useFindAndModify: false,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                },
                (error) => {
                    if (error) {
                        console.error(`Mongo error :${error}`);
                        process.exit(1);
                    } else {
                        console.info('🚀 Mongodb ready at :', dbConfig.address);
                    }
                },
            );
        }
    }

    /**
     * TODO Start Server
     * @param {class} app
     */
    server() {
        this.settings().then(_response => {
            this.app.listen(this._port, process.env.HOST, (err, address) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log(`🚀 Server ready at ${address}`);
                this.database();
            });
        });
    }
}

export default Connection;
