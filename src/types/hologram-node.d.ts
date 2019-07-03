// Type definitions for hologram-node 1.3.2
// Project: https://github.com/HologramEducation/hologram-node
// Definitions by: Louis Orleans <https://github.com/dudeofawesome>

declare module 'hologram-node' {
  import { HologramAPI, HologramOptions } from 'hologram-node-types';

  const Hologram: (api_key: string, options?: HologramOptions) => HologramAPI;
  export = Hologram;
}

// TODO: figure out a better way to allow for a single base import + interface imports
declare module 'hologram-node-types' {
  export type HologramSIM = string;
  export type NumBool = 0 | 1;

  export interface HologramOptions {
    /** Your orgId from the dashboard */
    orgid: string;
  }

  export interface HologramAPI {
    Account: {
      /** Gets current user information. */
      me(): HologramResponse<HologramUser>;
      /** Retrieve the current amount of credit you have on your account. */
      getBalance(): HologramGetResponse<HologramBalance>;
      /** Retrieve a history of transactions (credits and charges). */
      getBalanceHistory(): HologramGetResponse<HologramBalanceHistoryItem[]>;
      /** Retrieve the truncated version of your selected payment method. */
      getBillingInfo(): HologramGetResponse<unknown>;
      /** Retrieve the orders you have placed. */
      getOrders(): HologramGetResponse<unknown>;
      /**
       * Charge the user's configured billing source and add that amount to
       * your account balance.
       */
      addBalance(amountToAdd: number): HologramResponse<HologramPlan>;
    };
    Activate: {
      /**
       * The Data Plans endpoints return pricing and descriptions for the
       * different data plans that Hologram offers. When changing the data plan
       * for a cellular link via API, you must refer to the plan by its ID,
       * which you can determine from these endpoints.
       */
      getPlans(): HologramGetResponse<HologramPlan[]>;
      /**
       * TODO: figure out why planId is a string here, but a number in the
       * HologramPlan object
       */
      getPlan(planId: string): HologramGetResponse<HologramPlan>;
      /**
       * Preview the price and validity of an activation
       */
      preview(
        /** SIM numbers to activate */
        sims: HologramSIM[],
        /**
         * Device data plan. Look up plan IDs with
         * [List Data Plans](https://jsapi.apiary.io/apis/hologram/reference/device-management/cellular-links/activate-sims.html#reference/device-management/data-plans/list-data-plans).
         */
        plan: number,
        /**
         * Geographic zone. Currently the valid zones are 1 and 2. Higher zones
         * incur higher costs. See [pricing](https://hologram.io/pricing/) for
         * details.
         */
        zone: string,
        useAccountBalance: boolean,
      ): HologramResponse<any>;
      /**
       * Activate the selected sims. Charges your configured billing method.
       */
      activate(
        /** SIM numbers to activate */
        sims: HologramSIM[],
        /**
         * Device data plan. Look up plan IDs with
         * [List Data Plans](https://jsapi.apiary.io/apis/hologram/reference/device-management/cellular-links/activate-sims.html#reference/device-management/data-plans/list-data-plans).
         */
        plan: number,
        /**
         * Geographic zone. Currently the valid zones are 1 and 2. Higher zones
         * incur higher costs. See [pricing](https://hologram.io/pricing/) for
         * details.
         */
        zone: string,
        useAccountBalance: boolean,
      ): HologramActivateSimResponse;
    };
    Device: {
      /** Get one of your devices. */
      getOne(deviceid: string): HologramGetResponse<HologramDevice>;
      getAll(
        options?: HologramGetAllDevicesOptions,
      ): HologramGetResponse<HologramDevice[]>;
      getRouterCreds(deviceid: string): HologramGetResponse<unknown>;
      genRouterCreds(deviceid: string): HologramResponse<unknown>;
      linkTag(
        tagid: string,
        deviceids: unknown[],
      ): HologramResponse<HologramDeviceTagLinkData>;
      unlinkTag(
        tagid: string,
        deviceids: unknown[],
      ): HologramResponse<HologramDeviceTagLinkData>;
      changeName(deviceid: string, name: string): HologramResponse<unknown>;
      sendSMS(
        deviceid: string,
        message: string,
        options?: HologramSendSMSOptions,
      ): HologramResponse<void>;
      /**
       * Send a TCP or UDP message to one or more devices on the Hologram
       * network. See the guide for details.
       */
      sendData(
        deviceids: number[],
        data: string,
        port: string,
        protocol: string,
      ): HologramResponse<HologramSendDataData[]>;
      /**
       * This endpoint does not require authentication with your API key, as
       * the webhook GUID serves as an authentication token. In order to
       * generate a webhook URL, please visit the cloud configuration page
       * for your device.
       */
      sendDataViaWebhook(
        deviceid: string,
        webhookguid: string,
        data: string,
      ): HologramResponse<HologramSendDataData[]>;
      getPhoneNumberCost(
        deviceid: string,
        country: string,
        options?: HologramGetPhoneNumberCostOptions,
      ): HologramGetResponse<unknown>;
      addPhoneNumber(
        deviceid: string,
        country: string,
        options?: HologramGetPhoneNumberCostOptions,
      ): HologramResponse<unknown>;
      removePhoneNumber(deviceid: string): HologramResponse<unknown>;
      setTunnelable(
        deviceid: string,
        tunnelable: boolean,
      ): HologramResponse<unknown>;
    };
    Link: {
      getAll(): HologramGetResponse<HologramLink[]>;
      getOne(linkId: string): HologramGetResponse<HologramLink>;
      getUsage(linkId: string): HologramGetResponse<unknown>;
      pause(linkId: string): HologramResponse<HologramPauseData>;
      resume(linkId: string): HologramResponse<HologramPauseData>;
      setOverageLimit(
        linkId: string,
        limit: string,
      ): HologramResponse<HologramLink>;
      getStatusHistory(linkId: string): HologramResponse<unknown>;
      /** Preview costs and information of changing a links plan . */
      changePlanPreview(
        linkId: string,
        planid: number,
        zone: string,
      ): HologramResponse<HologramPlan>;
      /**
       * Change the plan of a selected cellular link. Charges your user balance.
       */
      changePlan(
        linkId: string,
        planid: number,
        zone: string,
      ): HologramResponse<HologramPlan>;
    };
    Log: {
      getAll(options?: HologramGetLogOptions): HologramResponse<unknown>;
      getForDevice(deviceid: string): HologramResponse<unknown>;
    };
    Org: {
      /**
       * List all organizations that you are a member of. This includes the
       * special "personal" organization tied to your user.
       */
      getAll(): HologramGetResponse<HologramOrg[]>;
      getOne(orgid: string): HologramGetResponse<HologramOrg>;
      getPending(): HologramGetResponse<unknown>;
    };
    Report: {
      billing(): HologramResponse<unknown>;
      devices(): HologramResponse<unknown>;
    };
    Tag: {
      getAll(): HologramGetResponse<HologramTag[]>;
      create(name: string): HologramResponse<HologramTag>;
      update(tagId: string, name: string): HologramResponse<HologramTag>;
      remove(tagId: string): HologramResponse<void>;
    };
    Webhook: {
      get(deviceid: string): HologramGetResponse<unknown>;
      create(
        deviceid: string,
        port: string,
        protocol: string,
      ): HologramResponse<unknown>;
      update(
        deviceid: string,
        port: string,
        protocol: string,
      ): HologramResponse<unknown>;
      regenerate(deviceid: string): HologramResponse<unknown>;
      remove(deviceid: string): HologramResponse<unknown>;
    };
  }

  export interface HologramResponse<Data> {
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

  export interface HologramGetResponse<Data> extends HologramResponse<Data> {
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

  export interface HologramUser {
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

  export interface HologramBalance {
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

  export interface HologramBalanceHistoryItem {
    /** TODO: what is this? */
    id: number;
    /** Unique user id */
    userid: number;
    /** Organization ID */
    orgid: number;
    /**
     * TODO: what is this?
     * ISO 8601 format
     */
    time: string;
    description: string;
    /**
     * TODO: what is this?
     * @example "-3.95"
     */
    amount: string;
  }

  export interface HologramPlan {
    /** Was the request a preview (true) or an actual transaction (false)? */
    preview: boolean;
    sku: string;
    unit_cost: number;
    total_cost: number;
    description: string;
    extra_description: string;
    needs_shipping: boolean;
    shipping_cost: number;
  }

  export interface HologramPlan {
    /** Unique integer ID for the data plan */
    id: number;
    /** internal use */
    partnerid: number;
    /** Human-readable name */
    name: string;
    description: string;
    /** Monthly data included in the plan (in bytes) */
    data: number;
    /**
     * for internal use
     * TODO: maybe this is a boolean 0 or 1?
     */
    recurring: number;
    /**
     * Whether plan is available for new subscriptions
     * TODO: maybe this is a boolean 0 or 1?
     */
    enabled: number;
    /** for internal use */
    billingperiod: string;
    /** for internal use */
    trialdays: string;
    /** for internal use */
    templateid: string;
    /** for internal use */
    carrierid: number;
    /** for internal use */
    groupid: number;
    /**
     * Flag indicating whether plan is a developer plan.
     * nThis is equivalent to Pilot Plan. Only one Pilot/dev plan allowed per
     * account, no monthly fee.
     * TODO: maybe this is a boolean 0 or 1?
     */
    developerplan: number;
    /** Tiers are automatic price discounts based on SIM counts */
    tiers: {
      [key: string]: {
        /**
         * This is the number of devices needed to be on your account in order
         * to hit the given tier's pricing
         */
        devicecount: number;
        /** These are the different coverage zones available for the plan */
        zones: HologramZones;
      };
    };
    /** The current tier that your account is on */
    current_tier: string;
    /** Zone pricing for the current tier */
    zones: HologramZones;
    /**
     * Legacy field containing monthly cost of plan for zone X (deprecated)'
     * @deprecated
     */
    amountX: string;
    /**
     * Legacy field containing overage cost of plan for zone X (deprecated)'
     * @deprecated
     */
    overageX: string;
    /**
     * Legacy field containing SMS cost of plan for zone X (deprecated)'
     * @deprecated
     */
    smsX: string;
  }

  export interface HologramZones {
    /** ZONENAME could be something like "global" or "1" or "2" */
    [key: string]: {
      /**
       * Monthly cost of plan for given zone
       * @example "1.50"
       */
      amount: string;
      /**
       * Cost of SMS for given zone
       * @example "0.19"
       */
      sms: string;
      /**
       * Per Megabyte cost of overage for plan
       * @example "1"
       */
      overage: string;
    };
  }

  export interface HologramActivateSimResponse
    extends HologramResponse<{
      /** Device ID of the new corresponding device */
      device: number;
      /** ID of the new cellular link */
      link: number;
      /**
       * @example "99990000000012345678"
       */
      sim: string;
    }> {
    order_data: HologramOrderData;
  }

  export interface HologramOrderData {
    /** Was the request a preview (true) or an actual transaction (false)? */
    preview: boolean;
    /**
     * @example "PLAN"
     */
    sku: string;
    /**
     * @example "0.4"
     */
    unit_cost: string;
    /**
     * @example "0.4"
     */
    total_cost: string;
    /**
     * @example "Data plan for SIMs"
     */
    description: string;
    extra_description: string;
    needs_shipping: boolean;
    /**
     * @example "0"
     */
    shipping_cost: number;
  }

  export interface HologramGetAllDevicesOptions {
    /**
     * Return a maximum of this many devices.
     * @example "20"
     */
    limit?: string;
    /** Return the devices whose IDs come after the given ID */
    startafter?: string;
  }

  export interface HologramDevice {
    /** Integer device ID */
    id: number;
    /**
     * ID of the organization that owns the device (may be a personal organization)
     */
    orgid: number;
    /** User-configurable device name */
    name: string;
    /**
     * for internal use
     * @example "Unknown"
     */
    type: string;
    /**
     * Timestamp when the device record was created
     * ISO 8601 format
     */
    whencreated: string;
    /** Device phone number, if configured */
    phonenumber: string;
    /**
     * Monthly cost of phone number
     * @example "0.00"
     */
    phonenumber_cost: string;
    /**
     * Is tunneling enabled for the device?
     * See the [guide](https://hologram.io/docs/guide/cloud/spacebridge-tunnel)
     * for details
     * TODO: maybe this is a boolean 0 or 1?
     */
    tunnelable: number;
    /**
     * Last IMEI seen for this device
     * @example "957520074024080"
     */
    imei: string;
    /**
     * Last IMEI-SV seen for this device.
     * This is the same as IMEI but instead of check digit has two digits at
     * end for software version.
     * @example "9575200740240801"
     */
    imei_sv: string;
    /**
     * for internal use
     * TODO: maybe this is a boolean 0 or 1?
     */
    hidden: number;
    /**
     * Configurable device categories. See [Device Tags](#reference/device-management/device-tags/) for details.
     */
    tags: unknown[];
    /** Information about the device's SIM and data plan */
    links: {
      cellular: {
        id: number;
        deviceid: number;
        devicename: string;
        orgid: number;
        tunnelable: number;
        partnerid: number;
        sim: string;
        msisdn: string;
        imsi: number;
        dataplansubscriptionid: number;
        zone: number;
        carrier: number;
        state: string;
        /** ISO 8601 format */
        whenclaimed: string;
        /** ISO 8601 format */
        whenexpires: string;
        /** ISO 8601 format */
        whencreated: string;
        overagelimit: number;
        /**
         * @example "hologram"
         */
        apn: string;
      }[];
    };
    /** Detailed information about the latest cellular session for the SIM */
    lastsession: {
      linkid: number;
      bytes: number;
      /** ISO 8601 format */
      session_begin: string;
      /** ISO 8601 format */
      session_end: string;
      /**
       * For legacy reasons, the IMEI in here is actually the IMEI-SV. To see
       * the plain IMEI, see higher up in the Device object
       */
      imei: string;
      /** Cell ID of last session (Can be used to get tower location) */
      cellid: string;
      /**
       * Location area code of last session (can be used to get tower location)
       */
      lac: string;
      network_name: string;
      /** Flag is set if session is currently open */
      active: boolean;
      /**
       * Longitude of device tower location
       * @example
       */
      longitude: string;
      /**
       * Latitude of device tower location
       * @example
       */
      latitude: string;
      /** Range of estimate of device tower location */
      range: number;
    };
  }

  export interface HologramDeviceTagLinkData {
    /** Human-readable tag name */
    name: string;
    /** Unique integer ID */
    id: number;
    /** IDs of devices linked to this tag */
    deviceids: number[];
  }

  export interface HologramSendSMSOptions {
    fromNumber?: string;
  }

  export interface HologramSendDataData {
    deviceid: number;
    messageid: string;
  }

  export interface HologramGetPhoneNumberCostOptions {
    areacode?: string;
  }

  export interface HologramGetLogOptions {
    deviceid?: string;
  }

  export interface HologramLink {
    /** The link's unique integer ID */
    id: number;
    /** Device ID corresponding to the link */
    deviceid: number;
    /** Description of the device */
    devicename: string;
    /** ID of the organization that owns the link */
    orgid: number;
    /** Is tunneling enabled for the link? (1=true, 0=false) */
    tunnelable: NumBool;
    partnerid: number;
    /** SIM number corresponding to the link */
    sim: string;
    /** MSISDN corresponding to the link */
    msisdn: string;
    /** IMSI corresponding to the link */
    imsi: number;
    /** The link's data plan type */
    dataplansubscriptionid: number;
    /** Geographical zone of the link's data plan */
    zone: number;
    /** ID of the carrier that the link last connected to */
    carrier: number;
    /** State of the link (LIVE, PAUSE, DEACTIVATE) */
    state: 'LIVE' | 'PAUSE' | 'DEACTIVATE';
    /** Timestamp when the SIM was activated */
    whenclaimed: string;
    /**
     * Timestamp when the current billing period ends, or when the subscription
     * expired
     */
    whenexpires: string;
    /** Timestamp when the link's record was first created */
    whencreated: string;
    /**
     * Configured overage limit, or -1 if no limit is set. See the
     * [guide](https://hologram.io/docs/guide/connect/device-management#data-and-overage-limits)
     * for details on overage limits.
     */
    overagelimit: number;
    /**
     * APN to use when connecting with this link's SIM card
     */
    apn: 'hologram' | string;
  }

  export interface HologramPauseData {
    /**
     * PENDING-USER (string) - New state of the link.
     *
     * May be a 'pending' state until the change is propagated to the cellular
     * network.
     */
    newstate: string;
  }

  export interface HologramOrg {
    /** Unique ID for the organization */
    id: number;
    /** Display name */
    name: string;
    /**
     * Is this organization a personal organization belonging to a single user?
     */
    is_personal: boolean;
    /** ID of the user that created the organization */
    ownerid: number;
    /** Members of the organization */
    users: HologramOrgUser[];
    /** Users with pending invitations to the organization */
    pending: HologramOrgUser[];
  }

  export interface HologramOrgUser {
    id: number;
    permissions: string[];
    first: string;
    last: string;
    email: string;
  }

  export interface HologramTag {
    /** Human-readable tag name */
    name: string;
    /** Unique integer ID */
    id: number;
    /** IDs of devices linked to this tag */
    deviceids: number[];
  }
}
