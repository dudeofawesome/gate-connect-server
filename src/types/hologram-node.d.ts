// Type definitions for hologram-node 1.3.2
// Project: https://github.com/HologramEducation/hologram-node
// Definitions by: Louis Orleans <https://github.com/dudeofawesome>

declare module 'hologram-node' {
  interface HologramOptions {
    /** Your orgId from the dashboard */
    orgid: string;
  }

  interface HologramAPI {
    Account: {
      me: () => HologramResponse<HologramUser>;
      getBalance: () => HologramResponse<HologramBalance>;
      getBalanceHistory: () => HologramResponse<HologramUser>;
      getBillingInfo: () => HologramResponse<HologramUser>;
      getOrders: () => HologramResponse<HologramUser>;
      addBalance: (amountToAdd: any) => HologramResponse<HologramUser>;
    };
    Activate: any;
    Device: any;
    Link: any;
    Log: any;
    Org: any;
    Report: any;
    Tag: any;
    Webhook: any;
  }

  interface HologramResponse<Data> {
    /** Indicates whether the request was successful. */
    success: boolean;
    /**
     * Information about why the request failed. Only present when `success` is
     * false.
     */
    error?: string;
    /**
     * Contains the requested data or information about the operation that was
     * performed. Only present when `success` is true.
     */
    data: Data;
  }

  interface HologramGetResponse<Data> extends HologramResponse<Data> {
    /**
     * The query limit, some have this value built in and others often have a
     * maximum value that the limit can be
     */
    limit: number;
    /** The number of values returned by the query */
    size: number;
    /** This is only returned if there are more values than were returned */
    continues?: boolean;
    /** Contains information related to the query performed */
    links: {
      /** The API endpoint path */
      path: string;
      /** API base URL */
      base: string;
      /** URL with query string to get the next results */
      next: string;
    }[];
  }

  interface HologramUser {
    /** Unique user id */
    id: number;
    /**
     * Email address of user.
     * This is the address that is used for logging into the Hologram Dashboard.
     */
    email: string;
    partnerid: number;
    /** First name */
    first: string;
    /** Last name */
    last: string;
    /** Indicates if the user is an admin. Normally empty. */
    role: string;
    /**
     * Date that the user created her account
     * ISO 8601 format
     */
    registered: string;
    /** ID of the users personal organization */
    personal_org: number;
    billingmethod: string;
  }

  interface HologramBalance {
    /** Unique user id */
    userid: number;
    /** Organization ID */
    orgid: number;
    /**
     * User balance
     * @example "96.05"
     */
    balance: string;
    /**
     * Additional balance from promotions
     * @example "0.00"
     */
    promobalance: string;
    /**
     * Auto reload minimum balance as configured in the dashboard
     * @example "50.00"
     */
    minbalance: string;
    /**
     * Auto reload amount as configured in the dashboard
     * @example "0.00"
     */
    topoffamount: string;
    pendingcharges: string;
  }

  const Hologram: (api_key: string, options?: HologramOptions) => HologramAPI;
  export = Hologram;
}
