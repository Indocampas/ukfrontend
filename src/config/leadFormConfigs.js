// src/config/leadFormConfigs.js
//
// Declarative field definitions for every lead-capture form on the site
// that is rendered through the shared <LeadFormModal />. Each key matches
// the exact string passed to openForm() from FormModalContext.
import {
  CURRENT_CLASS_OPTIONS,
  BOARD_OPTIONS,
  COURSE_INTEREST_OPTIONS,
  COUNSELLING_MODE_OPTIONS,
  HEAR_ABOUT_US_OPTIONS,
  TIME_SLOT_OPTIONS,
} from "./siteConfig";

// Field "type" values supported by the generic renderer in LeadFormModal:
// text | tel | email | date | time | select | textarea | file | checkbox

export const LEAD_FORM_CONFIGS = {
  "Apply Now": {
    heading: "Apply Now",
    subheading: "Fill in your details and our admissions team will reach out to you shortly.",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Student's full name" },
      { id: "mobile", label: "Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "parentName", label: "Parent/Guardian Name", type: "text", required: true, half: true, placeholder: "Parent/Guardian's name" },
      { id: "parentMobile", label: "Parent Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "email", label: "Email Address", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { id: "dob", label: "Date of Birth", type: "date", required: true, half: true },
      { id: "gender", label: "Gender", type: "select", required: true, half: true, options: ["Male", "Female", "Other"] },
      { id: "schoolName", label: "School Name", type: "text", required: true, half: true, placeholder: "Current school name" },
      { id: "currentClass", label: "Current Class", type: "select", required: true, half: true, options: CURRENT_CLASS_OPTIONS },
      { id: "board", label: "Board", type: "select", required: true, half: true, options: BOARD_OPTIONS },
      { id: "course", label: "Course Interested In", type: "select", required: true, half: true, options: COURSE_INTEREST_OPTIONS },
      { id: "preferredBatch", label: "Preferred Batch", type: "text", required: true, half: true, placeholder: "e.g. Morning / Evening" },
      { id: "city", label: "City", type: "text", required: true, half: true, placeholder: "Your city" },
      { id: "state", label: "State", type: "text", required: true, half: true, placeholder: "Your state" },
      { id: "hearAboutUs", label: "How did you hear about us?", type: "select", required: true, options: HEAR_ABOUT_US_OPTIONS },
      { id: "comments", label: "Additional Comments", type: "textarea", required: false, optionalLabel: true, placeholder: "Anything else you'd like us to know?" },
    ],
  },

  "Free Counselling": {
    heading: "Free Counselling",
    subheading: "Book a free one-on-one counselling session with our academic experts.",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Student's full name" },
      { id: "mobile", label: "Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "parentMobile", label: "Parent Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "email", label: "Email Address", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { id: "currentClass", label: "Current Class", type: "select", required: true, half: true, options: CURRENT_CLASS_OPTIONS },
      { id: "schoolName", label: "School Name", type: "text", required: true, half: true, placeholder: "Current school name" },
      { id: "board", label: "Board", type: "select", required: true, half: true, options: BOARD_OPTIONS },
      { id: "course", label: "Interested Course", type: "select", required: true, half: true, options: COURSE_INTEREST_OPTIONS },
      { id: "counsellingMode", label: "Preferred Counselling Mode", type: "select", required: true, half: true, options: COUNSELLING_MODE_OPTIONS },
      { id: "preferredDate", label: "Preferred Date", type: "date", required: true, half: true },
      { id: "preferredTime", label: "Preferred Time", type: "time", required: true, half: true },
      { id: "city", label: "City", type: "text", required: true, half: true, placeholder: "Your city" },
      { id: "message", label: "Questions/Message", type: "textarea", required: false, optionalLabel: true, placeholder: "Anything specific you'd like to ask?" },
    ],
  },

  "Scholarship Test": {
    heading: "Scholarship Test Registration",
    subheading: "Register for the UK Academy Scholarship Test and earn up to 100% tuition waiver.",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Student's full name" },
      { id: "mobile", label: "Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "parentMobile", label: "Parent Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "email", label: "Email Address", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { id: "dob", label: "Date of Birth", type: "date", required: true, half: true },
      { id: "gender", label: "Gender", type: "select", required: true, half: true, options: ["Male", "Female", "Other"] },
      { id: "schoolName", label: "School Name", type: "text", required: true, half: true, placeholder: "Current school name" },
      { id: "currentClass", label: "Current Class", type: "select", required: true, half: true, options: CURRENT_CLASS_OPTIONS },
      { id: "board", label: "Board", type: "select", required: true, half: true, options: BOARD_OPTIONS },
      { id: "lastExamPercentage", label: "Percentage/Marks in Last Examination", type: "text", required: true, half: true, placeholder: "e.g. 88%" },
      { id: "course", label: "Course Applying For", type: "select", required: true, half: true, options: COURSE_INTEREST_OPTIONS },
      { id: "preferredTestDate", label: "Preferred Test Date", type: "date", required: true, half: true },
      { id: "city", label: "City", type: "text", required: true, half: true, placeholder: "Your city" },
      { id: "agreeTerms", label: "I agree to the Terms & Conditions", type: "checkbox", required: true },
    ],
  },

  "Book Free Counselling": {
    heading: "Book Free Counselling",
    subheading: "Schedule a free counselling call at a time that works best for you.",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Student's full name" },
      { id: "mobile", label: "Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "parentMobile", label: "Parent Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "email", label: "Email Address", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { id: "currentClass", label: "Current Class", type: "select", required: true, half: true, options: CURRENT_CLASS_OPTIONS },
      { id: "course", label: "Course Interested In", type: "select", required: true, half: true, options: COURSE_INTEREST_OPTIONS },
      { id: "counsellingMode", label: "Preferred Counselling Mode", type: "select", required: true, half: true, options: COUNSELLING_MODE_OPTIONS },
      { id: "preferredDate", label: "Preferred Date", type: "date", required: true, half: true },
      { id: "preferredTimeSlot", label: "Preferred Time Slot", type: "select", required: true, half: true, options: TIME_SLOT_OPTIONS },
      { id: "city", label: "City", type: "text", required: true, half: true, placeholder: "Your city" },
      { id: "message", label: "Message", type: "textarea", required: false, optionalLabel: true, placeholder: "Anything specific you'd like us to know?" },
    ],
  },

  "Enquire Now": {
    heading: "Enquire Now",
    subheading: "Admissions are open! Share your details and our admissions team will get in touch with you shortly.",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Student's full name" },
      { id: "mobile", label: "Mobile Number", type: "tel", required: true, half: true, placeholder: "10-digit mobile number" },
      { id: "email", label: "Email Address", type: "email", required: true, half: true, placeholder: "you@example.com" },
      { id: "currentClass", label: "Current Class", type: "select", required: true, half: true, options: CURRENT_CLASS_OPTIONS },
      { id: "course", label: "Course Interested In", type: "select", required: true, half: true, options: COURSE_INTEREST_OPTIONS },
      { id: "city", label: "City", type: "text", required: true, half: true, placeholder: "Your city" },
      { id: "message", label: "Message", type: "textarea", required: false, optionalLabel: true, placeholder: "Anything specific you'd like us to know?" },
    ],
  },
};
