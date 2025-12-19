"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  generateDEK,
  deriveKEK,
  generateSalt,
  encryptDEK,
  decryptDEK,
} from "@/lib/crypto";
import { PinSetup } from "./PinSetup";
import { PinEntry } from "./PinEntry";

interface EncryptionContextType {
  dek: CryptoKey | null;
  isUnlocked: boolean;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(
  undefined
);

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error("useEncryption must be used within EncryptionProvider");
  }
  return context;
}

export function EncryptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dek, setDek] = useState<CryptoKey | null>(null);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkEncryptionStatus();
  }, []);

  const checkEncryptionStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("encrypted_dek, dek_salt, is_deleted")
      .eq("id", user.id)
      .single();

    if (profile?.is_deleted) {
      // Account is soft deleted
      await supabase.auth.signOut();
      window.location.href = "/";
      return;
    }

    if (!profile || !profile.encrypted_dek) {
      setNeedsSetup(true);
    } else {
      setNeedsSetup(false);
    }
  };

  const handlePinSetup = async (pin: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Generate new DEK and salt
    const newDEK = await generateDEK();
    const salt = generateSalt();

    // Derive KEK from PIN
    const kek = await deriveKEK(pin, salt);

    // Encrypt DEK with KEK
    const encryptedDEK = await encryptDEK(newDEK, kek);

    // Store in database
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      encrypted_dek: encryptedDEK,
      dek_salt: salt,
    });

    if (error) throw error;

    setDek(newDEK);
    setIsUnlocked(true);
    setNeedsSetup(false);
  };

  const handlePinUnlock = async (pin: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { data: profile } = await supabase
      .from("profiles")
      .select("encrypted_dek, dek_salt")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.encrypted_dek || !profile.dek_salt) {
      throw new Error("Profile not found");
    }

    // Derive KEK from PIN
    const kek = await deriveKEK(pin, profile.dek_salt);

    // Decrypt DEK
    const decryptedDEK = await decryptDEK(profile.encrypted_dek, kek);

    setDek(decryptedDEK);
    setIsUnlocked(true);
  };

  if (needsSetup === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (needsSetup) {
    return <PinSetup onComplete={handlePinSetup} />;
  }

  if (!isUnlocked) {
    return <PinEntry onUnlock={handlePinUnlock} />;
  }

  return (
    <EncryptionContext.Provider value={{ dek, isUnlocked }}>
      {children}
    </EncryptionContext.Provider>
  );
}
