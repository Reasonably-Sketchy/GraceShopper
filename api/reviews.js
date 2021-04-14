const express = require("express");
const { createReview, getReviewById, updateReview, deleteReview, getReviewsByProductId, getReviewsByUser } = require("../db/reviews");
const reviewsRouter = express.Router();
const { requireUser, requireAdmin } = require("./utils");

reviewsRouter.use((req, res, next) => {
    console.log("A request is being made to /reviews...");
    next();
});

reviewsRouter.post('/:productId', requireUser, async (req, res, next) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    const { title, content, stars } = req.body;

    try {
        const newReview = await createReview({
            title: title,
            content: content,
            stars: stars,
            userId: userId,
            productId: productId
        });

        res.send(newReview);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

reviewsRouter.patch('/:reviewId', requireUser, async (req, res, next) => {
    const { reviewId } = req.params;
    const { id: userId } = req.user;
    const { title, content, stars } = req.body;

    try {
        const review = await getReviewById(reviewId);

        if (review.userId !== userId) {
            throw Error(`You cannot edit a review that is not yours.`);
        };

        const updatedReview = await updateReview({
            id: reviewId,
            title: title,
            content: content,
            stars: stars,
        });

        res.send(updatedReview);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

reviewsRouter.delete('/:reviewId', requireUser, async (req, res, next) => {
    const { reviewId } = req.params;
    const { id: userId } = req.user;

    try {
        const review = await getReviewById(reviewId);

        if (review.userId !== userId && !req.user.isAdmin) {
            throw Error(`You don't have permission to delete this review.`);
        };

        const deletedReview = await deleteReview(reviewId);

        res.send(deletedReview);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

reviewsRouter.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;

    try {
        const productReviews = await getReviewsByProductId(productId);
        
        res.send(productReviews);
    } catch ({ name, message }) {
        next({ name, message });
    };
});


module.exports = reviewsRouter;