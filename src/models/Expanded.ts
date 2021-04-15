import { ILinkModel, IRequest, ICVLValueModel } from "../types";
import { AxiosPromise, AxiosResponse } from "axios";

interface IExpandedCvlValue {
    value: ICVLValueModel;
    id: number;
    cvlId: string;
    deactivated: boolean;
    dateCreated: Date;
    lastModified: Date;
}

export default class InboundRequest {
    private request: IRequest;

    constructor(request: IRequest) {
        this.request = request;
    }

    // Currently only these few functions are implemented. Add more of the Core functionality as needed.
    // Package users can use 'DoPost' and 'DoPostCollection' if they want full control themselves.

    public AddLink(sourceEntityId: number, targetEntityId: number, linkTypeId: string): AxiosPromise<IExpandedCvlValue> {
        return this.DoPost("Core.AddLink", { sourceEntityId, targetEntityId, linkTypeId }, (res) => {
            const remotingLink = this.DefaultParse(res).data as any;
            const linkModel: ILinkModel = {
                id: remotingLink.Id,
                index: remotingLink.Index,
                isActive: !remotingLink.Inactive,
                linkEntityId: remotingLink.LinkEntity ? remotingLink.LinkEntity.Id : undefined,
                linkTypeId: remotingLink.LinkType.Id,
                sourceEntityId: remotingLink.Source.Id,
                targetEntityId: remotingLink.Target.Id,
            };
            res.data = linkModel;
            return res;
        });
    }

    public GetCVLValuesForCVL(cvlId: string): AxiosPromise<IExpandedCvlValue[]> {
        return this.DoPostCollection("Core.GetCVLValuesForCVL", { cvlId }, (rVal) => {
            const cvlValue: IExpandedCvlValue = {
                cvlId: rVal.CvlId,
                dateCreated: rVal.DateCreated,
                deactivated: rVal.Deactivated,
                id: rVal.Id,
                lastModified: rVal.LastModified,
                value: {
                    index: rVal.Index,
                    key: rVal.Key,
                    parentKey: rVal.ParentKey,
                    value: rVal.Value,
                },
            };
            return cvlValue;
        });
    }

    public GetSetting(name: string): AxiosPromise<string> {
        return this.DoPost("Core.GetSetting", { name });
    }

    public GetSettings(): AxiosPromise<Record<string, string>> {
        return this.DoPost("Core.GetSettings");
    }

    public DoPostCollection<T>(functionName: string, args: {} = {}, parseOverride?: (remotingValue: any) => T): AxiosPromise<T[]> {
        return this.DoPost(functionName, args, (res) => {
            const remotingValues = this.DefaultParse(res).data as any[];
            const newVals: T[] = [];
            for (const val of remotingValues) {
                if (parseOverride) {
                    newVals.push(parseOverride(val));
                } else {
                    newVals.push(val);
                }
            }
            res.data = newVals;
            return res;
        });
    }

    public DoPost<T>(functionName: string, args: {} = {}, parseOverride?: (res: AxiosResponse<any>) => AxiosResponse<T>): AxiosPromise<T> {

        return this.request.getInstance().post(``, this.GetRequestBody(functionName, args))
            .then((res) => {
                if (parseOverride) {
                    return parseOverride(res);
                } else {
                    return this.DefaultParse<T>(res);
                }
            })
            .catch((err) => {
                if (err.message.includes("404")) {
                    throw new Error("Error 404: You are attempting to use Expanded API functionality. " +
                    "This requires an inbound extension set up for the customer. Make sure it is set up correctly and enabled!");
                } else {
                    throw err;
                }
            });
    }

    private DefaultParse<T>(res: AxiosResponse<any>): AxiosResponse<T> {
        res.data = res.data.body;
        return res;
    }

    private GetRequestBody(functionName: string, args: {}) {
        return {
            args,
            function: functionName,
        };
    }
}
