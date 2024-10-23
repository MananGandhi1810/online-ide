const userDataHandler = (req, res) => {
    res.status(200).json({
        success: true,
        message: "User found",
        data: req.user,
    });
};

export { userDataHandler };
