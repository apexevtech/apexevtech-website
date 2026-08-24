export type InquiryField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "country"
  | "message"
  | "context"
  | "privacyAccepted"
  | "website"
  | "formStartedAt";

export type InquirySubmission = {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  message: string;
  context: string;
  privacyAccepted: true;
};

export type InquiryFieldErrors = Partial<Record<InquiryField | "form", string>>;

export type InquiryParseResult =
  | { ok: true; isBot: true }
  | { ok: true; isBot: false; value: InquirySubmission }
  | { ok: false; fieldErrors: InquiryFieldErrors };

export type InquiryApiResponse =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "INVALID_REQUEST" | "VALIDATION_ERROR" | "EMAIL_NOT_CONFIGURED" | "EMAIL_DELIVERY_FAILED" | "RATE_LIMITED";
      message: string;
      fieldErrors?: InquiryFieldErrors;
    };
