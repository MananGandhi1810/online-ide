import request from 'supertest';
import app from '../index.js';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Admin API Tests', () => {
    let adminUser;
    let normalUser;
    let adminToken;
    let userToken;
    let testProblem;

    beforeAll(async () => {
        // Create test users
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                name: 'Admin User',
                password: 'hashedpassword',
                admin: true,
                isVerified: true
            }
        });

        normalUser = await prisma.user.create({
            data: {
                email: 'user@test.com',
                name: 'Normal User',
                password: 'hashedpassword',
                isVerified: true
            }
        });

        // Create test tokens
        adminToken = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET);
        userToken = jwt.sign({ id: normalUser.id }, process.env.JWT_SECRET);

        // Create test problem statement
        testProblem = await prisma.problemStatement.create({
            data: {
                title: 'Test Problem',
                description: 'Test Description',
                difficulty: 'Easy',
                createdById: adminUser.id
            }
        });
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.problemStatement.deleteMany({
            where: { id: testProblem.id }
        });
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: [adminUser.id, normalUser.id]
                }
            }
        });
        await prisma.$disconnect();
    });

    describe('Dashboard Stats', () => {
        it('should return dashboard statistics for admin users', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalUsers');
            expect(response.body.data).toHaveProperty('totalProblems');
            expect(response.body.data).toHaveProperty('totalSubmissions');
        });

        it('should deny access to non-admin users', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard/stats')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe('User Management', () => {
        it('should allow admin to ban users', async () => {
            const response = await request(app)
                .post(`/api/admin/users/${normalUser.id}/ban`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    reason: 'Test ban reason',
                    banDuration: 1 // 1 day
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.isBanned).toBe(true);
            expect(response.body.data.user.banReason).toBe('Test ban reason');
        });

        it('should not allow banning admin users', async () => {
            const response = await request(app)
                .post(`/api/admin/users/${adminUser.id}/ban`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    reason: 'Test ban reason'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Problem Statement Moderation', () => {
        it('should allow admin to moderate problem statements', async () => {
            const response = await request(app)
                .put(`/api/admin/problem-statements/${testProblem.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'APPROVED',
                    moderationComment: 'Approved after review'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.problemStatement.moderationStatus).toBe('APPROVED');
        });

        it('should validate moderation status values', async () => {
            const response = await request(app)
                .put(`/api/admin/problem-statements/${testProblem.id}/moderate`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'INVALID_STATUS'
                });

            expect(response.status).toBe(400);
        });
    });
});