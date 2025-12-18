const errorHandler = (err, req, res, next) => {

    if (res.headersSent) {
        return next(err)
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // "email"
        const value = err.keyValue[field];          // "jef@example.com"

        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            errors: [
                {
                    field,
                    message: `${value} already exists`
                }
            ]
        });
    }

    
    const status = err.statusCode || 500

    res.status(status).json({
        success: false,
        message: err.message || "Something went wrong.",
        errors: err.errors || null
    })
}

module.exports = errorHandler