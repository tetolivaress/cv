export interface Viewport {
  name: string;
  width: number;
  height: number;
  mobile?: boolean;
}

/** Every viewport from the brief, plus phone landscape. */
export const viewports: Viewport[] = [
  { name: "android-360x800", width: 360, height: 800, mobile: true },
  { name: "iphone-se-375x667", width: 375, height: 667, mobile: true },
  { name: "iphone-393x852", width: 393, height: 852, mobile: true },
  { name: "iphone-pro-max-430x932", width: 430, height: 932, mobile: true },
  { name: "android-landscape-800x360", width: 800, height: 360, mobile: true },
  { name: "iphone-se-landscape-667x375", width: 667, height: 375, mobile: true },
  { name: "iphone-landscape-852x393", width: 852, height: 393, mobile: true },
  { name: "iphone-pro-max-landscape-932x430", width: 932, height: 430, mobile: true },
  { name: "ipad-portrait-768x1024", width: 768, height: 1024, mobile: true },
  { name: "ipad-portrait-820x1180", width: 820, height: 1180, mobile: true },
  { name: "ipad-landscape-1024x768", width: 1024, height: 768, mobile: true },
  { name: "ipad-landscape-1180x820", width: 1180, height: 820, mobile: true },
  { name: "laptop-1280x800", width: 1280, height: 800 },
  { name: "laptop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
  { name: "desktop-2560x1440", width: 2560, height: 1440 },
  { name: "ultrawide-3440x1440", width: 3440, height: 1440 },
];
