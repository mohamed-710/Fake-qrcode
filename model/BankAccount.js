import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0, 
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
    ],
}, { timestamps: true });

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
