import { useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import CheckInForm, { CheckInData } from "@/react-app/components/CheckInForm";
import MotivationalMessage from "@/react-app/components/MotivationalMessage";
import { MoodType } from "@/react-app/components/MoodSelector";
import { Leaf, Calendar } from "lucide-react";

export default function Dashboard() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedMood, setSubmittedMood] = useState<MoodType | null>(null);

  const handleSubmit = (data: CheckInData) => {
    console.log("Check-in submitted:", data);
    setSubmittedMood(data.mood);
    setSubmitted(true);
    // TODO: Save to database
  };

  const handleNewCheckIn = () => {
    setSubmitted(false);
    setSubmittedMood(null);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-br from-card to-accent/20 border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getGreeting()}! 👋
            </h2>
            <p className="text-muted-foreground">
              Take a moment to check in with yourself today.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
            <Leaf className="w-7 h-7" />
          </div>
        </div>
      </Card>

      {/* Check-in Form or Motivational Message */}
      <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        {submitted && submittedMood ? (
          <MotivationalMessage mood={submittedMood} onNewCheckIn={handleNewCheckIn} />
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Daily Check-In</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your responses are private and help you track your well-being over time.
              </p>
            </div>
            <CheckInForm onSubmit={handleSubmit} />
          </>
        )}
      </Card>
    </div>
  );
}
