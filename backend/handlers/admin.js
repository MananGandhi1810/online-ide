import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUsersHandler = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                admin: true,
                points: true,
                createdAt: true,
                updatedAt: true,
                authProvider: true,
                _count: {
                    select: {
                        submissions: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json({
            success: true,
            message: "Users fetched successfully",
            data: { users },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            data: null,
        });
    }
};

const toggleUserAdminStatusHandler = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            data: null,
        });
    }

    try {
        // Get the current user status
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { admin: true },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }

        // Toggle the admin status
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { admin: !user.admin },
            select: {
                id: true,
                name: true,
                email: true,
                admin: true,
            },
        });

        res.json({
            success: true,
            message: `User admin status ${updatedUser.admin ? "granted" : "revoked"} successfully`,
            data: { user: updatedUser },
        });
    } catch (error) {
        console.error("Error toggling user admin status:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating user",
            data: null,
        });
    }
};

const getUserStatsHandler = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const verifiedUsers = await prisma.user.count({
            where: { isVerified: true },
        });
        const adminUsers = await prisma.user.count({
            where: { admin: true },
        });
        const totalSubmissions = await prisma.submission.count();
        const successfulSubmissions = await prisma.submission.count({
            where: { success: true },
        });
        const problemsCount = await prisma.problemStatement.count();

        // Get recent registrations (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentUsers = await prisma.user.count({
            where: { createdAt: { gte: lastWeek } },
        });

        res.json({
            success: true,
            message: "Stats fetched successfully",
            data: {
                totalUsers,
                verifiedUsers,
                adminUsers,
                totalSubmissions,
                successfulSubmissions,
                problemsCount,
                recentUsers,
            },
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching stats",
            data: null,
        });
    }
};

export {
    getAllUsersHandler,
    toggleUserAdminStatusHandler,
    getUserStatsHandler,
};
