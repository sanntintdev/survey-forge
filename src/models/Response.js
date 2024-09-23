import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    respondentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answers: [answerSchema],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Response = mongoose.model('Response', ResponseSchema);
export default Response;