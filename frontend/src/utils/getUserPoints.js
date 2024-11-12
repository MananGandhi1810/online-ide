import axios from "axios";

const getUserPoints = async (token) => {
    if (token == "null" || !token) {
        return;
    }
    return await axios
        .get(`${process.env.SERVER_URL}/leaderboard/getUserPoints`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            validateStatus: false,
        })
        .then((res) => res.data);
};

export default getUserPoints;
