import Config from "./config";
import { Channel, Syndicate, Query, System, Media, Link, Workarea, Model, Entity, Expanded } from "./models";
import { IRequest } from "./types";
import InboundRequest from "./utils/inboundRequest";
import Request from "./utils/request";

export default class InRiverAPIClient {
  private request: IRequest;
  private InRiverChannel: Channel;
  private InRiverSyndicate: Syndicate;
  private InRiverCongifuration: System;
  private InRiverQuery: Query;
  private InRiverMedia: Media;
  private InRiverLink: Link;
  private InRiverWorkarea: Workarea;
  private InRiverModel: Model;
  private InRiverEntity: Entity;
  private inriverExpanded?: Expanded = undefined;
  private inboundRequest?: IRequest = undefined;

  constructor(
    apiKey: string,
    apiRoot: string = "https://apieuw.productmarketingcloud.com",
    apiversion: string = "v1.0.0",
    language?: string,
    inboundUri?: string,
    inboundKey?: string    
  ) {
    this.request = new Request(new Config(apiKey, apiRoot, apiversion, language));
    this.InRiverChannel = new Channel(this.request);
    this.InRiverSyndicate = new Syndicate(this.request);
    this.InRiverQuery = new Query(this.request);
    this.InRiverCongifuration = new System(this.request);
    this.InRiverMedia = new Media(this.request);
    this.InRiverLink = new Link(this.request);
    this.InRiverWorkarea = new Workarea(this.request);
    this.InRiverModel = new Model(this.request);
    this.InRiverEntity = new Entity(this.request);
    
    if(inboundUri && inboundKey) {
      this.inboundRequest = new InboundRequest(new Config(inboundKey, inboundUri, undefined, undefined));
      this.inriverExpanded = new Expanded(this.inboundRequest);
    }
  }

  public get Channel() {
    return this.InRiverChannel;
  }

  public get Syndicates() {
    return this.InRiverSyndicate;
  }

  public get Query() {
    return this.InRiverQuery;
  }

  public get System() {
    return this.InRiverCongifuration;
  }

  public get Media() {
    return this.InRiverMedia;
  }

  public get Link() {
    return this.InRiverLink;
  }

  public get Workarea() {
    return this.InRiverWorkarea;
  }

  public get Model() {

    return this.InRiverModel;
  }

  public get Entities() {
    return this.InRiverEntity;
  }

  public get Expanded() {
    if(this.inboundRequest) {
      return this.inriverExpanded!;
    }
    else {
      throw 'Error! Expanded is not in use because either "inboundUri" or "inboundKey" ' 
      + 'was not specified in the InRiverAPIClient constructor.'
    }
  }
}
