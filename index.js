const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const app = express();

const admin_routers = require('./Routes/adminRoutes');
const recruiter_routes = require('./Routes/recruiterRoutes')

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

mongoose.connect('mongodb://localhost:27017/InterviewPlatform');
const port = process.env.PORT || 3001
app.listen(port,console.log(`Listening on port${port}...`));

app.use('/',admin_routers);
app.use('/',recruiter_routes);
