import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const submit = async (email) => {
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/auth/forgot-password`,
                {
                    email,
                },
                {
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        if (res.success) {
            toast({
                title: "Success",
                description: res.message,
            });
            navigate("/verify-otp", { state: { email } });
        } else {
            toast({
                title: "An error occurred",
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
                        submit(email);
                    }}
                >
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            Request a Password Reset
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {loading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting
                            </Button>
                        ) : (
                            <Button onClick={() => submit(email)}>
                                Submit
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
