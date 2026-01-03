import prisma from '../config/prisma';
import { hashPassword } from '../utils/auth.utils';

export class AdminService {
    async getPlatformStats() {
        const [userCount, tripCount, cityCount, activityCount] = await Promise.all([
            prisma.user.count(),
            prisma.trip.count(),
            prisma.city.count(),
            prisma.activity.count(),
        ]);

        // Get popular cities (by trip stops)
        const popularCities = await prisma.tripStop.groupBy({
            by: ['cityId'],
            _count: {
                cityId: true,
            },
            orderBy: {
                _count: {
                    cityId: 'desc',
                },
            },
            take: 10,
        });

        const cityDetails = await prisma.city.findMany({
            where: {
                id: { in: popularCities.map(pc => pc.cityId) },
            },
        });

        const topCities = popularCities.map(pc => {
            const city = cityDetails.find(c => c.id === pc.cityId);
            return {
                city: city?.name || 'Unknown',
                country: city?.country || '',
                tripCount: pc._count.cityId,
            };
        });

        // Get popular activities
        const popularActivities = await prisma.tripActivity.groupBy({
            by: ['activityId'],
            _count: {
                activityId: true,
            },
            orderBy: {
                _count: {
                    activityId: 'desc',
                },
            },
            take: 10,
        });

        const activityDetails = await prisma.activity.findMany({
            where: {
                id: { in: popularActivities.map(pa => pa.activityId) },
            },
        });

        const topActivities = popularActivities.map(pa => {
            const activity = activityDetails.find(a => a.id === pa.activityId);
            return {
                activity: activity?.name || 'Unknown',
                category: activity?.category || '',
                usageCount: pa._count.activityId,
            };
        });

        return {
            userCount,
            tripCount,
            cityCount,
            activityCount,
            topCities,
            topActivities,
        };
    }

    async getAllUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { trips: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            tripCount: user._count.trips,
        }));
    }

    async getUserAnalytics() {
        // Get user engagement metrics
        const recentTrips = await prisma.trip.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
            select: {
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Group by day
        const tripsByDay: Record<string, number> = {};
        recentTrips.forEach(trip => {
            const day = trip.createdAt.toISOString().split('T')[0];
            tripsByDay[day] = (tripsByDay[day] || 0) + 1;
        });

        return {
            recentTrips: recentTrips.length,
            tripsByDay,
        };
    }
    async getAllCities() {
        return prisma.city.findMany({
            orderBy: { popularity: 'desc' },
        });
    }

    async createCity(data: any) {
        // Generate ID from name if not provided (slug)
        const id = data.name.toLowerCase().replace(/\s+/g, '-');
        return prisma.city.create({
            data: {
                id,
                ...data,
            },
        });
    }

    async updateCity(id: string, data: any) {
        return prisma.city.update({
            where: { id },
            data,
        });
    }

    async deleteCity(id: string) {
        return prisma.city.delete({
            where: { id },
        });
    }

    async getAllActivities() {
        return prisma.activity.findMany({
            orderBy: { category: 'asc' },
        });
    }

    async createActivity(data: any) {
        return prisma.activity.create({
            data,
        });
    }

    async updateActivity(id: string, data: any) {
        return prisma.activity.update({
            where: { id },
            data,
        });
    }

    async deleteActivity(id: string) {
        return prisma.activity.delete({
            where: { id },
        });
    }
}
    async createUser(data: any) {
    const { email, password, name, role } = data;
    const hashedPassword = await hashPassword(password);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: role || 'user',
        },
    });
}
}

export default new AdminService();
