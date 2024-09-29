import { Schema, model } from 'mongoose';

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Group = model('Group', GroupSchema);
export default Group;