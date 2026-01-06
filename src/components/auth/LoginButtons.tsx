"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GoogleIcon, MicrosoftIcon, FacebookIcon, XIcon, TikTokIcon } from "@/components/icons";

export function LoginButtons() {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => {
    if (!consentGiven) {
      setShowConsent(true);
    } else {
      router.push("/dashboard");
    }
  };

  const handleConsent = () => {
    setConsentGiven(true);
    setShowConsent(false);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Sign in to continue
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLoginClick}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLoginClick}
          >
            <MicrosoftIcon className="mr-2 h-5 w-5" />
            Sign in with Microsoft
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" onClick={handleLoginClick}><FacebookIcon className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" onClick={handleLoginClick}><XIcon className="h-5 w-5" /></Button>
            <Button variant="outline" size="icon" onClick={handleLoginClick}><TikTokIcon className="h-5 w-5" /></Button>
        </div>
        <p className="px-8 pt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <AlertDialog open={showConsent} onOpenChange={setShowConsent}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Data Usage Consent</AlertDialogTitle>
            <AlertDialogDescription>
              Aplikasi akan melakukan cache dan/atau menggunakan data customer untuk keperluan pengembangan produk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConsent}>
              Agree and Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
