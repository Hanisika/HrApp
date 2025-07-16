const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser');
const AddEmployee = require('./routes/FormRoutes');
const authRoute = require('./routes/auth');
const taskRoutes = require('./routes/task');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const DB_URI="mongodb://localhost:27017/HrApp";
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  family: 4,
})
.then(() => {
  console.log("✅ Connected to MongoDB successfully!");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

app.post('/apply-leave', async (req, res) => {
  const { name, email, reason } = req.body;

  if (!name || !email || !reason) {
    return res.json({ success: false, message: 'Invalid input' });
  }

  try {
    // 🔧 Hardcoded HR email for now (adjust as needed)
    const hrEmail = 'frontenddeveloper.chs@gmail.com'; // Replace with a test HR email

    // Set up the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your app email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Email to HR
    const hrMailOptions = {
      from: `"Leave Management" <${process.env.EMAIL_USER}>`,
      to: hrEmail,
      subject: 'New Leave Application',
      html: `
        <h2>New Leave Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `,
    };

    // Email to employee
    const confirmMailOptions = {
      from: `"Leave Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Leave Application Received',
      html: `
        <p>Hello ${name},</p>
        <p>Your leave application has been received successfully.</p>
        <ul><li><strong>Reason:</strong> ${reason}</li></ul>
        <p>We'll get back to you shortly.</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(hrMailOptions);
    await transporter.sendMail(confirmMailOptions);

    return res.json({ success: true });
  } catch (err) {
    console.error('❌ Email error:', err);
    return res.json({ success: false, message: 'Email failed to send' });
  }
});


app.use('/add-employee',AddEmployee);
app.use('/auth', authRoute);
app.use('/get-employee', require('./routes/getEmployee'));
app.use('/update-employee', require('./routes/updateEmployee'));
app.use('/delete-employee', require('./routes/deleteEmployee'));
app.use('/attendance', require('./routes/attendence'));
// app.use('/leave', leaveRoutes);
app.use('/task', taskRoutes);


app.listen(5000, () => {
  console.log('Server started on port 5000');
});