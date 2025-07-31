"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUser } from "@/lib/dummy-data";
import type { User } from "@/lib/types";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, LogOut, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  user: User;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    username: user.username,
    bio: user.bio,
    status: user.status,
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user.profilePicUrl);
  const [bannerPreview, setBannerPreview] = useState<string | null>(user.bannerUrl || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (imageType === 'profile') {
          setProfilePicPreview(result);
        } else {
          setBannerPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    const updatedUser: User = {
      ...user,
      ...formData,
      profilePicUrl: profilePicPreview || user.profilePicUrl,
      bannerUrl: bannerPreview || user.bannerUrl,
    };
    updateUser(updatedUser);
    toast({
      title: "Profile Updated!",
      description: "Your new look has been saved.",
    });
    setIsSheetOpen(false);
  };
  
  const handleLogout = () => {
    router.push('/');
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 comic-border !border-2 bg-card/80 backdrop-blur-sm">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className="comic-border !border-l-4">
        <SheetHeader>
          <SheetTitle className="font-headline text-3xl">Edit Your Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="profile-pic-upload">Profile Picture</Label>
            <label
              htmlFor="profile-pic-upload"
              className="relative flex items-center justify-center w-32 h-32 rounded-full cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors mx-auto"
            >
              {profilePicPreview ? (
                <Image src={profilePicPreview} alt="Profile preview" layout="fill" className="object-cover rounded-full" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </label>
            <Input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-upload">Banner Image</Label>
             <label
                htmlFor="banner-upload"
                className="flex items-center justify-center w-full h-32 rounded-md cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
            >
                {bannerPreview ? (
                    <Image src={bannerPreview} alt="Banner preview" layout="fill" className="object-cover rounded-md" />
                ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                )}
            </label>
            <Input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="comic-border !border-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="comic-border !border-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" name="status" value={formData.status} onChange={handleInputChange} className="comic-border !border-2" />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
          <Button onClick={handleSaveChanges} className="w-full comic-border !border-2">Save changes</Button>
          <Button variant="destructive" onClick={handleLogout} className="w-full comic-border !border-2">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
