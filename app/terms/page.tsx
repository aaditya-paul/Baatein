import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: December 2025
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Baatein, you accept and agree to be bound by
            the terms and provisions of this agreement.
          </p>

          <h2>Description of Service</h2>
          <p>
            Baatein is a private, encrypted journaling application. We provide:
          </p>
          <ul>
            <li>End-to-end encrypted journal storage</li>
            <li>Rich text editing capabilities</li>
            <li>Secure authentication via Google OAuth</li>
          </ul>

          <h2>User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your PIN</li>
            <li>All activities that occur under your account</li>
            <li>The content you create and store</li>
            <li>Backing up your PIN in a secure location</li>
          </ul>

          <h2>Data Loss Disclaimer</h2>
          <p className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <strong>IMPORTANT:</strong> If you lose your PIN, we cannot recover
            your encrypted journal entries. We recommend storing your PIN
            securely. You acknowledge that data loss due to forgotten PINs is
            not our responsibility.
          </p>

          <h2>Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Use the service for any illegal purposes</li>
            <li>Attempt to breach security or authentication measures</li>
            <li>Interfere with other users' access to the service</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>

          <h2>Service Availability</h2>
          <p>
            We strive to maintain high availability but do not guarantee
            uninterrupted access. We reserve the right to modify, suspend, or
            discontinue the service at any time.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Baatein application, including its design, features, and
            functionality, is owned by us and protected by copyright and other
            intellectual property laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Baatein is provided "as is" without warranties of any kind. We are
            not liable for any data loss, service interruptions, or damages
            resulting from your use of the service.
          </p>

          <h2>Termination</h2>
          <p>
            You may terminate your account at any time through the profile page.
            We reserve the right to terminate accounts that violate these terms.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may revise these terms at any time. Continued use of the service
            after changes constitutes acceptance of the revised terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us
            through our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
}
