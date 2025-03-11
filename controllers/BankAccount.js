import BankAccount from "../model/BankAccount.js";
import Transaction from "../model/Transaction.js";
import User from "../model/User.js";

export const getBalance = async (req, res) => {
    try {
        console.log("Decoded User:", req.user);

        const account = await BankAccount.findOne({ user: req.user._id });

        if (!account) {
            return res.status(404).json({ statusCode: 404, message: "Bank account not found" });
        }

        res.status(200).json({ statusCode: 200, balance: account.balance });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error", error: error.message });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const { email } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = 5; 
        const skip = (page - 1) * limit;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "User not found" });
        }

        const account = await BankAccount.findOne({ user: user._id });
        if (!account) {
            return res.status(404).json({ statusCode: 404, message: "Bank account not found" });
        }

        const totalTransactions = await Transaction.countDocuments({
            $or: [{ sender: account._id }, { receiver: account._id }],
        });

        const transactions = await Transaction.find({
            $or: [{ sender: account._id }, { receiver: account._id }],
        })
            .populate({
                path: "sender",
                populate: { path: "user", select: "email" },
            })
            .populate({
                path: "receiver",
                populate: { path: "user", select: "email" },
            })
            .sort({ timestamp: -1 }) 
            .skip(skip)
            .limit(limit);

        const formattedTransactions = transactions.map((transaction) => ({
            amount: transaction.amount,
            timestamp: transaction.timestamp,
        }));

        res.status(200).json({
            statusCode: 200,
            totalTransactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            transactions: formattedTransactions,
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error", error: error.message });
    }
};

export const transferMoney = async (req, res) => {
    try {
        const { receiverEmail, amount } = req.body;

        if (!receiverEmail || !amount || amount <= 0) {
            return res.status(400).json({ statusCode: 400, message: "Invalid input data" });
        }

        const senderUser = await User.findOne({ email: req.user.email });
        const receiverUser = await User.findOne({ email: receiverEmail });

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ statusCode: 404, message: "Sender or receiver account not found" });
        }

        const senderAccount = await BankAccount.findOne({ user: senderUser._id });
        const receiverAccount = await BankAccount.findOne({ user: receiverUser._id });

        if (!senderAccount || !receiverAccount) {
            return res.status(404).json({ statusCode: 404, message: "Sender or receiver bank account not found" });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ statusCode: 400, message: "Insufficient balance" });
        }

        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        await senderAccount.save();
        await receiverAccount.save();

        const transaction = new Transaction({
            sender: senderAccount._id,
            receiver: receiverAccount._id,
            amount,
        });
        await transaction.save();

        res.status(200).json({ statusCode: 200, message: "Transfer successful", transaction });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error", error: error.message });
    }
};
