/**
 * Client-safe re-exports. Server chat logic lives in cafe-knowledge.ts and
 * /api/chat — use those for production replies.
 */
export {
  getLocalChatReply as getMockChatReply,
  getAnswerForIntent,
  scoreIntent,
  type CafeIntent,
  type ChatReply,
} from "./cafe-knowledge";