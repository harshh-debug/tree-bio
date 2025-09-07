import QRCodeGenerator from "@/modules/links/components/QRCodeGenerator";
import { getCurrentUsername } from "@/modules/profile/actions";
import { redirect } from "next/navigation";


export default async function QRCodePage() {
  const profile = await getCurrentUsername();
  
  if (!profile?.username) {
    redirect("/"); 
  }

  const username = profile.username;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground">
            Generate a QR code for your public profile link
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as: <span className="font-medium">@{username}</span>
          </p>
        </div>

        <QRCodeGenerator username={username} />
      </div>
    </div>
  );
}