/**
 * Function/tool schemas the receptionist assistant calls during a live call
 * (referenced in ./receptionist-prompt.ts). These are attached to the Vapi
 * assistant; Vapi invokes them mid-call and routes them to our server, which
 * talks to Google Calendar (availability/booking) and n8n (messages/alerts).
 *
 * Shape follows the JSON-Schema "function" tool format used by Vapi / OpenAI.
 */

export interface FunctionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description: string; enum?: string[] }>;
      required: string[];
    };
  };
}

export const CHECK_AVAILABILITY: FunctionTool = {
  type: "function",
  function: {
    name: "check_availability",
    description:
      "Check the tenant's Google Calendar for open slots for a service on a given day. Returns the nearest available slot plus alternatives.",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "Preferred date in ISO 8601 (YYYY-MM-DD)." },
        service_type: { type: "string", description: "Service requested; must match the tenant's service list." },
      },
      required: ["date", "service_type"],
    },
  },
};

export const BOOK_APPOINTMENT: FunctionTool = {
  type: "function",
  function: {
    name: "book_appointment",
    description:
      "Create the appointment in Google Calendar and the appointments table, then trigger the confirmation SMS. Call only after a clear verbal 'yes'.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Caller's full name." },
        phone: { type: "string", description: "Callback number (E.164 if known)." },
        service: { type: "string", description: "Service to book." },
        datetime: { type: "string", description: "Confirmed slot in ISO 8601 (with timezone)." },
      },
      required: ["name", "phone", "service", "datetime"],
    },
  },
};

export const LOG_MESSAGE: FunctionTool = {
  type: "function",
  function: {
    name: "log_message",
    description:
      "Capture a lead/message when no booking happens (FAQ overflow, complaint, or human-callback request). Notifies the owner.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Caller's name." },
        phone: { type: "string", description: "Callback number." },
        note: { type: "string", description: "One-sentence summary of what they need." },
        priority: {
          type: "string",
          description: "Set to 'complaint' to flag for the owner with priority; otherwise omit.",
          enum: ["normal", "complaint"],
        },
      },
      required: ["name", "phone", "note"],
    },
  },
};

export const ESCALATE_EMERGENCY: FunctionTool = {
  type: "function",
  function: {
    name: "escalate_emergency",
    description:
      "Fire an immediate SMS + phone alert to the business owner for a genuine emergency. Bypasses the calendar entirely.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Caller's name." },
        phone: { type: "string", description: "Callback number." },
        address: { type: "string", description: "Service address, if relevant." },
        issue: { type: "string", description: "One-sentence description of the emergency." },
      },
      required: ["name", "phone", "issue"],
    },
  },
};

/** All tools attached to a tenant's Vapi assistant. */
export const RECEPTIONIST_TOOLS: FunctionTool[] = [
  CHECK_AVAILABILITY,
  BOOK_APPOINTMENT,
  LOG_MESSAGE,
  ESCALATE_EMERGENCY,
];
