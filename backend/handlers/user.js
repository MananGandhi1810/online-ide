import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userDataHandler = (req, res) => {
    res.json({
        success: true,
        message: "User found",
        data: req.user,
    });
};

const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User Id is required",
            data: null,
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
            points: true,
            submissions: {
                orderBy: {
                    time: "desc",
                },
                select: {
                    id: true,
                    language: true,
                    problemStatementId: true,
                    success: true,
                    time: true,
                },
            },
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "User found",
        data: {
            user,
        },
    });
};

//  These are new handlers for user management :)
const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list users' });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await prisma.user.create({
            data: { name, email, password },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, password },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

export { userDataHandler, getUserByIdHandler, listUsers, addUser, editUser, deleteUser };