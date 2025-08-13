import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTeamSchema, insertScrimSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Team routes
  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertTeamSchema.parse(req.body);
      
      const team = await storage.createTeam(userId, teamData);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.get('/api/teams/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getUserTeams(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const team = await storage.getTeam(id);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Scrim routes
  app.post('/api/scrims', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scrimData = insertScrimSchema.parse(req.body);
      const { teamId } = req.body;
      
      // Verify user owns the team
      const userTeams = await storage.getUserTeams(userId);
      const hasTeam = userTeams.some(team => team.id === teamId);
      
      if (!hasTeam) {
        return res.status(403).json({ message: "Not authorized to create scrims for this team" });
      }
      
      const scrim = await storage.createScrim(teamId, scrimData);
      res.status(201).json(scrim);
    } catch (error) {
      console.error("Error creating scrim:", error);
      res.status(400).json({ message: "Failed to create scrim" });
    }
  });

  app.get('/api/scrims', async (req, res) => {
    try {
      const { date, time, format, maps, servers, region } = req.query;
      
      const filters = {
        date: date as string,
        time: time as string,
        format: format as string,
        maps: maps ? (maps as string).split(',') : undefined,
        servers: servers ? (servers as string).split(',') : undefined,
        region: region as string,
      };
      
      const scrims = await storage.getAvailableScrims(filters);
      res.json(scrims);
    } catch (error) {
      console.error("Error fetching scrims:", error);
      res.status(500).json({ message: "Failed to fetch scrims" });
    }
  });

  app.post('/api/scrims/:id/book', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { teamId } = req.body;
      
      // Verify user owns the team
      const userTeams = await storage.getUserTeams(userId);
      const hasTeam = userTeams.some(team => team.id === teamId);
      
      if (!hasTeam) {
        return res.status(403).json({ message: "Not authorized to book scrims for this team" });
      }
      
      await storage.bookScrim(id, teamId);
      res.json({ message: "Scrim booked successfully" });
    } catch (error) {
      console.error("Error booking scrim:", error);
      res.status(400).json({ message: "Failed to book scrim" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.extend({
        revieweeTeamId: z.string(),
        scrimId: z.string().optional(),
      }).parse(req.body);
      
      const review = await storage.createReview(userId, reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/teams/:id/reviews', async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await storage.getTeamReviews(id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching team reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
