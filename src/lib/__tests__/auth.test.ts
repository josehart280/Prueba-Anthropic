import { test, expect, vi, describe, beforeEach } from "vitest";

// Mock the jose library
vi.mock("jose", () => ({
  SignJWT: vi.fn().mockImplementation(() => ({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue("mock-jwt-token"),
  })),
  jwtVerify: vi.fn().mockResolvedValue({
    payload: {
      userId: "user-123",
      email: "test@example.com",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  }),
}));

// Mock the entire next/headers module
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(mockCookieStore),
}));

vi.mock("server-only", () => ({
  default: vi.fn(),
}));

// Import the module under test
const { createSession, getSession, deleteSession } = await import("@/lib/auth");

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates a session and sets auth cookie", async () => {
    await createSession("user-123", "test@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mock-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      })
    );
  });

  test("cookie expires in 7 days", async () => {
    const beforeCall = Date.now();
    await createSession("user-123", "test@example.com");
    const afterCall = Date.now();

    const callArgs = mockCookieStore.set.mock.calls[0];
    const expiresOption = callArgs[2].expires;

    // Check expiration is approximately 7 days from now
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(expiresOption.getTime()).toBeGreaterThanOrEqual(beforeCall + sevenDaysMs - 1000);
    expect(expiresOption.getTime()).toBeLessThanOrEqual(afterCall + sevenDaysMs + 1000);
  });

  test("sets secure cookie in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    await createSession("user-123", "test@example.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].secure).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });

  test("does not set secure cookie in development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    await createSession("user-123", "test@example.com");

    const callArgs = mockCookieStore.set.mock.calls[0];
    expect(callArgs[2].secure).toBe(false);

    process.env.NODE_ENV = originalEnv;
  });
});

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns null when no cookie exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getSession();

    expect(result).toBeNull();
  });

  test("returns session payload when cookie exists", async () => {
    mockCookieStore.get.mockReturnValue({ value: "valid-token" });

    const result = await getSession();

    expect(result).not.toBeNull();
    expect(result?.userId).toBe("user-123");
    expect(result?.email).toBe("test@example.com");
  });

  test("returns null when token is invalid", async () => {
    const { jwtVerify } = await import("jose");
    (jwtVerify as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Invalid token"));

    mockCookieStore.get.mockReturnValue({ value: "invalid-token" });

    const result = await getSession();

    expect(result).toBeNull();
  });
});

describe("deleteSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("deletes the auth cookie", async () => {
    await deleteSession();

    expect(mockCookieStore.delete).toHaveBeenCalledWith("auth-token");
  });
});
