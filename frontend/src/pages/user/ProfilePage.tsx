
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { User, Lock, Settings, Camera, Loader2, Mail, Phone } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!currentUser && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsUpdating(false);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      toast.success("Password updated successfully!");
      setIsUpdating(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse mx-auto" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">View and update your personal information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="border-border/50 md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative mb-5 group">
                <Avatar className="h-28 w-28 rounded-2xl shadow-lg">
                  <AvatarImage src="https://github.com/shadcn.png" alt={currentUser?.name || "User"} className="rounded-2xl" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-white rounded-2xl font-bold">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-bold">{currentUser?.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{currentUser?.email}</p>
              <div className="mt-4 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Member since January 2023
              </div>

              <Separator className="my-5 opacity-50" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm truncate">{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Not set</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border-border/50 md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Account Settings</CardTitle>
              <CardDescription>Update your profile information and password</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="rounded-xl bg-muted/50 p-1 mb-6">
                  <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
                    <User className="w-4 h-4 mr-1.5" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
                    <Lock className="w-4 h-4 mr-1.5" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
                    <Settings className="w-4 h-4 mr-1.5" />
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={currentUser?.name}
                          placeholder="John Doe"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          defaultValue={currentUser?.email}
                          placeholder="john@example.com"
                          disabled
                          className="rounded-xl"
                        />
                        <p className="text-xs text-muted-foreground">
                          You cannot change your email address after registration.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="(555) 123-4567"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button type="submit" disabled={isUpdating} className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20">
                        {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Profile"}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="password">
                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div className="grid gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                        <Input id="current-password" name="current-password" type="password" placeholder="••••••••" className="rounded-xl" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                        <Input id="new-password" name="new-password" type="password" placeholder="••••••••" className="rounded-xl" />
                        <p className="text-xs text-muted-foreground">Must be at least 8 characters with letters, numbers, and symbols.</p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                        <Input id="confirm-password" name="confirm-password" type="password" placeholder="••••••••" className="rounded-xl" />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button type="submit" disabled={isUpdating} className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20">
                        {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Change Password"}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="preferences">
                  <div className="space-y-5">
                    {[
                      { id: "email-notifications", label: "Email Notifications", desc: "Receive email notifications about your interview preparation progress.", defaultChecked: true },
                      { id: "weekly-digest", label: "Weekly Digest", desc: "Receive a weekly summary of your activities and progress.", defaultChecked: false },
                      { id: "marketing-emails", label: "Marketing Emails", desc: "Receive emails about new features, tips, and special offers.", defaultChecked: true },
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-colors">
                        <input
                          type="checkbox"
                          id={pref.id}
                          className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-primary accent-primary"
                          defaultChecked={pref.defaultChecked}
                        />
                        <div>
                          <Label htmlFor={pref.id} className="font-medium">{pref.label}</Label>
                          <p className="text-sm text-muted-foreground mt-0.5">{pref.desc}</p>
                        </div>
                      </div>
                    ))}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20">
                        Save Preferences
                      </Button>
                    </motion.div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
