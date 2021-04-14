import { IRequest } from "../types";
import { AxiosPromise, AxiosResponse } from "axios";

export default class InboundRequest {
    private request: IRequest;

    constructor(request: IRequest) {
        this.request = request;
    }

        // example request with custom parser:
        // return this.DoPost('Core.GetSettings', res => {
        //     console.log('got settings', res);
        //     return this.DefaultParse(res);
        // });


    public GetSettings(): AxiosPromise<Record<string, string>> {
        return this.DoPost('Core.GetSettings');
    }

    public DoPost<T>(functionName: string, parseOverride?: (res: AxiosResponse<any>) => AxiosResponse<T>): AxiosPromise<T> {
        return Promise.resolve()
            .then(() => this.request.getInstance().post(``, this.GetRequestBody(functionName)))
            .then((res) => {
                if (parseOverride) {
                    return parseOverride(res);
                }
                else {
                    return this.DefaultParse(res);
                }
            })
            .catch((err) => err);
    }

    private DefaultParse<T>(res: AxiosResponse<any>): AxiosResponse<T> {
        res.data = res.data.body;
        return res;
    }

    private GetRequestBody(functionName: string) {
        return {
            'function': functionName,
            'args': {}
        }
    }
}