import axios, { AxiosRequestConfig } from "axios";

export class ApiService {
  public static signInWithEmail(data: { email: string; password: string }) {
    return makeApiRequest({ url: `${baseURL}/auth/`, data, method: "POST" });
  }

  public static signOut() {}

  public static checkIfStoreIsOpen() {}

  public static getStoreTimes(token: string) {
    return makeApiRequest({
      url: `${baseURL}/store-times/`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public static getStoreOverrides(token: string) {
    return makeApiRequest({
      url: `${baseURL}/store-overrides/`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const makeApiRequest = async (req: AxiosRequestConfig) => {
  let res: any, e: any;
  try {
    res = await axios(req);
  } catch (e) {
    e = e;
    console.log(e);
  }

  return { res, e };
};

const baseURL = "https://coding-challenge-pd-1a25b1a14f34.herokuapp.com";
