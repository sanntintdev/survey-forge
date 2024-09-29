import { Schema, model } from 'mongoose';

const SurveySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    creatorId: {
        type: Schema.Types.ObjectId,
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

const Survey = model('Survey', SurveySchema);
export default Survey;