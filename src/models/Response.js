import { Schema, model } from 'mongoose';

const ResponseSchema = new Schema({
    surveyId: {
        type: Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    respondentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    answers: [answerSchema],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Response = model('Response', ResponseSchema);
export default Response;