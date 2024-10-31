import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkProblemStatement = async (req, res, next) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is required",
            data: null,
        });
    }
    const problemStatementExists =
        (await prisma.problemStatement.count({
            where: { id: problemStatementId },
        })) > 0;
    if (!problemStatementExists) {
        return res.status(404).json({
            success: false,
            message: "Problem Statement does not exist",
            data: null,
        });
    }
    next();
};

export { checkProblemStatement };
