export interface FeatureConfig {
  fileUploadEnabled: boolean;
  speechEnabled: boolean;
  userExtensionsEnabled: boolean;
}

export const featureConfig: FeatureConfig = {
  fileUploadEnabled: true,
  speechEnabled: true,
  userExtensionsEnabled: true,
};