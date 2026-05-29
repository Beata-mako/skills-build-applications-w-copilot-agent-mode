import { Router } from 'express';

import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

const router = Router();

// /api/users/
router.get('/users', async (_req, res) => {
  const users = await User.find().populate('team').lean();
  res.json(users);
});

// /api/teams/
router.get('/teams', async (_req, res) => {
  const teams = await Team.find().populate('members').lean();
  res.json(teams);
});

// /api/activities/
router.get('/activities', async (_req, res) => {
  const activities = await Activity.find().populate('user').sort({ date: -1 }).lean();
  res.json(activities);
});

// /api/leaderboard/
router.get('/leaderboard', async (_req, res) => {
  const leaderboard = await Leaderboard.find().populate('user').sort({ rank: 1 }).lean();
  res.json(leaderboard);
});

// /api/workouts/
router.get('/workouts', async (_req, res) => {
  const workouts = await Workout.find().sort({ duration: 1 }).lean();
  res.json(workouts);
});

export default router;
