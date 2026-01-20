import localFont from "next/font/local";

export const bodyFont = localFont({
  src: [
    {
      path: "../public/fonts/EuclidCircularB-Light.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Euclid-Circular-B-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/EuclidCircularB-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  // weight: "400",
  // style: "normal",
  // display: "swap",
});

export const headingFont = localFont({
  src: "../public/fonts/Freizeit-Trial-Medium.woff2",
  variable: "--font-heading",
  // weight: "400",
  // style: "normal",
  // display: "swap",
});
