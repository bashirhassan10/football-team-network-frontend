import Link from "next/link";
import {redirect} from "next/navigation";
import {hasAdminSession} from "@/lib/admin-session";
import DeletionQueue from "./DeletionQueue";

export const metadata={title:"Account Deletion Management | NFN Admin",robots:{index:false,follow:false}};

export default async function AdminDeletionPage(){
 if(!(await hasAdminSession()))redirect("/admin/login");
 return <main className="shell" style={{maxWidth:920,padding:"40px 20px 80px",lineHeight:1.7}}>
  <Link href="/admin/verification">← Back to admin verification</Link>
  <h1>Account deletion management</h1>
  <p>Authorized NFN administrators only. Account deletion requests are recorded in the staging database and displayed in the review queue below. Support email notifications are also sent. <strong>Review approval does not delete account data.</strong></p>
  <DeletionQueue />
  <section style={{padding:24,border:"1px solid #dce6dd",borderRadius:16,background:"#fff"}}>
   <h2>Current request channel</h2>
   <p>Customers submit requests at <Link href="/account-deletion">Request account deletion</Link>. Check the support inbox for messages with the subject <strong>[NFN Support] Account Deletion</strong>.</p>
   <p><strong>Staging:</strong> test messages go to the staging support inbox. <strong>Production:</strong> the operator must confirm the live support mailbox and routing before launch.</p>
  </section>
  <section style={{marginTop:24,padding:24,border:"1px solid #dce6dd",borderRadius:16,background:"#fff"}}>
   <h2>Required handling steps</h2>
   <ol>
    <li>Record the date, registered team name and request in a restricted support register. Never publish these details in the team directory.</li>
    <li>Verify ownership using the registered email and an independent secure account-verification process. Do not trust the submitted email address alone.</li>
    <li>Review related team data, payment records, verification documents, match participation and applicable retention requirements.</li>
    <li>Only after verified authorization and approval, use the guarded Execute secure deletion action. This removes private team data while retaining necessary financial and shared match references.</li>
    <li>Confirm the outcome to the requester and document any legally justified retained records.</li>
   </ol>
   <p style={{background:"#fff4df",padding:14,borderRadius:8}}><strong>Safety notice:</strong> Secure deletion is implemented in staging and was tested against an approved staging test account. Production readiness still requires separate release checks. Never treat an incoming email as proof of ownership. Staging test requests marked DO NOT DELETE must not trigger account removal.</p>
  </section>
 </main>
}
