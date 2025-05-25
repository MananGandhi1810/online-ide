import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUsersHandler = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isVerified: true,
                admin: true,
                points: true,
                authProvider: true,
                imageUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        submissions: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.json({
            success: true,
            message: "Users fetched successfully",
            data: { users }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            data: null
        });
    }
};

const toggleUserAdminStatusHandler = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            data: null
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // Don't allow admin to remove their own admin status
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own admin status",
                data: null
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { admin: !user.admin },
            select: {
                id: true,
                email: true,
                name: true,
                admin: true
            }
        });

        return res.json({
            success: true,
            message: `User admin status ${updatedUser.admin ? 'granted' : 'revoked'} successfully`,
            data: { user: updatedUser }
        });
    } catch (error) {
        console.error("Error toggling admin status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user admin status",
            data: null
        });
    }
};

const getUserSubmissionsAdminHandler = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            data: null
        });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    try {
        const submissions = await prisma.submission.findMany({
            where: { userId },
            select: {
                id: true,
                code: true,
                language: true,
                status: true,
                success: true,
                execTime: true,
                time: true,
                problemStatement: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                    },
                },
            },
            skip,
            take: parseInt(limit),
            orderBy: {
                time: 'desc'
            }
        });

        const totalSubmissions = await prisma.submission.count({
            where: { userId }
        });

        return res.json({
            success: true,
            message: "User submissions fetched successfully",
            data: { 
                submissions,
                pagination: {
                    total: totalSubmissions,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(totalSubmissions / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error("Error fetching user submissions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user submissions",
            data: null
        });
    }
};

const getProblemStatementsAdminHandler = async (req, res) => {
    try {
        const problemStatements = await prisma.problemStatement.findMany({
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        submissions: true,
                        testCase: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.json({
            success: true,
            message: "Problem statements fetched successfully",
            data: { problemStatements }
        });
    } catch (error) {
        console.error("Error fetching problem statements:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch problem statements",
            data: null
        });
    }
};

const getAdminDashboardStatsHandler = async (req, res) => {
    try {
        const stats = await prisma.$transaction([
            prisma.user.count(),
            prisma.problemStatement.count(),
            prisma.submission.count(),
            prisma.submission.count({
                where: {
                    success: true
                }
            })
        ]);

        return res.json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: {
                totalUsers: stats[0],
                totalProblems: stats[1],
                totalSubmissions: stats[2],
                successfulSubmissions: stats[3]
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            data: null
        });
    }
};

const moderateProblemStatementHandler = async (req, res) => {
    const { problemId } = req.params;
    const { status, moderationComment } = req.body;
    
    if (!problemId || !status) {
        return res.status(400).json({
            success: false,
            message: "Problem ID and status are required",
            data: null
        });
    }

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value",
            data: null
        });
    }

    try {
        const problemStatement = await prisma.problemStatement.update({
            where: { id: problemId },
            data: {
                moderationStatus: status,
                moderationComment: moderationComment || null,
                moderatedAt: new Date(),
                moderatedById: req.user.id
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.json({
            success: true,
            message: "Problem statement moderated successfully",
            data: { problemStatement }
        });
    } catch (error) {
        console.error("Error moderating problem statement:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to moderate problem statement",
            data: null
        });
    }
};

const banUserHandler = async (req, res) => {
    const { userId } = req.params;
    const { reason, banDuration } = req.body;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            data: null
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        // Don't allow banning of admins
        if (user.admin) {
            return res.status(400).json({
                success: false,
                message: "Cannot ban admin users",
                data: null
            });
        }

        const banExpiryDate = banDuration ? new Date(Date.now() + parseInt(banDuration) * 24 * 60 * 60 * 1000) : null;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                isBanned: true,
                banReason: reason || null,
                banExpiry: banExpiryDate
            },
            select: {
                id: true,
                email: true,
                name: true,
                isBanned: true,
                banReason: true,
                banExpiry: true
            }
        });

        return res.json({
            success: true,
            message: "User banned successfully",
            data: { user: updatedUser }
        });
    } catch (error) {
        console.error("Error banning user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to ban user",
            data: null
        });
    }
};

export {
    getAllUsersHandler,
    toggleUserAdminStatusHandler,
    getUserSubmissionsAdminHandler,
    getProblemStatementsAdminHandler,
    getAdminDashboardStatsHandler,
    moderateProblemStatementHandler,
    banUserHandler
};