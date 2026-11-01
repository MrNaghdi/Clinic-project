import serviceFace from "../../../assets/image/botax.jpg";
import serviceHair from "../../../assets/image/lift.webp";
import serviceLaser from "../../../assets/image/laser.webp";

export const SERVICE_IMAGES: Record<string, string> = {
  "لیزر": serviceLaser,
  "لیزر موهای زائد": serviceLaser,
  "لیزر مو": serviceLaser,
  "لیفت": serviceHair,
  "لیفت صورت": serviceHair,
  "لیفت ابرو": serviceHair,
  "بوتاکس": serviceFace,
  "تزریق بوتاکس": serviceFace,
  "بوتاکس صورت": serviceFace,
};

export const DEFAULT_SERVICE_IMAGE = serviceFace;

export function getServiceImage(name: string): string {
  return SERVICE_IMAGES[name] || DEFAULT_SERVICE_IMAGE;
}