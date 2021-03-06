/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: String,
  company: String,
  salary: String,
  city: String,
  country: String,
  duration: String,
  languages: String,
  requirements: String,
  description: String
});

jobSchema.index({"$**": "text"});

const Job = mongoose.model('Job',jobSchema);
module.exports = Job;
