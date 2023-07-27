// controllers/userController.js

const express = require("express");
const router = express.Router();
const User = require("./user");
const UserLog = require("./userLog"); // Import the UserLog model

const { Op } = require("sequelize");

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.create({ name, email, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit a user by ID
router.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (user) {
      const { name, email, role } = req.body;
      user.name = name;
      user.email = email;
      user.role = role;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Check if the user with the specified ID exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve a user by email
router.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ where: { email, archived: false } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Archive a user by ID
router.put("/users/archive/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.archived = true;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve users of a specific role
router.get("/users/role/:role", async (req, res) => {
  const role = req.params.role;
  try {
    const users = await User.findAll({ where: { role } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve all archived users
router.get("/all-archived-user", async (req, res) => {
  try {
    const archivedUsers = await User.findAll({ where: { archived: true } });
    console.log("Archived Users:", archivedUsers); // Add this line
    res.json(archivedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve users whose name includes specific text
router.get("/user-searchWith-namePart", async (req, res) => {
  const searchText = req.query.name;
  try {
    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${searchText}%`, // Use Op.like for a partial match
        },
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve users whose email includes specific text
router.get("/user-searchWith-emailPart", async (req, res) => {
  const searchText = req.query.name;
  try {
    const users = await User.findAll({
      where: {
        email: {
          [Op.like]: `%${searchText}%`, // Use Op.like for a partial match
        },
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Log user login
router.post("/users-login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user printed here");
    console.log(user);

    console.log("\n and");
    console.log(user.id);
    console.log(UserLog.getAttributes);

    await UserLog.create({ action: "login", userId: user.id }); // Create a new log entry

    res.json({ message: "User logged in successfully" });
  } catch (error) {
    console.log("\n\n");
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Log user logout
router.post("/users-logout", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserLog.create({ action: "logout", userId: user.id }); // Create a new log entry

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/users/:email/logs", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const logs = await UserLog.findAll({ where: { userId: user.id } }); // Corrected attribute

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get 5 recent logs of a user
router.get("/users/:email/logs/recent", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const logs = await UserLog.findAll({
      where: { UserId: user.id },
      order: [["timestamp", "DESC"]],
      limit: 5,
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific log
router.delete("/users/delete-logs/:logId", async (req, res) => {
  const logId = req.params.logId;

  try {
    // Find the log entry to be deleted
    const log = await UserLog.findByPk(logId);
    if (!log) {
      return res.status(404).json({ message: "Log entry not found" });
    }

    // Delete the log entry
    await log.destroy();

    res.json({ message: "Log entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: Implement other APIs (e.g., search by name, search by email, retrieve archived users)

module.exports = router;
