import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/button";

const CustomAccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
        showButton?: boolean;
        buttonClassName?: string | undefined;
        buttonContent?: string | undefined;
    }
>(({ className, children, showButton, buttonClassName, buttonContent, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex items-center sticky top-[50px] z-20">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>div>svg]:rotate-180 relative",
                className
            )}
            {...props}
        >
            <div className="flex items-center sticky">
            <ChevronUp className="h-4 w-4 shrink-0 transition-transform rotate-90 duration-200 absolute -left-7"/>
                {children}
            </div>
        </AccordionPrimitive.Trigger>
        {showButton && <Button variant="ghost" className={buttonClassName}>{ buttonContent}</Button>}
        
    </AccordionPrimitive.Header>
));

export default CustomAccordionTrigger