// Assuming you're using Node.js with Express.js
const express = require('express');
const app = express();

// Sample array of students
const students = [
    { id: 1, name: "Ali", marks: 80 },
    { id: 2, name: "Ahmad", marks: 90 },
    { id: 3, name: "Zubair", marks: 20 }
];

// Route to get students with marks above 33
app.get('/students/pass', (req, res) => {
    const passedStudents = students.filter(student => student.marks > 33);
    res.json(passedStudents);
});

// Start the server on localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
