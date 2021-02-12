import axios, { AxiosInstance } from "axios";
import { IConfig, IRequest } from "../types";

export default class Request implements IRequest {
  public config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  public getInstance = (): AxiosInstance => {
    const headers: any = { "X-inRiver-APIKey": this.config.apiKey };
    if (this.config.language) {
      headers["accept-language"] = this.config.language;
    }

    return axios.create({
      baseURL: `${this.config.apiRoot}/api/${this.config.apiversion}/`,
      headers,
      responseType: "json"
    });
  }
}
