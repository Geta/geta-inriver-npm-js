import { IConfig } from "./types";

export default class Config implements IConfig {
  public apiRoot: string;
  public apiversion: string;
  public apiKey: string;
  public language?: string;

  constructor(
    apiKey: string,
    apiRoot: string = "https://apieuw.productmarketingcloud.com/",
    apiversion: string = "v1.0.0",
    language?: string
  ) {
    this.apiRoot = apiRoot;
    this.apiversion = apiversion;
    this.apiKey = apiKey;
    this.language = language;
  }
}
