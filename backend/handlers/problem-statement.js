import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProblemStatements = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched problem statements",
        data: null,
    });
};

const getProblemStatementById = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched problem statement",
        data: null,
    });
};

const newProblemStatement = async (req, res) => {
    res.json({
        success: true,
        message: "Created problem statement",
        data: null,
    });
};
