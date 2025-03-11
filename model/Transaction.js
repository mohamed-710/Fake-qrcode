import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount", required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
