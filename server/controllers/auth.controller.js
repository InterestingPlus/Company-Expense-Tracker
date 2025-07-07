import adminModel from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      currency: admin.currency,
      companyName: admin.companyName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const isAdmin = await adminModel.findOne({ email });

    if (isAdmin) {
      res.status(400).json({ error: "Admin already exists!" });
      return;
    }

    const admin = await adminModel.create({
      name,
      email,
      currency: "INR",
      password: await bcrypt.hash(password, 10),
    });

    const token = generateToken(admin);

    console.log(
      `Admin Registered Successfully with Name : ${admin.name}, Email : ${admin.email}`
    );

    res
      .status(201)
      .json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      res.status(400).json({ error: "Admin not found!" });
      console.log("not Found Admin");
      return;
    }

    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ error: "Invalid Credentials!" });
    }

    const token = generateToken(admin);

    console.log(
      `Admin Logged in Successfully with Name : ${admin.name}, Email : ${admin.email}`
    );

    res
      .status(200)
      .json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};

export const editAdmin = async (req, res) => {
  const { name, email, companyName, currency } = req.body;

  try {
    // ✅ Check if another admin has this email
    const isAvailable = await adminModel.findOne({ email });

    if (isAvailable && isAvailable._id.toString() !== req.admin.id) {
      return res
        .status(400)
        .json({ error: "Another admin already exists with this email!" });
    }

    // ✅ Update current admin
    const admin = await adminModel.findOneAndUpdate(
      { _id: req.admin.id },
      {
        name,
        email,
        companyName,
        currency,
      },
      { new: true } // Return the updated document
    );

    if (!admin) {
      return res.status(404).json({ error: "Admin not found!" });
    }

    console.log(`✅ Admin Updated: ${admin.name}, ${admin.email}`);

    res.status(200).json({
      admin: {
        name: admin.name,
        email: admin.email,
        companyName: admin.companyName,
        currency: admin.currency,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};
