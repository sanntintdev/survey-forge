import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'closed'],
        default: 'draft'
    },
    startDate: Date,
    endDate: Date,
    questions: [questionSchema]

}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
export default Survey;