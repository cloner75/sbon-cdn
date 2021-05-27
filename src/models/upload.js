// Packages
import { set, model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate';

// Setting mongoose
set('useFindAndModify', false);
set('useCreateIndex', true);

const schema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, required: false },
        visionId: { type: Schema.Types.ObjectId, required: false }, // categoryId or ProductId or UserId
        typeReceive: { type: String, required: true }, // 0 => category 1->product 2 => profile
        fileName: { type: String, required: true, index: true },
        typeFile: { type: String, required: true, index: true },
        mimeType: { type: String, required: true },
        size: { type: String, required: true },
        path: { type: String, required: false },
        originalName: { type: String, required: false },
        encoding: { type: String, required: false },
        destination: { type: String, required: false },
        buffer: { type: Buffer, required: false },
        fieldname: { type: String, required: false },
        formats: {
            128: { type: String, required: false },
            512: { type: String, required: false },
            thumbnail: { type: String, required: false },
            blur: { type: String, required: false },
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        minimize: false,
        versionKey: false,
    },
);

// Add plugins
schema.plugin(paginate);

const modelSchema = model('files', schema);

// Index fields
modelSchema.ensureIndexes((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("create model's indexes successfully");
    }

});

export default modelSchema;
