// POST /api/save-token
app.post("/api/save-token", async (req, res) => {
  const { token } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    pushToken: token,
  });

  res.json({ success: true });
});