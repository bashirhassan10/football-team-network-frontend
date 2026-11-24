import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Naija Football Network",
  description: "How Naija Football Network collects, uses, shares and protects personal information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="shell" style={{ maxWidth: 820, padding: "48px 20px 80px", lineHeight: 1.75 }}>
      <Link href="/">← Back to home</Link>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: 17 November 2026</strong></p>
      <p>Naija Football Network (NFN) is operated by <strong>Gambo Garba Karaye</strong> as an individual in Nigeria. NFN helps football clubs and academies register, complete verification, discover eligible opponents, arrange matches and communicate. This Privacy Policy explains how information is handled when you use NFN through its website or any related mobile application.</p>
      <h2>1. Who is responsible and how to contact us</h2>
      <p>Gambo Garba Karaye is the operator responsible for NFN. For privacy questions, requests to access, correct or delete information, or concerns about a child&apos;s information, contact <a href="mailto:support@naijafootballnetwork.com">support@naijafootballnetwork.com</a>. Please identify your team and the nature of your request without sending passwords or sensitive identity documents by ordinary email.</p>
      <h2>2. Information we collect</h2>
      <p><strong>Account and team details:</strong> team name, team type, football division, age category, contact person, email address, phone number, state, local government area, pitch name and location, and account credentials. Passwords should be handled as protected authentication data, not displayed to other teams.</p>
      <p><strong>Verification details:</strong> registration certificates or team declarations, coach appointment letters, and any supporting documents submitted for review. Older accounts may have submitted other verification documents under previous requirements.</p>
      <p><strong>Activity and communications:</strong> match requests, proposed dates and venues, fixtures, results, team-to-team chat messages, verification decisions, support communications, and account or security events.</p>
      <p><strong>Payment records:</strong> verification payment amount, status, reference and relevant transaction metadata. Card details entered at checkout are handled by Paystack, not collected through NFN&apos;s own registration forms.</p>
      <p><strong>Technical information:</strong> information needed to operate and secure the service, which may include IP address, browser or device details, session information and server logs. If you choose to use a location feature, NFN may process the location you provide or authorize for pitch mapping.</p>
      <h2>3. Why we use information</h2>
      <p>We use information to create and authenticate accounts; verify team eligibility; process and confirm payments; display eligible teams; arrange matches, fixtures and results; enable relevant team chats; send service and verification notifications; respond to support requests; prevent abuse and protect the platform; and meet applicable legal obligations.</p>
      <h2>4. Legal grounds and your choices</h2>
      <p>Depending on the activity and applicable Nigerian data protection law, processing may be necessary to provide the service you request, meet legal obligations, protect legitimate security and operational interests, or rely on consent where required. You can choose not to provide optional information, but some required information is necessary to register or verify a team. You may withdraw consent where consent is the applicable basis, without affecting earlier lawful processing.</p>
      <h2>5. What other teams can see</h2>
      <p>Signed-in teams may see eligible team profiles and relevant details such as team name, type, division, age category and pitch or match location. Match participants can see their match requests, fixtures and related conversations. Verification documents, passwords, private account credentials and payment secrets are not intended to be displayed in the team directory. Do not put sensitive personal information in team names, public profile fields or chat messages.</p>
      <h2>6. Service providers and sharing</h2>
      <p>NFN uses service providers for hosting, database infrastructure, file storage, email delivery and payment processing. These include Vercel, Render, Neon, Supabase, Resend and Paystack where configured for the service. Providers may process information to deliver their contracted functions. We may disclose information when required by applicable law, to address security or fraud, or with your direction. NFN does not sell personal information to advertisers.</p>
      <h2>Community safety information</h2><p>Community features may record the Terms version and acceptance time, blocked-team relationships, reports and their content snapshots, review notes, moderator actions and suspension status. These records support abuse prevention, review and appeals and are restricted to relevant account controls and authorized moderation staff. NFN must review their retention and account-deletion handling before production rollout.</p><h2>7. Storage, security and international processing</h2>
      <p>We use access controls and technical safeguards appropriate to the service, including restricted verification workflows. No system is completely secure. Some service providers may process or store information outside Nigeria; where applicable, NFN should use safeguards required by Nigerian data protection law for international transfers.</p>
      <h2>8. How long information is kept</h2>
      <p>Information is kept only for as long as reasonably needed for account operation, verification, match history, support, security, dispute resolution and applicable legal or financial recordkeeping. Different categories of information may require different periods. When information is no longer required, NFN will take appropriate steps to delete or de-identify it, subject to legal obligations and technical backup cycles. You may request information about retention relevant to your account using the contact address above.</p>
      <h2>9. Access, correction and account deletion requests</h2>
      <p>You may contact NFN to request access to your personal information, correction of inaccurate details, deletion of your account and associated personal information, or other rights available under applicable law. Email <a href="mailto:support@naijafootballnetwork.com?subject=NFN%20Account%20Deletion%20Request">support@naijafootballnetwork.com</a> with the subject &quot;NFN Account Deletion Request&quot; and the team name and registered email address. NFN may verify account ownership before acting. Some transaction, fraud-prevention or dispute records may need to be retained where legally justified. A request is not the same as immediate deletion; NFN will respond and explain the outcome or any lawful limitation.</p>
      <h2>10. Children and youth teams</h2>
      <p>NFN supports youth football categories but team accounts should be managed by authorized adults. Team administrators must have the necessary authority to provide information and should avoid uploading unnecessary personal information about children. Do not publish children&apos;s identity documents, personal contact details or sensitive information in profiles or chats. Contact NFN promptly if information about a child needs to be reviewed or removed.</p>
      <h2>11. Cookies and sessions</h2>
      <p>NFN may use cookies or similar browser storage needed for login sessions, security and core functionality. If optional analytics or advertising technologies are introduced, the relevant disclosures and choices will be updated as required.</p>
      <h2>12. Changes to this policy</h2>
      <p>We may update this policy when features, providers or legal requirements change. The date at the top shows the latest version. Material changes will be communicated through appropriate service channels where required.</p>
      <h2>13. Contact</h2>
      <p>Operator: <strong>Gambo Garba Karaye</strong> — Naija Football Network (NFN), Nigeria.<br />Privacy and support email: <a href="mailto:support@naijafootballnetwork.com">support@naijafootballnetwork.com</a>.</p>
    </main>
  );
}
