import Link from "next/link";
export const metadata = { title: "Request Account Deletion | Naija Football Network", description: "How to request deletion of your Naija Football Network account and associated personal data." };
export default function AccountDeletion() {
 return <main className="shell" style={{maxWidth:820,padding:"48px 20px 80px",lineHeight:1.75}}>
 <Link href="/">← Back to home</Link>
 <h1>Request account deletion</h1>
 <p>Naija Football Network (NFN), operated by Gambo Garba Karaye, provides this public page for account and personal data deletion requests. You do not need to sign in to read these instructions or send a request.</p>
 <h2>How to request deletion</h2>
 <p>Send an email to <a href="mailto:support@naijafootballnetwork.com?subject=NFN%20Account%20Deletion%20Request">support@naijafootballnetwork.com</a> with the subject <strong>NFN Account Deletion Request</strong>. Include your registered team name and registered email address. Do not send passwords, payment card information or identity documents in the initial email.</p>
 <p><a className="button" href="mailto:support@naijafootballnetwork.com?subject=NFN%20Account%20Deletion%20Request">Email an account deletion request</a></p>
 <h2>What happens next?</h2>
 <p>NFN will review your request, verify that you are authorized to act for the account and explain the deletion process. NFN may ask for additional verification through a suitable secure channel before changing or deleting account data.</p>
 <h2>What information is covered?</h2>
 <p>A request may cover your team account and associated personal data, including contact details, verification submissions and related account information. Match and chat records involving other teams may require separate review to protect other participants and resolve disputes.</p>
 <h2>Information that may be retained</h2>
 <p>Some payment records, security records or dispute-related information may need to be retained where required or justified by applicable law. NFN will explain any relevant limitations when responding to your request. Data in backups may remain temporarily until normal backup expiry or deletion processes apply.</p>
 <p>For details about data handling and your rights, read the <Link href="/privacy-policy">Privacy Policy</Link>.</p>
 <h2>Contact</h2><p>Operator: Gambo Garba Karaye — Naija Football Network, Nigeria.<br/>Email: <a href="mailto:support@naijafootballnetwork.com">support@naijafootballnetwork.com</a>.</p>
 </main>;
}