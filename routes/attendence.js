const express = require('express');
const moment = require('moment');
const router = express.Router();
const Attendance = require('../model/Attendance');

router.post('/punch', async (req, res) => {
  const { userEmail, location } = req.body;
  const today = moment().format('YYYY-MM-DD');
  const now = moment().format('HH:mm:ss');

  let record = await Attendance.findOne({ email: userEmail, date: today });

  if (!record) {
    // 🟢 Punch In
    record = new Attendance({
      email: userEmail,
      date: today,
      punchIn: now,
      punchInLocation: location || 'Unknown location',
    });
    await record.save();
    return res.json({ status: 'PUNCHED_IN', record });
  } else if (!record.punchOut) {
    // 🟡 Punch Out
    const punchInMoment = moment(record.punchIn, 'HH:mm:ss');
    const duration = moment.utc(moment(now, 'HH:mm:ss').diff(punchInMoment)).format('HH:mm:ss');

    record.punchOut = now;
    record.duration = duration;
    record.punchOutLocation = location || 'Unknown location';

    await record.save();
    return res.json({ status: 'PUNCHED_OUT', record });
  } else {
    // 🔁 Already punched in and out – fill missing locations if possible
    let updated = false;

    if (!record.punchInLocation && record.punchIn) {
      record.punchInLocation = location || 'Unknown location';
      updated = true;
    }

    if (!record.punchOutLocation && record.punchOut) {
      record.punchOutLocation = location || 'Unknown location';
      updated = true;
    }

    if (updated) {
      await record.save();
      return res.json({ status: 'UPDATED_LOCATION', record });
    }

    return res.json({ status: 'ALREADY_DONE', message: 'Already punched in and out for today.', record });
  }
});

router.get('/status/:email', async (req, res) => {
  const today = moment().format('YYYY-MM-DD');
  const record = await Attendance.findOne({ email: req.params.email, date: today });

  if (record && record.punchIn && !record.punchOut) {
    const punchInTime = moment(`${today} ${record.punchIn}`);
    return res.json({ isPunchedIn: true, punchInTime });
  }

  res.json({ isPunchedIn: false });
});

router.get('/:email', async (req, res) => {
  const data = await Attendance.find({ email: req.params.email });
  res.json({ attendance: data });
});

module.exports = router;
