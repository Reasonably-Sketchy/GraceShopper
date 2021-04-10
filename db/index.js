// Require and re-export all files in this db directory (client and all adapter files)
module.exports = {
    ...require('./client'),
    ...require('./products'),
    ...require('./users'),
    ...require('./orders'),
    ...require('./order_products')
}