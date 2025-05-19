import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const prisma = new PrismaClient();

// This endpoint will be used to create the first admin in the system
// It should only work once and requires an admin email to be set in the env file
const createFirstAdminHandler = async (req, res) => {
    if (!ADMIN_EMAIL) {
        return res.status(400).json({
            success: false,
            message: "ADMIN_EMAIL is not set in environment variables",
            data: null,
        });
    }

    // Check if there are already admins in the system
    const adminCount = await prisma.user.count({
        where: { admin: true },
    });

    if (adminCount > 0) {
        return res.status(400).json({
            success: false,
            message: "Admins already exist in the system",
            data: null,
        });
    }

    // Find the user with the admin email
    const user = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL },
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User with admin email not found",
            data: null,
        });
    }

    // Make the user an admin
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { admin: true },
        select: {
            id: true,
            email: true,
            name: true,
            admin: true,
        },
    });

    return res.json({
        success: true,
        message: "First admin created successfully",
        data: {
            user: updatedUser,
        },
    });
};

export default createFirstAdminHandler;
