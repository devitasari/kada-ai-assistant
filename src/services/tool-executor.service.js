import { getPrograms } from "../tools/getPrograms.tool.js";
import { getSchedule } from "../tools/getSchedule.tool.js";
import { getPricing } from "../tools/getPricing.tool.js";
import { getRegistration } from "../tools/getRegistration.tool.js";

const TOOLS_REGISTRY = {
  getPrograms,
  getSchedule,
  getPricing,
  getRegistration,
};

export async function executeTool(functionName) {
  const tool = TOOLS_REGISTRY[functionName];
  if (!tool) {
    throw new Error(`Unknown tool: ${functionName}`);
  }
  return tool();
}