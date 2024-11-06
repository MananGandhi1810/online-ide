import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
    const location = useLocation();
    const { email } = location.state;
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, []);

    const submit = async (email, otp) => {
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/auth/verify-otp`,
                {
                    email,
                    otp,
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
            navigate("/reset-password", {
                state: { email, token: res.data.token },
            });
        } else {
            toast({
                title: "An Error Occurred",
                description: res.message,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (otp.length == 6) {
            submit(email, otp);
        }
    }, [otp]);

    return (
        <div className="h-full-w-nav w-screen m-auto flex items-center justify-center">
            <Card className="w-[350px]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(otp);
                    }}
                >
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            Enter the OTP from your email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e);
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {loading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting
                            </Button>
                        ) : (
                            <Button onClick={() => submit(otp)}>Submit</Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default VerifyOtp;
