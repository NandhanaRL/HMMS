const { body } = require("express-validator");

// Student Registration Validation
const registerStudentValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("phone")
        .optional()
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),

    body("roll_no")
        .trim()
        .notEmpty()
        .withMessage("Roll number is required"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("year_of_study")
        .isInt({ min: 1, max: 5 })
        .withMessage("Year of study must be between 1 and 5"),

    body("guardian_contact")
        .optional()
        .isMobilePhone("en-IN")
        .withMessage("Invalid guardian contact number")
];

// Login Validation
const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

module.exports = {
    registerStudentValidation,
    loginValidation
};