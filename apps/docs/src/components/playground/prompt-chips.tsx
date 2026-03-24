"use client";

import { motion } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PromptItem {
  title: string;
  prompt: string;
}

interface PromptCategory {
  label: string;
  icon: LucideIcon;
  prompts: PromptItem[];
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    label: "Dashboards",
    icon: LayoutDashboard,
    prompts: [
      {
        title: "Analytics overview",
        prompt:
          "An analytics dashboard showing key metrics: total users, monthly revenue, and active projects. Each metric should display a large number with a percentage change indicator. Below the metrics, show a recent activity feed with 4 collapsible entries showing what happened and when.",
      },
      {
        title: "Project tracker",
        prompt:
          "A project management overview. At the top show the project name and a status indicator. Display overall completion as a percentage bar. Below, show a scrollable list of 6 tasks with their status, assignee avatar and initials, and due dates. Include a button to add a new task that shows a confirmation toast.",
      },
    ],
  },
  {
    label: "Forms",
    icon: FileText,
    prompts: [
      {
        title: "Contact form",
        prompt:
          "A contact form with fields for full name, email address, a dropdown to select the inquiry type (General, Support, Sales, Partnership), and a large message area. Group the personal info fields together and the message separately. Include a cancel and send button at the bottom. Show a success toast when submitted.",
      },
      {
        title: "Event registration",
        prompt:
          "An event registration form. Collect the attendee's name, email, phone number, and number of guests (with increment/decrement control, max 5). Let them pick a session time from a dropdown. Add a terms and conditions agreement toggle. Group fields into 'Personal Details' and 'Event Preferences' sections. Show a confirmation toast on submit.",
      },
      {
        title: "Survey",
        prompt:
          "A customer satisfaction survey. Start with a heading and short description. Ask the user to rate their experience from 1-10 using a slider. Then ask how they heard about us with radio options (Social Media, Friend, Search Engine, Advertisement). Add a text area for additional comments. Finish with a submit button.",
      },
    ],
  },
  {
    label: "Profiles",
    icon: User,
    prompts: [
      {
        title: "User profile",
        prompt:
          "A user profile page for 'Alex Chen'. Show their avatar with initials 'AC', their name as a heading, job title 'Senior Designer' with a role indicator, and a short bio paragraph. Display stats in a row: 142 Projects, 38 Followers, 12 Awards. Include 'Edit Profile' and 'Share' action buttons at the bottom.",
      },
      {
        title: "Team directory",
        prompt:
          "A team directory showing 4 team members in a grid layout. Each person should have their avatar with initials, name, department, and a status indicator showing if they're online or away. Include a 'View Profile' link for each person. Add a heading 'Our Team' at the top with a short description.",
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    prompts: [
      {
        title: "App preferences",
        prompt:
          "An application settings page. Have two sections: 'Notifications' with on/off toggles for email notifications, push notifications, and marketing updates; and 'Preferences' with a language dropdown (English, Spanish, French, Japanese), a theme selector to switch between light/dark/system views, and a font size slider from 12 to 24. Include a save button that shows a toast.",
      },
      {
        title: "Account settings",
        prompt:
          "Account settings organized into tabs: Profile, Security, and Billing. The Profile tab should have fields for display name and email with a save button. The Security tab should have a toggle for two-factor authentication and a change password button. The Billing tab should show the current plan with a status indicator and an upgrade button.",
      },
    ],
  },
  {
    label: "Commerce",
    icon: CreditCard,
    prompts: [
      {
        title: "Pricing plans",
        prompt:
          "A pricing page with three plan tiers side by side: Free ($0/mo), Pro ($19/mo), and Enterprise ($49/mo). Each plan should list 3-4 features as text items. The Pro plan should have a 'Popular' indicator. Each plan has a 'Get Started' button — the Pro plan button should be visually emphasized. Add a heading and subtitle at the top.",
      },
      {
        title: "Checkout summary",
        prompt:
          "An order checkout summary showing 3 line items with name and price, a divider, then subtotal, tax, and total. Below the totals, add a quantity adjuster for the first item. Include a promo code text field with an 'Apply' button. At the bottom have a 'Complete Purchase' button and a 'Continue Shopping' link-style button.",
      },
    ],
  },
  {
    label: "Content",
    icon: MessageSquare,
    prompts: [
      {
        title: "FAQ page",
        prompt:
          "A frequently asked questions page with a heading, a short intro paragraph, and 5 expandable Q&A entries. Questions should cover: what the product does, pricing, free trial availability, data security, and how to cancel. Below the FAQ, add a help text with a popover that shows contact information when clicked.",
      },
      {
        title: "Feedback form",
        prompt:
          "A user feedback form. Start with a heading and description. Let the user rate their experience from 1 to 10 with a slider. Ask what area their feedback is about using radio options: UI Design, Performance, Features, Documentation. Add a detailed comments text area. Include a toggle for 'Contact me about this feedback'. End with submit and cancel buttons.",
      },
      {
        title: "Release notes",
        prompt:
          "A release notes page for version 2.4. Show a heading with the version number and a release date. List 3 sections of changes as collapsible groups: 'New Features' (3 items), 'Improvements' (2 items), and 'Bug Fixes' (2 items). Each item should have a category indicator and a description. Add a 'View all releases' link at the bottom.",
      },
    ],
  },
];

interface PromptChipsProps {
  onSelect: (prompt: string) => void;
}

export function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="w-full space-y-4">
      {PROMPT_CATEGORIES.map((category, catIdx) => {
        const Icon = category.icon;
        return (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: catIdx * 0.07,
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <div className="mb-1.5 flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                {category.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.prompts.map((item) => (
                <motion.button
                  key={item.title}
                  onClick={() => onSelect(item.prompt)}
                  className="cursor-pointer rounded-lg border border-border/60 bg-card px-3 py-1.5 text-left text-xs text-muted-foreground transition-all duration-200 hover:border-border hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
