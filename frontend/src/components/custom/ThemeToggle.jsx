import { useTheme } from "@/components/theme-provider.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    const getIcon = () => {
        switch (theme) {
            case "light":
                return <Sun className="h-4 w-4" />;
            case "dark":
                return <Moon className="h-4 w-4" />;
            case "system":
                return <Monitor className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    const getTooltip = () => {
        switch (theme) {
            case "light":
                return "Switch to dark mode";
            case "dark":
                return "Switch to system theme";
            case "system":
                return "Switch to light mode";
            default:
                return "Toggle theme";
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={cycleTheme}
            title={getTooltip()}
        >
            {getIcon()}
        </Button>
    );
}