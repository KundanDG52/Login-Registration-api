const express = require("express");
const router = express.Router();
const jwtHelper = require("../config/jwtHelper");
const User = require("../models/user");

function setDate(date, time) {
  const d = new Date(date),
    s = time,
    parts = s.match(/(\d+)\.(\d+) (\w+)/),
    hours = /am/i.test(parts[3])
      ? parseInt(parts[1], 10)
      : parseInt(parts[1], 10) + 12,
    minutes = parseInt(parts[2], 10);

  d.setHours(hours);
  d.setMinutes(minutes);
  return d;
}
// router.get(
//   "/findByDate",
//   jwtHelper.verifyjwtoken,
//   jwtHelper.isAdmin,
//   async (req, res) => {
//     try {
//       const { start_Date, end_Date } = req.body;
//       console.log("start_Date", setDate(start_Date, "12.01 AM"));
//       console.log("end_Date", setDate(end_Date, "11.59 PM"));
//       const getAllUsers = await User.find({
//         createdAt: {
//           $gte: setDate(start_Date, "12.00 AM"),
//           $lte: setDate(end_Date, "11.59 PM"),
//         },
//       }).select("-password");
//       return res.status(200).send({ error: false, user: getAllUsers });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).send({ error: true, message: err });
//     }
//   }
// );

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    //console.log(page, limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model
        .find()
        .select(["-password"])
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      //console.log(results);
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

router.get(
  "/allUsers",
  jwtHelper.verifyjwtoken,
  jwtHelper.isAdmin,
  paginatedResults(User),
  async (req, res) => {
    try {
      //const allUsers = await paginatedResults(User);
      res.json(res.paginatedResults);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: true, message: err });
    }
  }
);

router.get(
  "/:id",
  jwtHelper.verifyjwtoken,
  jwtHelper.isAdmin,
  async (req, res) => {
    try {
      const singleUser = await User.findById(req.params.id).select("-password");
      return res.status(200).send({ error: false, user: singleUser });
    } catch (err) {
      return res.status(500).send({ error: true, message: err });
    }
  }
);

module.exports = router;
