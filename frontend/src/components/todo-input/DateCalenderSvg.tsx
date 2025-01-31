import React from 'react';
import { LucideProps } from 'lucide-react'; // Assuming you're using Lucide icons library

interface DateCalendarSvgProps extends Omit<LucideProps, 'ref'> {
  date: number;
}

const DateCalenderSvg = React.forwardRef<SVGSVGElement, DateCalendarSvgProps>(
  ({ date, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-calendar"
        ref={ref}
        {...props} // Spread the remaining props
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <text
          x="12" // Center the text horizontally
          y="19" // Position the text vertically
          textAnchor="middle" // Center the text
          fontSize="9" // Adjust the font size as needed
          fill="currentColor" // Ensure the text color matches the stroke color
          strokeWidth="0.5"
        >
          {date}
        </text>
      </svg>
    );
  }
);

export default DateCalenderSvg;
