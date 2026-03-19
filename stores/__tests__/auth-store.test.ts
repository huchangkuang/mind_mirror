import { useAuthStore } from "@/stores/auth-store";
import { fetchCurrentUser } from "@/lib/api/auth";

jest.mock("@/lib/api/auth", () => ({
  fetchCurrentUser: jest.fn(),
  loginAccount: jest.fn(),
  logoutAccount: jest.fn(),
  registerAccount: jest.fn(),
}));

const mockedFetchCurrentUser = fetchCurrentUser as jest.MockedFunction<typeof fetchCurrentUser>;

function resetStore() {
  useAuthStore.setState({
    status: "loading",
    user: null,
    isFeedbackModerator: false,
    error: null,
    bootstrapped: false,
  });
}

describe("auth-store bootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
  });

  it("sets authenticated state when /me succeeds", async () => {
    mockedFetchCurrentUser.mockResolvedValue({
      authenticated: true,
      user: { id: 1, username: "alice" },
      isFeedbackModerator: false,
    });

    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      user: { id: 1, username: "alice" },
      bootstrapped: true,
    });
  });

  it("sets guest when /me fails and there is no optimistic session", async () => {
    mockedFetchCurrentUser.mockRejectedValue(new Error("network"));

    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState()).toMatchObject({
      status: "guest",
      user: null,
      bootstrapped: true,
    });
  });

  it("keeps optimistic authenticated state when /me fails", async () => {
    useAuthStore.setState({
      status: "authenticated",
      user: { id: 2, username: "bob" },
      isFeedbackModerator: true,
      bootstrapped: false,
      error: null,
    });
    mockedFetchCurrentUser.mockRejectedValue(new Error("network"));

    await useAuthStore.getState().bootstrap();

    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      user: { id: 2, username: "bob" },
      bootstrapped: true,
    });
  });

  it("discards stale bootstrap result after a newer bootstrap runs (AbortError on superseded request)", async () => {
    mockedFetchCurrentUser
      .mockImplementationOnce((signal) => {
        return new Promise((_resolve, reject) => {
          const onAbort = () => {
            const err = new Error("Aborted");
            err.name = "AbortError";
            reject(err);
          };
          if (signal?.aborted) {
            onAbort();
            return;
          }
          signal?.addEventListener("abort", onAbort, { once: true });
        });
      })
      .mockResolvedValueOnce({
        authenticated: true,
        user: { id: 9, username: "carol" },
        isFeedbackModerator: false,
      });

    const first = useAuthStore.getState().bootstrap();
    const second = useAuthStore.getState().bootstrap();

    await second;

    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      user: { id: 9, username: "carol" },
      bootstrapped: true,
    });

    await expect(first).resolves.toBeUndefined();
  });
});
