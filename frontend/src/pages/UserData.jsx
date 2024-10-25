import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Code2, FileText, Trophy, Send } from "lucide-react";

function UserData() {
    const userProfile = useLoaderData();
    const totalSubmissions = userProfile.submissions.length;
    const [mostUsedLanguage, setMostUsedLanguage] = useState("");
    const [totalProblems, setTotalProblems] = useState(0);

    useEffect(() => {
        const freqMap = {};
        for (const submission of userProfile.submissions) {
            freqMap[submission.language] =
                (freqMap[submission.language] || 0) + 1;
        }
        let maxFreq = 0;
        for (const language in freqMap) {
            if (freqMap[language] > maxFreq) {
                maxFreq = freqMap[language];
                setMostUsedLanguage(language);
            }
        }

        var problems = new Set();
        for (var i = 0; i < userProfile.submissions.length; i++) {
            problems.add(userProfile.submissions[i].problemStatementId);
        }
        setTotalProblems(problems.size);
    }, []);

    return (
        <div className="flex w-full h-full-w-nav items-center justify-center">
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <header className="text-center">
                    <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                </header>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Questions Solved
                            </p>
                            <p className="text-xl font-semibold">
                                {totalProblems}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Submissions
                            </p>
                            <p className="text-xl font-semibold">
                                {totalSubmissions}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Points
                            </p>
                            <p className="text-xl font-semibold">
                                {userProfile.points.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Most Used Language
                            </p>
                            <p className="text-xl font-semibold">
                                {mostUsedLanguage.charAt(0).toUpperCase() +
                                    mostUsedLanguage.slice(1)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserData;
