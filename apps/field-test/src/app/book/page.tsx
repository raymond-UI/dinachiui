import type { Metadata } from "next";
import { BookingForm } from "@/components/book/booking-form";

export const metadata: Metadata = { title: "New booking" };

export default function BookPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 id="book-title" className="text-xl font-semibold">New booking</h1>
      <BookingForm />
    </div>
  );
}
