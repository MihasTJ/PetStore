"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTHS_PL = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

const WEEKDAYS_PL = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

function formatDisplayDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_PL[month - 1]} ${year}`;
}

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value = "",
  onChange,
  name,
  min,
  max,
  placeholder = "Wybierz datę",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value + "T12:00:00") : undefined;
  const fromDate = min ? new Date(min + "T00:00:00") : undefined;
  const toDate = max ? new Date(max + "T23:59:59") : undefined;

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    const iso = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    onChange?.(iso);
    setOpen(false);
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={value} readOnly />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full rounded-field border border-border-warm bg-card-warm px-4 py-3.5 text-base flex items-center justify-between gap-2 focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition cursor-pointer",
              value ? "text-ink" : "text-ink-subtle",
              className
            )}
          >
            <span>{value ? formatDisplayDate(value) : placeholder}</span>
            <CalendarIcon size={15} strokeWidth={1.5} className="text-ink-subtle shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-auto p-0 bg-card-warm border-border-warm rounded-card shadow-[0_4px_24px_rgba(42,42,40,0.10)]"
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={(date) =>
              (fromDate ? date < fromDate : false) ||
              (toDate ? date > toDate : false)
            }
            defaultMonth={selected ?? toDate ?? new Date()}
            captionLayout="dropdown"
            formatters={{
              formatMonthDropdown: (date) => MONTHS_PL[date.getMonth()],
              formatCaption: (date) =>
                `${MONTHS_PL[date.getMonth()]} ${date.getFullYear()}`,
              formatWeekdayName: (date) => WEEKDAYS_PL[date.getDay()],
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
