import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// This endpoint will be used to create the first admin in the system
// It should only work once and checks for existing admins in the database
const createFirstAdminHandler = async (req, res) => {
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

    // Check if the user making the request is an admin
    if (!req.user || !req.user.admin) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action",
            data: null,
        });
    }

    return res.json({
        success: true,
        message: "First admin setup is complete",
        data: null,
    });
};

export default createFirstAdminHandler;
