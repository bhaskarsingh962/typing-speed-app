import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    errorCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', required: true },
}, { 
    timestamps: true 
});

const resultModel = mongoose.models.Result || mongoose.model('Result', resultSchema);

export default resultModel;