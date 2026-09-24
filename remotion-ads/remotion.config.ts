import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 with reasonable quality + faststart so the file plays cleanly
// when served from the portfolio's static hosting.
Config.setCodec("h264");
Config.setCrf(20);
