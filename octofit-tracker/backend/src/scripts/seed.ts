/**
 * Seed the octofit_db database with test data
 *
 * This script populates users, teams, activities, leaderboard, and workouts collections.
 */
import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const MONGO_URI = 'mongodb://localhost:27017/octofit_db';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    // Create users
    const users = await User.insertMany([
      { username: 'alice', email: 'alice@example.com', password: 'pass123' },
      { username: 'bob', email: 'bob@example.com', password: 'pass123' },
      { username: 'carol', email: 'carol@example.com', password: 'pass123' },
    ]);

    // Create teams
    const teams = await Team.insertMany([
      { name: 'Team Alpha', members: [users[0]._id, users[1]._id] },
      { name: 'Team Beta', members: [users[2]._id] },
    ]);

    // Assign teams to users
    await Promise.all([
      User.findByIdAndUpdate(users[0]._id, { team: teams[0]._id }),
      User.findByIdAndUpdate(users[1]._id, { team: teams[0]._id }),
      User.findByIdAndUpdate(users[2]._id, { team: teams[1]._id }),
    ]);

    // Create workouts
    const workouts = await Workout.insertMany([
      { name: 'Morning Run', description: '5km easy run', difficulty: 'Easy', duration: 30 },
      { name: 'HIIT', description: 'High intensity interval training', difficulty: 'Hard', duration: 45 },
      { name: 'Yoga', description: 'Flexibility and balance', difficulty: 'Medium', duration: 60 },
    ]);

    // Create activities
    const activities = await Activity.insertMany([
      { user: users[0]._id, type: 'Run', duration: 30, calories: 300, date: new Date() },
      { user: users[1]._id, type: 'HIIT', duration: 45, calories: 500, date: new Date() },
      { user: users[2]._id, type: 'Yoga', duration: 60, calories: 200, date: new Date() },
    ]);

    // Create leaderboard
    await Leaderboard.insertMany([
      { user: users[0]._id, score: 1200, rank: 1 },
      { user: users[1]._id, score: 900, rank: 2 },
      { user: users[2]._id, score: 700, rank: 3 },
    ]);

    console.log('Seed the octofit_db database with test data - DONE');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
