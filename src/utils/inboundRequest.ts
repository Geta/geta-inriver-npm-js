import axios, { AxiosInstance } from "axios";
import { IConfig, IRequest } from "../types";

export default class InboundRequest implements IRequest {
    public config: IConfig;

    constructor(config: IConfig) {
        this.config = config;
    }

    public getInstance = (): AxiosInstance => {
        const headers: any = { "Content-Type": "application/json" };
        if (this.config.language) {
            headers["accept-language"] = this.config.language;
        }
        
        return axios.create({
            baseURL: this.config.apiRoot,
            headers,
            responseType: "json",
            auth: {
                username: 'apikey',
                password: this.config.apiKey
            }
        });
    }
}
