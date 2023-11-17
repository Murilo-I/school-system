export function isAuthenticated(req, res, next) {
    if (req.session.usuario)
        return next();

    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
}