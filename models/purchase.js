const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    userId: Schema.Types.ObjectId,
    courseId: Schema.Types.ObjectId
});

module.exports = mongoose.model("purchase", purchaseSchema);