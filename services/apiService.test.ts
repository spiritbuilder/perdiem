import axios from "axios";
import { ApiService, makeApiRequest } from "./apiService";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe("makeApiRequest", () => {
  it("returns response on success", async () => {
    const mockData = { message: "ok" };
    mockedAxios.mockResolvedValueOnce({ data: mockData });

    const { res, e } = await makeApiRequest({
      url: "http://test.com",
      method: "GET",
    });
    expect(res.data).toEqual(mockData);
    expect(e).toBeUndefined();
    expect(mockedAxios).toHaveBeenCalledWith({
      url: "http://test.com",
      method: "GET",
    });
  });

  it("returns error on failure", async () => {
    const mockError = new Error("Request failed");
    mockedAxios.mockImplementationOnce(() => Promise.reject(mockError));

    const { res, e } = await makeApiRequest({
      url: "http://fail.com",
      method: "GET",
    });
    expect(res).toBeUndefined();

    expect(mockedAxios).toHaveBeenCalledWith({
      url: "http://fail.com",
      method: "GET",
    });
  });
});

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signInWithEmail sends correct POST request", async () => {
    mockedAxios.mockResolvedValueOnce({ data: { token: "abc" } });

    const credentials = { email: "test@example.com", password: "secret" };
    await ApiService.signInWithEmail(credentials);

    expect(mockedAxios).toHaveBeenCalledWith({
      url: expect.stringMatching(/\/auth\/$/),
      method: "POST",
      data: credentials,
    });
  });

  it("getStoreTimes sends correct GET request with token", async () => {
    mockedAxios.mockResolvedValueOnce({ data: [] });

    const token = "jwt-token";
    await ApiService.getStoreTimes(token);

    expect(mockedAxios).toHaveBeenCalledWith({
      url: expect.stringMatching(/\/store-times\/$/),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it("getStoreOverrides sends correct GET request with token", async () => {
    mockedAxios.mockResolvedValueOnce({ data: [] });

    const token = "jwt-token";
    await ApiService.getStoreOverrides(token);

    expect(mockedAxios).toHaveBeenCalledWith({
      url: expect.stringMatching(/\/store-overrides\/$/),
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  });
});
