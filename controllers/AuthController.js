import User from "../model/User.js";
import jwt from "jsonwebtoken";
import BankAccount from "../model/BankAccount.js";

const generateJwt = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ statusCode: 400, message: "All fields are required." });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ statusCode: 400, message: "Email already exists." });
        }

        const newUser = new User({ email, password, name });
        await newUser.save();
        const bankAccount = new BankAccount({
            user: newUser._id,
            balance: 10000, 
        });
        await bankAccount.save();

        const token = generateJwt(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            statusCode: 201,
            message: "Signup successful.",
            user: { 
                name: newUser.name,
                email: newUser.email,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error.", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ statusCode: 400, message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(400).json({ statusCode: 400, message: "Invalid email or password." });
        }

        const token = generateJwt(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            statusCode: 200,
            message: "Login successful.",
            user: { ...user._doc, password: undefined, token },
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error.", error: error.message });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ statusCode: 200, message: "Logout successful." });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Server error.", error: error.message });
    }
};

export { login, signup, logout };
