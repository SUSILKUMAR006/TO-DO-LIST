import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
// DB connectivity
mongoose.connect("mongodb+srv://susilkumar18mass:Susil2006@cluster0.h6xzhei.mongodb.net/ToDo-App").then(() => {
    console.log('DB connected successfully');
}).catch((err) => {
    console.log(err);
});

// Create the schemas
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    complete: {
        required: true,
        type: Boolean,
    }
});

const daySchema = new mongoose.Schema({
    userId: String,       // if multiple users
    dayCount: Number,
    date: String,         // e.g., "2025-08-03"
    completed: Boolean
});

// Create the models
const Todo = mongoose.model('Todo', todoSchema);
const Day = mongoose.model('Day', daySchema);

// Routes for Day functionality
app.get('/day', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        let record = await Day.findOne({ date: today });
        
        if (!record) {
            // Find the latest day to increment the count
            const latestDay = await Day.findOne().sort({ dayCount: -1 });
            const newCount = latestDay ? latestDay.dayCount + 1 : 1;
            
            record = await Day.create({
                dayCount: newCount,
                completed: false,
                date: today
            });
        }
        res.json(record);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// UPDATE completed status
app.put('/day/complete', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const updated = await Day.findOneAndUpdate(
            { date: today },
            { completed: true },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Day record not found" });
        }
        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Other TODO routes remain the same...
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newToDo = new Todo({ title, description, complete: false });
        await newToDo.save();
        res.status(201).json(newToDo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/update-todo/:id', async (req, res) => {
    try {
        const { title, description, complete } = req.body;
        const id = req.params.id;
        const updateToDo = await Todo.findByIdAndUpdate(
            id,
            { title, description, complete },
            { new: true }
        );

        if (!updateToDo) {
            return res.status(404).json({ message: "To Do not found" });
        }

        res.json(updateToDo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/update-status-todo/:id', async (req, res) => {
    try {
        const { complete } = req.body;
        const id = req.params.id;
        const updateToDo = await Todo.findByIdAndUpdate(
            id,
            { complete },
            { new: true }
        );

        if (!updateToDo) {
            return res.status(404).json({ message: "To Do not found" });
        }

        res.json(updateToDo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/delete-todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/reset-all', async (req, res) => {
  try {
    await Todo.deleteMany({});
    await Day.deleteMany({});

    const today = new Date().toISOString().split('T')[0];

    await Day.create({ dayCount: 1, completed: false, date: today });

    res.status(200).json({ message: 'Reset successful' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Reset failed' });
  }
});





app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
