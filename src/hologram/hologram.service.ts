import { Injectable } from '@nestjs/common';
import * as Hologram from 'hologram-node';
import { HologramAPI, HologramDevice } from 'hologram-node-types';

import { ConfigService } from '../config/config.service';

export class HologramApiError extends Error {
  constructor(message: string | undefined) {
    super(message || 'Unknown Hologram API error');
  }
}

@Injectable()
export class HologramService {
  private hologram: HologramAPI;

  constructor(private readonly config_service: ConfigService) {
    this.hologram = Hologram(this.config_service.get('HOLOGRAM_API_KEY'), {
      orgid: this.config_service.get('HOLOGRAM_ORG_ID'),
    });
  }

  async getDevice(device_id: string): Promise<HologramDevice> {
    const res = await this.hologram.Device.getOne(device_id);
    if (!res.success) {
      throw new HologramApiError(res.error);
    }

    return res.data;
  }

  async sendOpenGateMessage(device_id: string, message: string): Promise<void> {
    const res = await this.hologram.Device.sendSMS(device_id, message);
    if (!res.success) {
      throw new HologramApiError(res.error);
    }
  }
}
