import type { SystemConfig } from "../types";

export const systemConfig: SystemConfig = {
  maintenanceMode: false, // Set to true untuk maintenance mode
  maintenanceMessage: "Sistem sedang dalam pemeliharaan. Silakan coba lagi nanti.",
  maxPhotoPerInspection: 5,
  fifoEnabled: true,
  fefoEnabled: true,
};

export const getConfig = (): SystemConfig => {
  return systemConfig;
};

export const setMaintenanceMode = (enabled: boolean, message?: string) => {
  systemConfig.maintenanceMode = enabled;
  if (message) {
    systemConfig.maintenanceMessage = message;
  }
};
