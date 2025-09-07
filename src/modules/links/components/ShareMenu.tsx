"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share,
  X,
  Copy,
  ListFilter,
  QrCode,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";

import { Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ShareMenu = ({ username }: { username: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullLink = `${origin}/${username}`;

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(fullLink);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    toast.success("Link copied to clipboard!");
  };

  const handleQRCodeClick = () => {
    router.push("/admin/tools/qr-code");
  };

  const handleShareTo = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s Linktree`,
          text: `Check out ${username}'s links!`,
          url: fullLink,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
          // Fallback to copying link
          handleCopy();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      // Try to open common social media sharing URLs
      handleSocialShare();
    }
  };

  const handleSocialShare = () => {
    const shareOptions = [
      {
        name: "Twitter",
        url: `https://twitter.com/intent/tweet?text=Check out my links!&url=${encodeURIComponent(fullLink)}`,
      },
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullLink)}`,
      },
      {
        name: "LinkedIn",
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullLink)}`,
      },
      {
        name: "WhatsApp",
        url: `https://wa.me/?text=Check out my links! ${encodeURIComponent(fullLink)}`,
      },
      {
        name: "Telegram",
        url: `https://t.me/share/url?url=${encodeURIComponent(fullLink)}&text=Check out my links!`,
      }
    ];

    // Create a temporary menu or modal for social sharing options
    // For now, we'll just copy the link and show options via toast
    const shareText = shareOptions
      .map(option => `${option.name}: ${option.url}`)
      .join('\n');
    
    // Copy link as fallback
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copied! You can now paste it on your preferred platform.", {
      description: "Tip: You can also share directly to social media platforms",
      duration: 3000,
    });
  };

  const handleOpenProfile = () => {
    window.open(fullLink, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="default">
          <Share className="h-4 w-4" /> Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenuLabel className="text-lg font-semibold">
            Share your Linktree
          </DropdownMenuLabel>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Get more visitors by sharing your Linktree everywhere.
        </p>
        <div className="flex w-full items-center space-x-2 mb-4">
          <Input type="text" value={fullLink} readOnly className="flex-1" />
          <Button type="button" onClick={handleCopy}>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Add to bio
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
            onClick={handleQRCodeClick}
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR code
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
            onClick={handleShareTo}
          >
            <Share className="mr-2 h-4 w-4" />
            Share to...
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
            onClick={handleOpenProfile}
          >
            <Globe className="mr-2 h-4 w-4" />
            Open
            <ExternalLink className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;