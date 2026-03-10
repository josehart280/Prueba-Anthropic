import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../use-auth";

// Mock dependencies
vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Import mocks after defining them
import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { useRouter } from "next/navigation";

describe("useAuth", () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    test("returns isLoading as false initially", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
    });

    test("provides signIn and signUp functions", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.signIn).toBeDefined();
      expect(result.current.signUp).toBeDefined();
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
    });
  });

  describe("signIn", () => {
    test("sets isLoading to true during sign in", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);
      (createProject as any).mockResolvedValue({ id: "new-project" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.signIn("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);
    });

    test("returns result on successful sign in with anon work", async () => {
      const anonWork = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        fileSystemData: { "/App.js": { type: "file", content: "// code" } },
      };
      const mockProject = { id: "anon-project-1" };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(anonWork);
      (createProject as any).mockResolvedValue(mockProject);
      (clearAnonWork as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      const signInResult = await act(async () => {
        return await result.current.signIn("test@example.com", "password123");
      });

      expect(signInResult).toEqual({ success: true });
    });

    test("creates project with anon work and navigates to it", async () => {
      const anonWork = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        fileSystemData: { "/App.js": { type: "file", content: "// code" } },
      };
      const mockProject = { id: "anon-project-1" };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(anonWork);
      (createProject as any).mockResolvedValue(mockProject);
      (clearAnonWork as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.any(String),
        messages: anonWork.messages,
        data: anonWork.fileSystemData,
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/anon-project-1");
    });

    test("navigates to most recent project when no anon work", async () => {
      const projects = [
        { id: "project-1", name: "Project 1" },
        { id: "project-2", name: "Project 2" },
      ];

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue(projects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(getProjects).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/project-1");
    });

    test("creates new project when no projects exist", async () => {
      const newProject = { id: "new-project-1" };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue(newProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+$/),
        messages: [],
        data: {},
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/new-project-1");
    });

    test("returns result on failed sign in", async () => {
      (signInAction as any).mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });

      const { result } = renderHook(() => useAuth());

      const signInResult = await act(async () => {
        return await result.current.signIn("test@example.com", "wrongpassword");
      });

      expect(signInResult).toEqual({
        success: false,
        error: "Invalid credentials",
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    test("sets isLoading back to false after sign in completes", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("calls signInAction with correct credentials", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "mypassword");
      });

      expect(signInAction).toHaveBeenCalledWith("test@example.com", "mypassword");
    });
  });

  describe("signUp", () => {
    test("sets isLoading to true during sign up", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);
      (createProject as any).mockResolvedValue({ id: "new-project" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.signUp("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(true);
    });

    test("returns result on successful sign up with anon work", async () => {
      const anonWork = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        fileSystemData: { "/App.js": { type: "file", content: "// code" } },
      };

      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(anonWork);
      (createProject as any).mockResolvedValue({ id: "project-1" });
      (clearAnonWork as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      const signUpResult = await act(async () => {
        return await result.current.signUp("test@example.com", "password123");
      });

      expect(signUpResult).toEqual({ success: true });
    });

    test("creates project with anon work and navigates after sign up", async () => {
      const anonWork = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        fileSystemData: { "/App.js": { type: "file", content: "// code" } },
      };
      const mockProject = { id: "anon-project-1" };

      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(anonWork);
      (createProject as any).mockResolvedValue(mockProject);
      (clearAnonWork as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.any(String),
        messages: anonWork.messages,
        data: anonWork.fileSystemData,
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/anon-project-1");
    });

    test("navigates to most recent project when no anon work after sign up", async () => {
      const projects = [{ id: "project-1" }];

      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue(projects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/project-1");
    });

    test("creates new project when no projects exist after sign up", async () => {
      const newProject = { id: "new-project-1" };

      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue(newProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(createProject).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/new-project-1");
    });

    test("returns result on failed sign up", async () => {
      (signUpAction as any).mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const { result } = renderHook(() => useAuth());

      const signUpResult = await act(async () => {
        return await result.current.signUp("test@example.com", "password123");
      });

      expect(signUpResult).toEqual({
        success: false,
        error: "Email already registered",
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    test("sets isLoading back to false after sign up completes", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("calls signUpAction with correct credentials", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "mypassword");
      });

      expect(signUpAction).toHaveBeenCalledWith("test@example.com", "mypassword");
    });
  });

  describe("error handling", () => {
    test("propagates signIn error when signInAction throws", async () => {
      (signInAction as any).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signIn("test@example.com", "password123");
        })
      ).rejects.toThrow("Network error");

      expect(result.current.isLoading).toBe(false);
    });

    test("propagates getProjects error when it throws", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockRejectedValue(new Error("Database error"));

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signIn("test@example.com", "password123");
        })
      ).rejects.toThrow("Database error");
    });

    test("propagates createProject error when it throws", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockRejectedValue(new Error("Creation failed"));

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signIn("test@example.com", "password123");
        })
      ).rejects.toThrow("Creation failed");
    });
  });

  describe("edge cases", () => {
    test("handles empty anon work messages array", async () => {
      const anonWork = {
        messages: [],
        fileSystemData: {},
      };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(anonWork);
      (getProjects as any).mockResolvedValue([{ id: "project-1" }]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      // Should not create project with empty anon work, should get user projects instead
      expect(getProjects).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/project-1");
    });

    test("does not call handlePostSignIn when signIn fails", async () => {
      (signInAction as any).mockResolvedValue({ success: false, error: "Failed" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password123");
      });

      expect(getAnonWorkData).not.toHaveBeenCalled();
      expect(getProjects).not.toHaveBeenCalled();
      expect(createProject).not.toHaveBeenCalled();
    });

    test("does not call handlePostSignIn when signUp fails", async () => {
      (signUpAction as any).mockResolvedValue({ success: false, error: "Failed" });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("test@example.com", "password123");
      });

      expect(getAnonWorkData).not.toHaveBeenCalled();
      expect(getProjects).not.toHaveBeenCalled();
      expect(createProject).not.toHaveBeenCalled();
    });
  });
});
