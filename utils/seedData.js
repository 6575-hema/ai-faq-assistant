const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FAQ = require('../models/faq.model');

dotenv.config();

const initialFAQs = [
  {
    question: "What are the company working hours?",
    answer: "Our working hours are 9:30 AM to 6:30 PM, Monday to Friday. We have flexible login for 30 minutes."
  },
  {
    question: "Is Saturday and Sunday a holiday? Do we have to work on weekends?",
    answer: "Saturday and Sunday are fixed holidays. Weekend work is not required, unless there is a critical project deadline, which will be informed in advance with comp-off."
  },
  {
    question: "What is the leave policy? How many casual and sick leaves do we get?",
    answer: "You get 12 Casual Leaves (CL) and 8 Sick Leaves (SL) per year. Plus 10 Earned Leaves (EL). You can apply through the HR portal."
  },
  {
    question: "When will we get our salary? What is the salary date?",
    answer: "Salary is credited on the last working day of every month. For example, January salary will be credited on Jan 31st."
  },
  {
    question: "Do you provide work from home (WFH) option?",
    answer: "Yes, we have a hybrid model. You can take 2 days WFH per week after your probation period, with manager approval."
  },
  {
    question: "What is the dress code for the office?",
    answer: "Monday to Thursday is smart casuals and Friday is casual. No shorts or flip-flops."
  },
  {
    question: "Is there any probation period? How long is it?",
    answer: "Yes, there is a 3-month probation period for all new employees. Your performance will be reviewed after that."
  },
  {
    question: "Do you provide food, transport, or cab facility?",
    answer: "Yes, we provide free lunch and evening snacks. Cab facility is available for employees working after 8 PM."
  },
  {
    question: "What is the notice period if I want to resign?",
    answer: "The notice period is 30 days during probation and 60 days after confirmation."
  },
  {
    question: "How does the health insurance and PF benefits work?",
    answer: "All employees are covered under company health insurance of 5 Lakhs for you and your family. PF and ESI are deducted as per government norms from your second month."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await FAQ.deleteMany();
    await FAQ.insertMany(initialFAQs);
    console.log("Database seeded successfully with 10 HR FAQs!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

module.exports = seedDB;

if (require.main === module) {
  seedDB();
}
