import User from "../model/User.js";
import BankAccount from "../model/BankAccount.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
    try {
        const { email } = req.user;

     
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "User not found" });
        }


        const bankAccount = await BankAccount.findOne({ user: user._id });
        if (!bankAccount) {
            return res.status(404).json({ statusCode: 404, message: "Bank account not found" });
        }


        const profileData = {
            statusCode: 200,
            message: "Profile fetched successfully",
            data: {
                name: user.name,
                email: user.email,
                balance: bankAccount.balance,
            }
        };

        res.status(200).json(profileData);
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const { name, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: "User not found" });
        }

        if (name) user.name = name;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ statusCode: 200, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error", error: error.message });
    }
};
