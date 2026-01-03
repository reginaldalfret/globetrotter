import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import adminService from '../services/admin.service';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/stats - Platform statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
        const stats = await adminService.getPlatformStats();
        return res.json(stats);
    } catch (error: any) {
        console.error('Get stats error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users - User list
router.get('/users', async (req: AuthRequest, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        return res.json(users);
    } catch (error: any) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: error.message });
    }
});

router.post('/users', async (req: AuthRequest, res: Response) => {
    try {
        const user = await adminService.createUser(req.body);
        return res.json(user);
    } catch (error: any) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/analytics - Usage analytics
// GET /api/admin/analytics - Usage analytics
router.get('/analytics', async (req: AuthRequest, res: Response) => {
    try {
        const analytics = await adminService.getUserAnalytics();
        return res.json(analytics);
    } catch (error: any) {
        console.error('Get analytics error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// City Management
router.get('/cities', async (req: AuthRequest, res: Response) => {
    try {
        const cities = await adminService.getAllCities();
        return res.json(cities);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/cities', async (req: AuthRequest, res: Response) => {
    try {
        const city = await adminService.createCity(req.body);
        return res.json(city);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/cities/:id', async (req: AuthRequest, res: Response) => {
    try {
        const city = await adminService.updateCity(req.params.id, req.body);
        return res.json(city);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/cities/:id', async (req: AuthRequest, res: Response) => {
    try {
        await adminService.deleteCity(req.params.id);
        return res.json({ message: 'City deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// Activity Management
router.get('/activities', async (req: AuthRequest, res: Response) => {
    try {
        const activities = await adminService.getAllActivities();
        return res.json(activities);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/activities', async (req: AuthRequest, res: Response) => {
    try {
        const activity = await adminService.createActivity(req.body);
        return res.json(activity);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/activities/:id', async (req: AuthRequest, res: Response) => {
    try {
        const activity = await adminService.updateActivity(req.params.id, req.body);
        return res.json(activity);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/activities/:id', async (req: AuthRequest, res: Response) => {
    try {
        await adminService.deleteActivity(req.params.id);
        return res.json({ message: 'Activity deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
