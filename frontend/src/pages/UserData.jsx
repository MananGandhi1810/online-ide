import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Code2, FileText, Zap, Send, Linkedin, Share2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import AuthContext from "@/context/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function UserData() {
    const userProfile = useLoaderData();
    const { user } = useContext(AuthContext);
    const { toast } = useToast();

    if (!userProfile) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                An error occurred while fetching user details
            </div>
        );
    }

    const totalSubmissions = userProfile.submissions.length;
    const [mostUsedLanguage, setMostUsedLanguage] = useState("");
    const [totalProblems, setTotalProblems] = useState(0);
    const [contributionData, setContributionData] = useState([]);
    const [maxSubmissions, setMaxSubmissions] = useState(0);
    const [submissionRatio, setSubmissionRatio] = useState({
        success: 0,
        failure: 0,
    });

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
        var ratio = {
            success: 0,
            failure: 0,
        };
        for (var i = 0; i < userProfile.submissions.length; i++) {
            problems.add(userProfile.submissions[i].problemStatementId);
            ratio[userProfile.submissions[i].success ? "success" : "failure"] +=
                1;
        }
        setTotalProblems(problems.size);
        setSubmissionRatio(ratio);

        const dateFreqMap = {};
        for (const submission of userProfile.submissions) {
            const sub = submission.time.split("T")[0];
            dateFreqMap[sub] = (dateFreqMap[sub] || 0) + 1;
        }
        setContributionData([]);
        var max = 0;
        Object.entries(dateFreqMap).forEach(([date, n]) => {
            if (n > max) {
                max = n;
            }
            setContributionData((data) => [
                ...data,
                {
                    date,
                    count: n,
                },
            ]);
        });
        setMaxSubmissions(max);
    }, []);

    return (
        <div className="flex w-full h-full-w-nav items-center justify-center flex-col">
            <Card className="w-5/12 min-w-[300px] sm:min-w-[400px] md:min-w-[600px] mx-auto px-2 py-8 sm:space-y-3 md:px-8">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold flex flex-row justify-center align-middle">
                        {userProfile.name}
                        {user?.id === userProfile.id && (
                            <Button
                                variant="ghost"
                                className="ml-2"
                                onClick={() => {
                                    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                        window.location.href,
                                    )}&text=Check out my profile on ${
                                        window.location.origin
                                    }`;
                                    window.open(linkedInUrl, "_blank");
                                }}
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary invisible md:visible" />
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
                        <Send className="w-5 h-5 text-primary invisible md:visible" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Submissions
                            </p>
                            <NumberTicker
                                className="text-xl font-semibold pr-1"
                                value={totalSubmissions}
                            />
                            (
                            {submissionRatio.success > 0 ? (
                                <NumberTicker
                                    className="text-green-500"
                                    value={submissionRatio.success}
                                />
                            ) : (
                                <span className="inline-block tabular-nums tracking-wider text-green-500">
                                    0
                                </span>
                            )}
                            /
                            {submissionRatio.failure > 0 ? (
                                <NumberTicker
                                    className="text-red-500"
                                    value={submissionRatio.failure}
                                />
                            ) : (
                                <span className="inline-block tabular-nums tracking-wider text-red-500">
                                    0
                                </span>
                            )}
                            )
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary invisible md:visible" />
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
                        <Code2 className="w-5 h-5 text-primary invisible md:visible" />
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
                <CardFooter className="invisible h-0 md:h-24 sm:visible">
                    <ReactCalendarHeatmap
                        titleForValue={(value) =>
                            value != null
                                ? `${value?.date ?? ""}: ${
                                      value?.count ?? "0"
                                  } Submission${value?.count > 1 ? "s" : ""}`
                                : null
                        }
                        startDate={
                            new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() - 1,
                                ),
                            )
                        }
                        endDate={new Date()}
                        values={contributionData}
                        classForValue={(value) => {
                            if (!value) {
                                return "color-empty";
                            }
                            return `color-scale-${Math.ceil(
                                (4 * value.count) / maxSubmissions,
                            )}`;
                        }}
                    />
                </CardFooter>
            </Card>
        </div>
    );
}

export default UserData;
