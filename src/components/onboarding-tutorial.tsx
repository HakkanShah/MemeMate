
"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Grip, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tutorialSteps = [
  {
    elementId: "nav-action-button",
    title: "Welcome to MemeMate!",
    description: "This is your main navigation button. Click it to explore the app.",
    popoverAlign: "start",
    highlightClasses: "bottom-4 left-1/2 -translate-x-1/2",
  },
  {
    elementId: "nav-action-button-open",
    title: "Navigate The App",
    description: "From here you can access your Feed, Swipe for matches, Post memes, view Chats, and see your Profile.",
    popoverAlign: "center",
    highlightClasses: "bottom-4 left-1/2 -translate-x-1/2",
  },
  {
    elementId: "profile-settings-button",
    title: "Update Your Profile",
    description: "Click this settings icon on your profile page to update your bio, picture, and more.",
    popoverAlign: "end",
    highlightClasses: "top-4 right-4",
  },
];

interface OnboardingTutorialProps {
  onFinish: () => void;
}

export function OnboardingTutorial({ onFinish }: OnboardingTutorialProps) {
  const [step, setStep] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const currentStep = tutorialSteps[step];

  const handleNext = () => {
    if (step === 0) {
      setIsNavOpen(true);
    }
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "fixed w-16 h-16 rounded-full border-4 border-dashed border-primary ring-4 ring-primary ring-offset-4 ring-offset-background/80 animate-pulse",
              currentStep.highlightClasses
            )}
          >
            {/* This is just a placeholder for the trigger position */}
            {step === 0 && !isNavOpen && <div id="nav-action-button" />}
            {step === 1 && isNavOpen && <div id="nav-action-button-open" />}
            {step === 2 && <div id="profile-settings-button" />}
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align={currentStep.popoverAlign as any}
          className="z-[101] comic-border !border-4 max-w-sm"
        >
          <div className="space-y-2">
            <h3 className="font-headline text-2xl">{currentStep.title}</h3>
            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            <Button onClick={handleNext} className="w-full">
              {step === tutorialSteps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Render dummy elements for highlighting if they are not visible on the current page */}
        {step === 2 && (
             <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-10 comic-border !border-2 bg-card/80 backdrop-blur-sm pointer-events-none">
                <Settings />
            </Button>
        )}
        {(step === 0 || step === 1) && (
             <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
                <Button 
                    size="icon" 
                    className={cn(
                        "relative h-14 w-14 rounded-full comic-border !border-4 !shadow-none z-10 transition-transform duration-300 pointer-events-none",
                         isNavOpen && "rotate-45 bg-destructive text-destructive-foreground"
                    )}
                >
                  <Grip className={cn(!isNavOpen ? "opacity-100" : "opacity-0")} />
                </Button>
            </div>
        )}
    </div>
  );
}
