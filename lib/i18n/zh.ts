import { contentMessages } from "./messages-content";
import { productMessages } from "./messages-products";
import { projectMessages } from "./messages-projects";
import { uiMessages } from "./messages-ui";
import { guideMessages } from "./messages-guides";
import { extraGuideMessages } from "./messages-guides-extra";
import { inquiryMessages } from "./messages-inquiry";

export const messages = { ...contentMessages, ...productMessages, ...projectMessages, ...guideMessages, ...extraGuideMessages, ...uiMessages, ...inquiryMessages };
