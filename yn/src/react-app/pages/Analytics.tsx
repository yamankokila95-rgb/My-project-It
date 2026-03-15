import { Card } from "@/react-app/components/ui/card";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

export default function Analytics() {
  // Placeholder data - will be connected to database later
  const weekData = [
    { day: "Mon", mood: 4, label: "Good" },
    { day: "Tue", mood: 5, label: "Happy" },
    { day: "Wed", mood: 3, label: "Neutral" },
    { day: "Thu", mood: 2, label: "Sad" },
    { day: "Fri", mood: 3, label: "Neutral" },
    { day: "Sat", mood: 4, label: "Good" },
    { day: "Sun", mood: null, label: "—" },
  ];

  const moodColors: Record<number, string> = {
    1: "bg-rose-400",
    2: "bg-blue-400",
    3: "bg-amber-400",
    4: "bg-lime-400",
    5: "bg-emerald-400",
  };

  const moodLabels: Record<number, string> = {
    1: "Stressed",
    2: "Sad",
    3: "Neutral",
    4: "Good",
    5: "Happy",
  };

  const maxMood = 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mood Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your emotional patterns</p>
        </div>
      </div>

      {/* Weekly Mood Chart */}
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            This Week
          </h3>
          <span className="text-sm text-muted-foreground">Dec 9 - Dec 15</span>
        </div>

        {/* Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 mb-4">
          {weekData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full h-40 bg-muted/30 rounded-xl relative overflow-hidden">
                {item.mood ? (
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${moodColors[item.mood]} rounded-xl transition-all duration-500`}
                    style={{ height: `${(item.mood / maxMood) * 100}%` }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-2xl">—</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-border/50">
          {[5, 4, 3, 2, 1].map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${moodColors[level]}`} />
              <span className="text-xs text-muted-foreground">{moodLabels[level]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Good</p>
              <p className="text-xs text-muted-foreground">Average Mood</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground">Check-ins</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Insight Card */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/30 border-2 border-primary/20 rounded-2xl">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Weekly Insight</h4>
            <p className="text-sm text-muted-foreground">
              Your mood tends to be better earlier in the week. Consider planning relaxing activities 
              for mid-week to maintain your well-being!
            </p>
          </div>
        </div>
      </Card>

      <p className="text-xs text-center text-muted-foreground px-4">
        This visualization shows sample data. Connect your check-ins to see your real patterns!
      </p>
    </div>
  );
}
