const client = require(`./client`)

const createReview = async ({ title, content, stars, userId, productId }) => {
    // if (content.length < 30) {
    //     throw Error('Review content must be at least 30 characters long.')
    // };

    try {
        const { rows: [review] } = await client.query(`
            INSERT INTO reviews(title, content, stars, "userId", "productId")
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [title, content, stars, userId, productId]); 

        return review;
    } catch (error) {
        throw error;
    };
};

const updateReview = async ({ id, title, content, stars }) => {
    // if (content.length < 30) {
    //     throw Error('Review content must be at least 30 characters long.')
    // };

    try {
        const { rows: [updatedReview ] } = await client.query(`
            UPDATE reviews
            SET "title"=$1, "content"=$2, "stars"=$3
            WHERE id=$4
            RETURNING *;
        `, [title, content, stars, id]);

        return updatedReview;
    } catch (error) {
        throw error;
    };
};

const deleteReview = async (id) => {
    try {
        const { rows: [deletedReview] } = await client.query(`
            DELETE FROM reviews
            WHERE id=$1
            RETURNING *;
        `, [id]);

        return deletedReview;
    } catch (error) {
        throw error;
    };
};

const getReviewsByProductId = async (productId) => {
    try {
        const { rows: productReviews } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "productId"=$1;
        `, [productId]);

        return productReviews;
    } catch (error) {
        throw error;
    };
};

const getReviewsByUser = async (userId) => {
    try {
        const { rows: userReviews } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "userId"=$1;
        `, [userId]);

        return userReviews;
    } catch (error) {
        throw error;
    };
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getReviewsByProductId,
    getReviewsByUser,
}