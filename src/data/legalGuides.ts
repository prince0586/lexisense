import { LegalTopicGuide } from '../types';

export const LEGAL_TOPIC_GUIDES: LegalTopicGuide[] = [
  {
    id: 'tenant-security-deposit',
    title: 'Tenant Security Deposit Recovery & Deductions',
    category: 'Housing',
    summary:
      'How to challenge unfair move-out deductions, demand itemized receipts, and understand statutory return deadlines in residential leases.',
    commonTraps: [
      'Landlords deducting "routine turn-over painting" or "carpet wear", which are legally classified as normal wear and tear in most jurisdictions.',
      'Failing to deliver an itemized written statement within the statutory timeframe (often 14 to 30 days depending on your state/municipality).',
      'Non-refundable cleaning fees buried in addendums that conflict with local tenant protection ordinances.',
    ],
    actionSteps: [
      'Assemble move-in and move-out condition inspection photos, video walk-throughs, and initial check-in checklists.',
      'Send a formal, certified Written Demand for Security Deposit Return specifying the exact move-out date and forwarding address.',
      'Request verifiable contractor invoices or materials receipts for any itemized deduction over $50.',
      'Remind the landlord of local statutory penalties (many jurisdictions award 2x or 3x treble damages for bad-faith retention).',
    ],
    sampleDocumentSnippet:
      'Tenant agrees that a refurbishment and turnover fee of $500 will be withheld from the deposit automatically upon surrender of keys.',
    letterTemplateTitle: 'Formal Security Deposit Demand Letter',
    letterTemplate: `[Date]

VIA CERTIFIED MAIL & EMAIL
To: [Landlord/Property Manager Name]
[Address / Property Management Company]

Re: Demand for Return of Security Deposit – [Rental Unit Address]
Lease Term Ended: [Move-Out Date]

Dear [Landlord/Property Manager],

I am writing to formally request the full return of my security deposit in the amount of $[Deposit Amount], provided for the premises at [Rental Unit Address], which I surrendered in clean condition on [Move-Out Date].

Under applicable landlord-tenant law, an itemized disposition statement and any remaining balance must be postmarked within [e.g., 21 days] of vacating. As of today, [Number of Days] days have elapsed without receipt of an accounting or deposit return.

Please be advised that normal wear and tear cannot be lawfully deducted. Please remit the refund of $[Deposit Amount] via check to my new forwarding address:

[Your New Address]
[Phone & Email]

If the full deposit is not received within ten (10) business days from receipt of this notice, I reserve the right to pursue all statutory remedies available, including small claims action and statutory bad-faith penalties.

Sincerely,
[Your Name]`,
    whenToConsultLawyer: [
      'If the withheld amount exceeds your jurisdiction’s small claims limit (usually $5,000–$10,000).',
      'If the landlord files a retaliatory collection claim or damages lawsuit against you.',
      'If you need representation in municipal housing court.',
    ],
  },
  {
    id: 'freelance-non-payment',
    title: 'Freelancer Unpaid Invoice & Late Payment Enforcement',
    category: 'Freelance',
    summary:
      'Steps for independent contractors and freelancers facing overdue invoices, client ghosting, or arbitrary withholding of fees.',
    commonTraps: [
      'Allowing clients to delay payment indefinitely without asserting the contract’s late payment interest clauses.',
      'Surrendering source code, high-resolution master assets, or copyright licenses before final payment clears.',
      'Agreeing to "Net 90" terms verbally when the initial contract specified Net 30 or payment upon delivery.',
    ],
    actionSteps: [
      'Audit the Master Services Agreement (MSA) or Statement of Work (SOW) for the formal acceptance clause and notice requirements.',
      'Issue a structured "Payment Past Due" formal notice referencing the invoice number, deliverables accepted, and interest accrual.',
      'Remind clients in relevant jurisdictions (such as New York Freelance Isn’t Free Act or similar laws) of statutory double damages and mandatory attorney fees for willful nonpayment.',
      'Withhold final deployment or revoke conditional license rights until payment is settled.',
    ],
    sampleDocumentSnippet:
      'Company shall remit payment within 90 days following final written executive committee sign-off, with right to hold back 20% for 6 months.',
    letterTemplateTitle: 'Past-Due Invoice Formal Demand Notice',
    letterTemplate: `[Date]

VIA EMAIL & CERTIFIED MAIL
To: [Client Representative / Accounts Payable]
[Company Name]
[Address]

Re: FINAL NOTICE: Overdue Payment for Invoice #[Invoice Number] – Services Rendered

Dear [Client Name / Accounts Payable],

This letter serves as formal notice that Invoice #[Invoice Number], issued on [Invoice Date] in the amount of $[Amount Due] for completed deliverables under our agreement, is now [Number] days past due.

All deliverables were submitted on [Date] and formally acknowledged/accepted on [Date]. Under Section [X] of our agreement, payment was due on [Due Date].

Please remit the balance of $[Amount Due] within seven (7) business days via wire transfer or ACH to:
Bank Name: [Bank]
Account Number: [Account]
Routing: [Routing]

Pursuant to the contract terms [and statutory freelance protection laws where applicable], failure to settle this account promptly may result in the assessment of late interest charges, suspension of all intellectual property licenses, and referral to legal counsel for collection.

Sincerely,
[Your Name / Business Name]`,
    whenToConsultLawyer: [
      'If the unpaid balance exceeds $10,000 or involves cross-border multi-state jurisdictional issues.',
      'If the client asserts a fraudulent counterclaim of defective work or breach of contract to justify withholding.',
      'If you need to draft and file a formal mechanics lien or court complaint.',
    ],
  },
  {
    id: 'employee-noncompete-severance',
    title: 'Non-Compete Agreements & Severance Rights',
    category: 'Workplace',
    summary:
      'Understanding the enforceability of post-employment restrictions, geographical scope, and negotiating severance agreements.',
    commonTraps: [
      'Assuming that signed non-competes are always 100% enforceable (many states like California, Minnesota, and New York have banned or severely curtailed them).',
      'Signing a general release of claims in a severance agreement without requesting the statutory 21 or 45-day review period.',
      'Overlooking non-solicitation clauses that can prohibit you from mentioning your new business to former colleagues.',
    ],
    actionSteps: [
      'Check the governing law clause in your agreement to determine which state’s employment laws apply.',
      'Examine whether the non-compete has reasonable boundaries in duration (typically 6-12 months max), geography, and specific line of business.',
      'Review whether you received adequate consideration (e.g., salary, specialized equity, or severance) in exchange for the restriction.',
      'Request a written clarification or waiver from the former employer for your specific proposed role.',
    ],
    sampleDocumentSnippet:
      'Employee shall not work for or advise any entity competing with any current or contemplated business of Employer nationwide for 24 months.',
    letterTemplateTitle: 'Request for Non-Compete Waiver / Scope Clarification',
    letterTemplate: `[Date]

To: [HR Director / General Counsel]
[Former Employer Company Name]
[Address]

Re: Clarification and Limited Waiver Request – Restrictive Covenant Agreement

Dear [Name / Legal Team],

In connection with my departure from [Company Name] effective [Date], I am writing to confirm our mutual understanding regarding the post-employment restrictive covenants in Section [X] of my employment agreement.

I have been presented with an opportunity to join [Prospective Company Name] in the role of [New Job Title]. The proposed duties will focus exclusively on [Describe Distinct Scope / Non-competing function], which does not overlap with [Former Company's] specific core products or client accounts that I managed.

To ensure transparency and prevent any ambiguity, I respectfully request written confirmation that [Former Company] does not object to my taking this position, or in the alternative, a limited written waiver tailored to this role.

I remain fully committed to honoring my ongoing confidentiality and non-disclosure obligations regarding proprietary trade secrets.

Thank you for your timely response.

Sincerely,
[Your Name]`,
    whenToConsultLawyer: [
      'Before signing any severance agreement waiving discrimination, harassment, or wage claims.',
      'If you receive a formal Cease and Desist letter from a former employer threatening litigation against you or your new employer.',
      'If you are transitioning to a direct competitor with equity or customer relationships.',
    ],
  },
];
