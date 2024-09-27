const sanitizeLogs = (logs, language) => {
    if (language == "javascript") {
        return logs
            .replace(/\r?\n/g, "")
            .replace(/\[90m/g, "... ")
            .replace(/\[39m/g, "")
            .replace(/\[33m/g, "");
    } else if (language == "c" || language == "cpp") {
        return logs
            .replace(/\x1B\[[0-9;]*[m]/g, "")
            .replace(/\[K/g, "")
            .replace(/\r?\n/g, "");
    } else {
        return logs;
    }
};
