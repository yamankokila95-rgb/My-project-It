import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { User, Mail, Calendar, CheckCircle2, LogOut, Shield } from "lucide-react";

export default function Profile() {
  // Placeholder data - will be connected to auth later
  const user = {
    name: "Alex Student",
    email: "alex@university.edu",
    joinedDate: "December 2024",
    totalCheckIns: 23,
    currentStreak: 5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">Your account details</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl text-white font-bold mb-4 shadow-lg shadow-primary/30">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
            <Mail className="w-4 h-4" />
            {user.email}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/30 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-primary mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{user.totalCheckIns}</p>
            <p className="text-xs text-muted-foreground">Total Check-ins</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{user.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member since
            </span>
            <span className="font-medium text-foreground">{user.joinedDate}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </Card>

      {/* Disclaimer */}
      <Card className="p-5 bg-muted/30 border-2 border-border/30 rounded-2xl">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">Privacy & Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              MindCare+ is designed for general wellness tracking and self-reflection. It is not 
              intended as a substitute for professional mental health diagnosis, treatment, or advice. 
              If you're experiencing mental health challenges, please reach out to a qualified 
              healthcare professional or counselor.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
