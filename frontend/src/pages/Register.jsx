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
import { PasswordInput } from "@/components/ui/password-input.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";
import { Link, useNavigate } from "react-router-dom";
import ghIcon from "@/assets/gh-icon.png";

function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const register = async (name, email, password) => {
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/auth/register`,
                {
                    name,
                    email,
                    password,
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
            navigate("/login");
        } else {
            toast({
                title: "Couldn't register",
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
                        register(name, email, password);
                    }}
                >
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Register on code</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
                                <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                />
                            </div>
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
                            <Button className="w-full gap-1" asChild>
                                <Link
                                    to={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user:email`}
                                >
                                    <img src={ghIcon} className="h-6" /> Sign in
                                    with GitHub
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {loading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering
                            </Button>
                        ) : (
                            <Button
                                onClick={() => register(name, email, password)}
                            >
                                Register
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default Login;
