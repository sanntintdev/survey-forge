import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
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

const Question = mongoose.model('Question', QuestionSchema);
export default Question;