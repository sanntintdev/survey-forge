import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['multiple_choice', 'open_ended', 'rating']
    },
    text: {
        type: String,
        required: true
    },
    options: [String],
    isRequired: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Question = model('Question', QuestionSchema);
export default Question;