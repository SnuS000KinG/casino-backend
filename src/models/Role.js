const mongoose = require('mondoose');

const RoleSchema = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        defoult: "User"
    }
});

module.exports = mongoose.model('Role', RoleSchema);