import { Schema, model } from 'mongoose';

const AnswerSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    answer: Schema.Types.Mixed
}, { timestamps: true });

const Answer = model('Answer', AnswerSchema);
export default Answer;