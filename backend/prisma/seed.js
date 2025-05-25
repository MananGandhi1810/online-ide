import { PrismaClient } from "@prisma/client";
import { defaultStarterCode } from "../utils/default-code";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seed...");

    const problemStatements = await prisma.problemStatement.findMany({
        include: {
            starterCode: true,
        },
    });

    for (const problem of problemStatements) {
        console.log(`Processing problem: ${problem.title}`);

        const existingLanguages = problem.starterCode.map((sc) => sc.language);
        const missingLanguages = Object.keys(defaultStarterCode).filter(
            (lang) => !existingLanguages.includes(lang),
        );

        if (missingLanguages.length > 0) {
            console.log(
                `Adding starter code for languages: ${missingLanguages.join(", ")}`,
            );

            await prisma.starterCode.createMany({
                data: missingLanguages.map((language) => ({
                    problemStatementId: problem.id,
                    language,
                    code: defaultStarterCode[language],
                })),
            });
        } else {
            console.log(`Problem already has starter code for all languages`);
        }
    }

    console.log("Seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
