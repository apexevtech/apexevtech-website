import { contentMessages } from "./messages-content";
import { productMessages } from "./messages-products";
import { projectMessages } from "./messages-projects";
import { projectBriefMessages } from "./messages-project-briefs";
import { uiMessages } from "./messages-ui";
import { guideMessages } from "./messages-guides";
import { extraGuideMessages } from "./messages-guides-extra";
import { inquiryMessages } from "./messages-inquiry";
import { metadataMessages } from "./messages-metadata";

export const messages = { ...contentMessages, ...productMessages, ...projectMessages, ...projectBriefMessages, ...guideMessages, ...extraGuideMessages, ...uiMessages, ...inquiryMessages, ...metadataMessages };
