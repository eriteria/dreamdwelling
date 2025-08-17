import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { usePropertiesMap } from "@/hooks/usePropertiesMap";

jest.mock("axios");

describe("usePropertiesMap", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: "http://localhost" };
    // Silence expected error logs in case of failures
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fetches properties and updates state", async () => {
    const deferred = () => {
      let resolve: (v: any) => void;
      let reject: (e: any) => void;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      // @ts-ignore
      return { promise, resolve, reject };
    };

    const mockedGet = (axios as any).get as jest.Mock;
    const d = deferred();
    mockedGet.mockReturnValueOnce(d.promise);

    const { result } = renderHook(() => usePropertiesMap({ autoFetch: true }));
    await waitFor(() => expect(mockedGet).toHaveBeenCalled());

    d.resolve({ data: [{ id: 1, latitude: 40, longitude: -75 }] });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.properties.length).toBe(1);
    expect(result.current.error).toBeNull();
  });
});
