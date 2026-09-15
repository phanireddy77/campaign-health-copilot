import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app";

describe("API Middleware Tests", () => {
    it("Checks invalid line id routes", async () => {
        const response = await request(app).get('/api/lines/test1');

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('INVALID_ID');
        expect(response.body.error.requestId).toBeDefined();
    });
    it("checks for invalid routes", async () => {
        const response = await request(app).get('/api/nowhere');

        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
    });
    it("checks for Database health", async () => {
        const response = await request(app).get('/api/health');

        expect(response.body.status).toBe("healthy");
        expect(response.body.database).toBe("connected");
    });
});

describe("Seeded API Tests",  () => {
    it("Checks seeded advertisers", async () => {
        const response = await request(app).get('/api/advertisers');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toBeGreaterThan(0);
    });
    it("Checks campaign health", async () => {
        const response = await request(app).get('/api/campaigns/24/health');

        expect(response.status).toBe(200);
        expect(
          response.body
            .data
            .health
            .score
        ).toBeGreaterThanOrEqual(
          0
        );

        expect(
          response.body
            .data
            .health
            .score
        ).toBeLessThanOrEqual(
          100
        );
    });
});