import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary/50 mb-6"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold font-outfit mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2025
          </p>

          <h2>Introduction</h2>
          <p>
            Baatein ("we", "our", or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we handle your information
            when you use our journal application.
          </p>

          <h2>End-to-End Encryption</h2>
          <p>
            Your journal entries are encrypted on your device before being sent
            to our servers. We use client-side encryption with AES-GCM, which
            means:
          </p>
          <ul>
            <li>
              Your journal content is encrypted with a key derived from your PIN
            </li>
            <li>We cannot read your journal entries, even if we wanted to</li>
            <li>Your encryption key never leaves your device</li>
            <li>If you lose your PIN, we cannot recover your data</li>
          </ul>

          <h2>Information We Collect</h2>
          <p>Through Google OAuth authentication, we collect:</p>
          <ul>
            <li>Your name and email address</li>
            <li>Your Google profile picture (if available)</li>
            <li>A unique user identifier</li>
          </ul>
          <p>We also store:</p>
          <ul>
            <li>Your encrypted journal entries</li>
            <li>Your encrypted encryption key (protected by your PIN)</li>
            <li>Account metadata (creation date, last updated)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your information solely to:</p>
          <ul>
            <li>Provide and maintain the journaling service</li>
            <li>Authenticate your identity</li>
            <li>Display your profile information</li>
          </ul>

          <h2>Data Storage</h2>
          <p>
            Your data is stored securely using Supabase (PostgreSQL database).
            All journal content is encrypted before storage. We implement Row
            Level Security (RLS) policies to ensure you can only access your own
            data.
          </p>

          <h2>Account Deletion</h2>
          <p>
            You can request account deletion from your profile page. When you
            delete your account:
          </p>
          <ul>
            <li>Your account is marked as deleted in our system</li>
            <li>You will be signed out and unable to sign back in</li>
            <li>
              Your encrypted data remains in the database but is inaccessible
            </li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>
              <strong>Google OAuth:</strong> For authentication
            </li>
            <li>
              <strong>Supabase:</strong> For database and authentication
              infrastructure
            </li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us through our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
}
