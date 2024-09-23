import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answer: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Answer = mongoose.model('Answer', AnswerSchema);
export default Answer;