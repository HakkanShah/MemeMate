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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    gender: user.gender,
    relationshipStatus: user.relationshipStatus,
    lookingFor: user.lookingFor,
    status: user.status
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user.profilePicUrl);
  const [bannerPreview, setBannerPreview] = useState<string | null>(user.bannerUrl || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

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
      <SheetContent className="comic-border !border-l-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline text-3xl">Edit Your Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="profile-pic-upload" className="text-center block">Profile Picture</Label>
            <label
              htmlFor="profile-pic-upload"
              className="relative flex items-center justify-center w-32 h-32 rounded-full cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors mx-auto comic-border !border-2 overflow-hidden"
            >
              {profilePicPreview ? (
                <Image src={profilePicPreview} alt="Profile preview" layout="fill" className="object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </label>
            <Input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-upload" className="text-center block">Banner Image</Label>
             <label
                htmlFor="banner-upload"
                className="flex items-center justify-center w-full h-32 rounded-md cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors comic-border !border-2 overflow-hidden"
            >
                {bannerPreview ? (
                    <Image src={bannerPreview} alt="Banner preview" layout="fill" className="object-cover" />
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
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="comic-border !border-2" placeholder="Male, Female, Non-binary..."/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="relationshipStatus">Relationship Status</Label>
             <Select onValueChange={(value) => handleSelectChange('relationshipStatus', value)} defaultValue={formData.relationshipStatus}>
                <SelectTrigger className="comic-border !border-2">
                    <SelectValue placeholder="Select your status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Single AF">Single AF</SelectItem>
                    <SelectItem value="Meme-ing Around">Meme-ing Around</SelectItem>
                    <SelectItem value="Taken But Still Posting">Taken But Still Posting</SelectItem>
                    <SelectItem value="It's Complicated">It's Complicated</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="lookingFor">Looking For</Label>
            <Input id="lookingFor" name="lookingFor" value={formData.lookingFor} onChange={handleInputChange} className="comic-border !border-2" placeholder="My meme-mate..." />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 mt-4">
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
