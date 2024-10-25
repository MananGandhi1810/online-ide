import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Code2, FileText, Zap, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";

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
            <Card className="max-w-2xl mx-auto px-12 py-8 space-y-3">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold">
                        {userProfile.name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Questions Solved
                            </p>
                            <NumberTicker
                                className="text-xl font-semibold"
                                value={totalProblems}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Submissions
                            </p>
                            <NumberTicker
                                className="text-xl font-semibold"
                                value={totalSubmissions}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Points
                            </p>
                            <NumberTicker
                                className="text-xl font-semibold"
                                value={userProfile.points.toLocaleString()}
                            />
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
                </CardContent>
            </Card>
        </div>
    );
}

export default UserData;
