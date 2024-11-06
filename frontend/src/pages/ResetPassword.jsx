import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { PasswordInput } from "@/components/ui/password-input.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
    const location = useLocation();
    const { email, token } = location.state;
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!email || !token) {
            navigate("/");
        }
    }, []);

    const submit = async (email, password) => {
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/auth/reset-password`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        if (res.success) {
            toast({
                title: "Success",
                description: res.message,
            });
            navigate("/login");
        } else {
            toast({
                title: "Couldn't reset password",
                description: res.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="h-full-w-nav w-screen m-auto flex items-center justify-center">
            <Card className="w-[350px]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(email, password);
                    }}
                >
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Set a New Password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Password</Label>
                                <PasswordInput
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Your password"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {loading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in
                            </Button>
                        ) : (
                            <Button onClick={() => submit(email, password)}>
                                Log In
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default ResetPassword;
