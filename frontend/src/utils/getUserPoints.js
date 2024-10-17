import axios from "axios";

const getUserPoints = async (token) => {
    return await axios
        .get(`${process.env.SERVER_URL}/leaderboard/getUserPoints`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data);
};

export default getUserPoints;
