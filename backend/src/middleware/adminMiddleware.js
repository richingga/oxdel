const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Hanya admin yang boleh melakukan aksi ini!" });
};

export default adminMiddleware;
