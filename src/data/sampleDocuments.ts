export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'residential-lease',
    title: 'Residential Lease Agreement (12-Month)',
    category: 'Housing & Tenancy',
    badge: 'Contains Traps',
    description: 'A typical landlord-tenant apartment lease featuring sneaky automatic renewal clauses, mandatory binding arbitration, and broad damage deposit deductions.',
    content: `RESIDENTIAL LEASE AGREEMENT

PARTIES: This Agreement is entered into by and between Metro Heights Properties LLC ("Landlord") and Resident ("Tenant").

1. PREMISES AND TERM:
Landlord hereby leases to Tenant the premises located at Unit 4B, 742 Evergreen Terrace. The initial lease term commences on November 1, 2024 and terminates on October 31, 2025.

2. AUTOMATIC RENEWAL & NOTICE:
Upon expiration of the initial term, this Lease shall AUTOMATICALLY RENEW for a consecutive twelve (12) month term at a 10% rent escalation, unless Tenant delivers written notice of intent to vacate by certified registered mail no less than ninety (90) days prior to the expiration date. Verbal notice, email, or tenant portal messages shall not constitute valid notice.

3. RENT AND PENALTIES:
Tenant agrees to pay monthly rent of $2,450.00 due on the first calendar day of each month. A late fee of $150.00 shall be assessed if rent is not received by 11:59 PM on the 2nd day of the month, plus $25.00 per calendar day thereafter until paid in full.

4. SECURITY DEPOSIT AND NON-REFUNDABLE FORFEITURES:
Tenant shall deposit $3,675.00 as security deposit. Tenant acknowledges that a standard non-refundable refurbishment charge of $650.00 will be deducted regardless of apartment cleanliness or condition upon move-out. Landlord retains forty-five (45) business days after surrender of keys to return the remaining balance.

5. ENTRY AND INSPECTIONS:
Landlord and its designated maintenance contractors reserve the right to enter the premises at any time without prior written notice for general inspections, appraisal, repairs, or to show the premises to prospective purchasers or tenants.

6. MAINTENANCE, REPAIRS, AND APPLIANCES:
Tenant assumes all financial responsibility for plumbing stoppages, heating adjustments, and appliance maintenance exceeding $100.00 per occurrence. Landlord makes no warranty regarding air conditioning units or kitchen appliances.

7. INDEMNIFICATION AND LIMITATION OF LIABILITY:
Tenant agrees to indemnify, defend, and hold Landlord harmless against any and all claims, personal injury, theft, or water damage occurring on the premises, even if caused by Landlord's ordinary negligence. Tenant expressly waives all rights to file counterclaims or pursue class action litigation.

8. MANDATORY ARBITRATION AND JURISDICTION:
Any dispute or controversy arising under this Agreement shall be resolved exclusively through confidential binding arbitration administered by the Private Property Arbitration Association in New York, NY. Tenant waives all rights to jury trial and agrees to advance all initial arbitration administration fees.`,
  },
  {
    id: 'freelance-msa',
    title: 'Software Contractor Master Services Agreement',
    category: 'Freelance & Business',
    badge: 'One-Sided Terms',
    description: 'An independent contractor agreement with aggressive intellectual property assignment, unlimited personal indemnification, and extended 90-day payment cycles.',
    content: `MASTER SERVICES AGREEMENT FOR INDEPENDENT CONTRACTORS

This Master Services Agreement ("Agreement") is made effective as of January 15, 2025, between Global Enterprise Corp ("Company") and Independent Contractor ("Contractor").

1. SCOPE OF SERVICES & DELIVERABLES:
Contractor agrees to perform software engineering and architectural consulting as specified in Statements of Work (SOW). Company reserves the right to modify specifications and deadlines unilaterally upon written notice.

2. PAYMENT TERMS & HOLDBACK:
Contractor shall submit monthly itemized invoices. Company shall remit payment within ninety (90) calendar days after formal written approval of deliverables (Net 90). Company reserves the right to withhold up to 25% of any invoice total as a performance guarantee for a duration of six (6) months following project launch.

3. INTELLECTUAL PROPERTY & WORK FOR HIRE:
Contractor hereby irrevocably assigns, transfers, and conveys to Company all right, title, and interest throughout the universe in perpetuity to all code, algorithms, documentation, inventions, patents, trademarks, and concepts created, conceived, or reduced to practice during the term of this Agreement, whether developed on or off Company premises, including all Contractor Pre-Existing Tools and open-source libraries incorporated into any deliverable. Contractor waives all moral rights.

4. UNLIMITED INDEMNIFICATION:
Contractor shall defend, indemnify, and hold harmless Company, its officers, affiliates, and customers from and against any and all losses, damages, liabilities, and legal fees arising out of any third-party claim alleging intellectual property infringement, breach of confidentiality, or defects in software code, without monetary limitation.

5. NON-SOLICITATION AND EXCLUSIVITY:
During the term of this Agreement and for eighteen (18) months thereafter, Contractor shall not directly or indirectly provide consulting, software development, or related services to any entity operating in the enterprise SaaS domain, nor solicit any employee, contractor, or customer of Company.

6. TERMINATION FOR CONVENIENCE:
Company may terminate this Agreement or any SOW at any time with or without cause upon twenty-four (24) hours notice. Contractor may only terminate upon ninety (90) days advance written notice. Upon termination by Company, Contractor shall not be entitled to payment for work in progress not fully accepted in writing.`,
  },
  {
    id: 'employment-noncompete',
    title: 'Senior Employment Offer & Restrictive Covenants',
    category: 'Employment & Career',
    badge: 'Restrictive Covenants',
    description: 'Executive/Senior employment agreement containing a sweeping 2-year nationwide non-compete, vague discretionary incentive pay, and unilateral arbitration.',
    content: `EMPLOYMENT AGREEMENT & CONFIDENTIALITY COVENANT

This Employment Agreement is entered into between Apex Innovations Inc. ("Employer") and Candidate ("Employee").

1. POSITION AND DUTIES:
Employee is appointed Senior Director of Product. Employee shall devote 100% of productive time and undivided loyalty to Employer and shall not engage in any outside advisory, teaching, or volunteer activities without prior Board approval.

2. COMPENSATION AND DISCRETIONARY BONUS:
Base salary of $185,000 per annum. Employee may be eligible for an annual performance bonus of up to 30%, which remains at the absolute, unfettered discretion of Employer's Compensation Committee and is contingent upon Employee remaining actively employed on the payout date (April 30 of the following year).

3. AT-WILL EMPLOYMENT:
Employment is at-will. Employer may terminate Employee's employment at any time, for any or no reason, without advance notice and without severance compensation.

4. NON-COMPETITION COVENANT:
During employment and for a period of twenty-four (24) months following termination of employment for any reason (whether voluntary or involuntary):
Employee shall not, directly or indirectly, work for, consult with, invest in, advise, or assist any entity, product, or service that competes with any current or contemplated business line of Employer across the entire United States.

5. NON-SOLICITATION OF CLIENTS AND PERSONNEL:
For a period of twenty-four (24) months post-termination, Employee shall not solicit or transact business with any past, current, or prospective client of Employer, nor encourage any employee or vendor to terminate their relationship with Employer.

6. INVENTIONS ASSIGNMENT & REMOTE MONITORING:
All ideas, patentable discoveries, and trade secrets developed by Employee during the tenure of employment belong exclusively to Employer. Employee consents to continuous keylogging, screen recording, and automated webcam audit software on all personal devices used for company communication.

7. MANDATORY ARBITRATION & CLASS ACTION WAIVER:
Any employment dispute, including wage claims, harassment, or breach of contract, shall be settled exclusively via confidential individual arbitration. Class actions, collective actions, and private attorney general representative actions are strictly waived.`,
  },
  {
    id: 'privacy-terms-saas',
    title: 'Consumer Cloud Platform Terms of Service',
    category: 'Consumer & Digital',
    badge: 'Privacy & Data Rights',
    description: 'Digital service terms including unilateral modification rights, perpetual commercial licensing of user content, and complete liability disclaimers.',
    content: `SYNAPSE CLOUD PLATFORM TERMS OF SERVICE

Last Revised: October 2024

PLEASE READ CAREFULLY: BY ACCESSING OR USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS.

1. MODIFICATIONS TO TERMS:
Synapse reserves the right to modify or amend these Terms at any time without individual notification to users. Your continued use of the platform following the posting of modifications constitutes your binding acceptance of such revisions.

2. USER CONTENT LICENSE:
By uploading, transmitting, or creating any data, text, files, images, or audio ("User Content") on our platform, you grant Synapse a perpetual, irrevocable, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, modify, display, train machine learning algorithms on, commercialize, and distribute your User Content in any media formats now known or hereafter devised.

3. SUBSCRIPTION BILLING & CANCELLATION:
Subscriptions automatically renew at current retail rates unless canceled at least 7 business days prior to the billing cycle via phone call to our billing desk during operating hours (Mon-Wed 9am-12pm EST). No refunds or prorated credits will be provided for early terminations or unused periods.

4. DISCLAIMER OF ALL WARRANTIES:
THE SERVICE IS PROVIDED STRICTLY "AS IS" AND "AS AVAILABLE". SYNAPSE EXPRESSLY DISCLAIMS ALL WARRANTIES, STATUTORY OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT STORED FILES WILL NOT BE LOST OR CORRUPTED.

5. LIMITATION OF TOTAL LIABILITY:
UNDER NO CIRCUMSTANCES SHALL SYNAPSE'S AGGREGATE LIABILITY EXCEED THE LESSER OF $25.00 USD OR THE TOTAL FEES PAID BY YOU IN THE PRECEDING MONTH, REGARDLESS OF THE NATURE OF THE CLAIM OR GROSS NEGLIGENCE.

6. WAIVER OF CLASS RELIEF:
YOU AND SYNAPSE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.`,
  },
];

export const COMPARISON_PAIRS = [
  {
    id: 'nda-comparison',
    title: 'Standard Mutual NDA vs. Aggressive Vendor NDA',
    category: 'Non-Disclosure Agreements',
    docA: {
      title: 'Document A: Standard Mutual NDA (Balanced)',
      content: `MUTUAL NON-DISCLOSURE AGREEMENT (BALANCED)

1. PURPOSE: The parties wish to explore a potential business partnership regarding enterprise workflow software.

2. CONFIDENTIAL INFORMATION DEFINITION: Confidential Information means business and technical information marked as "Confidential" or which reasonably should be understood to be confidential given the circumstances of disclosure. It excludes information that is already public, independently developed, or rightfully received from third parties.

3. OBLIGATIONS: Each party agrees to use the same degree of care (at least reasonable care) to protect the other's confidential information as it uses for its own confidential data. Information shall only be disclosed to employees with a need to know under written confidentiality terms.

4. DURATION: The obligations of confidentiality shall remain in effect for a period of three (3) years from the date of disclosure.

5. REMEDIES & LIABILITY: Either party may seek injunctive relief in a court of competent jurisdiction to prevent unauthorized disclosure. Neither party shall be liable for indirect or consequential damages.

6. GOVERNING LAW: This Agreement shall be governed by the laws of the State of Delaware, with dispute resolution before the state or federal courts located therein.`,
    },
    docB: {
      title: 'Document B: Vendor One-Sided NDA (Aggressive)',
      content: `UNILATERAL NON-DISCLOSURE AGREEMENT (ONE-SIDED)

1. PURPOSE: Recipient wishes to evaluate Vendor's proprietary technologies.

2. ONE-WAY DISCLOSURE: Only information disclosed by Vendor shall be considered protected. Information disclosed by Recipient receives no confidentiality protections under this Agreement.

3. PERPETUAL SURVIVAL: Recipient's duty of confidentiality shall survive INDEFINITELY in perpetuity for all trade secrets, technical source code, and customer pricing lists without expiration.

4. STRICT NON-SOLICITATION & NON-COMPETE: Recipient agrees not to hire any employee of Vendor, nor develop any competing software, product, or feature within the same industrial sector for a period of five (5) years following execution.

5. LIQUIDATED DAMAGES & ATTORNEY FEES: In the event of any alleged breach by Recipient, Recipient agrees to pay liquidated damages of $250,000 per violation plus all of Vendor's full legal and investigation expenses. Vendor is exempt from proving actual damages.

6. JURISDICTION & VENUE: Exclusive venue shall be the courts of London, England under English Law, and Recipient waives all objections to jurisdiction or foreign process.`,
    },
  },
];
