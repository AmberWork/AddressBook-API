const userDump = require("../../configs/user_generated.json");
const addressDump = require("../../configs/address_generated.json");
const parishDump = require("../../configs/parish_generated.json");
const { default: mongoose } = require("mongoose");
const { db } = require("../../schemas/user_schema");


userDump.forEach((user)=>{
  user._id = mongoose.Types.ObjectId.createFromHexString(user._id);
  user.createdAt = new Date(user.createdAt).toISOString();
  user.updatedAt = new Date(user.updatedAt).toISOString();
  user.deletedAt = user.deletedAt? new Date(user.deletedAt).toISOString(): null;
});

addressDump.forEach((address)=>{
  address._id = mongoose.Types.ObjectId.createFromHexString(address._id);
  address.user_id = mongoose.Types.ObjectId.createFromHexString(address.user_id);
  address.parish = mongoose.Types.ObjectId.createFromHexString(address.parish)

  address.createdAt = new Date(address.createdAt).toISOString();
  address.updatedAt = new Date(address.updatedAt).toISOString();
  address.deletedAt = address.deletedAt? new Date(address.deletedAt).toISOString(): null;
});
parishDump.forEach((parish)=>{
  parish._id = mongoose.Types.ObjectId.createFromHexString(parish._id);
});
module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:

    await db.collection('users').insertMany(userDump);
    await db.collection('addresses').insertMany(addressDump);
    await db.collection('parishes').insertMany(parishDump);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
