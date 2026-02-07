const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const templates = [
  // ============================================================================
  // WELCOME LETTER
  // ============================================================================
  {
    name: 'Investor Welcome Letter',
    description: 'Welcome letter sent to new investors upon commitment',
    category: 'WELCOME_LETTER',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{investor_email}}',
      '{{investment_amount}}',
      '{{project_name}}',
      '{{company_name}}',
      '{{company_address}}',
      '{{company_phone}}',
      '{{company_email}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px;">
    <h1 style="color: #2d5a3d; margin: 0; font-size: 28px;">Lane County Housing Development</h1>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Building Communities, Creating Value</p>
  </div>

  <p style="text-align: right; color: #666;">{{date}}</p>

  <p style="margin-top: 30px;">Dear {{investor_name}},</p>

  <p>On behalf of the entire team at <strong>{{company_name}}</strong>, I want to personally welcome you as an investor in <strong>{{project_name}}</strong>. We are thrilled to have you join our growing community of investors who share our vision for creating quality housing in Lane County, Oregon.</p>

  <p>Your investment commitment of <strong>{{investment_amount}}</strong> represents more than just a financial transaction—it's a partnership built on trust, transparency, and shared goals. We take this responsibility seriously and are committed to delivering exceptional returns while maintaining the highest standards of integrity.</p>

  <h2 style="color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px;">What Happens Next</h2>

  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>Documentation:</strong> You will receive your complete investor packet within 5 business days, including your executed Subscription Agreement and Operating Agreement.</li>
    <li style="margin-bottom: 10px;"><strong>Funding Instructions:</strong> Wire transfer instructions will be sent separately via secure email.</li>
    <li style="margin-bottom: 10px;"><strong>Portal Access:</strong> You will receive credentials to access our Investor Portal where you can track project progress, view documents, and monitor your investment.</li>
    <li style="margin-bottom: 10px;"><strong>Quarterly Updates:</strong> Expect detailed project updates every quarter, including construction progress, financial summaries, and market analysis.</li>
  </ol>

  <h2 style="color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px;">Our Commitment to You</h2>

  <p>We believe in complete transparency. You will always have access to:</p>
  <ul style="padding-left: 20px;">
    <li>Real-time project updates and photography</li>
    <li>Monthly financial reports</li>
    <li>Direct communication with our management team</li>
    <li>All legal and tax documents related to your investment</li>
  </ul>

  <p style="margin-top: 30px;">If you have any questions or need assistance at any point, please don't hesitate to reach out. We're here to ensure your investment experience is seamless and rewarding.</p>

  <p>Once again, welcome to the {{company_name}} family. We look forward to a successful partnership.</p>

  <div style="margin-top: 40px;">
    <p style="margin-bottom: 5px;">Warm regards,</p>
    <p style="margin: 0; font-weight: bold; color: #2d5a3d;">Lane County Housing Development Team</p>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">{{company_address}}</p>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">{{company_phone}} | {{company_email}}</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // OPERATING AGREEMENT
  // ============================================================================
  {
    name: 'LLC Operating Agreement',
    description: 'Standard operating agreement for project LLCs',
    category: 'OPERATING_AGREEMENT',
    variables: JSON.stringify([
      '{{llc_name}}',
      '{{project_name}}',
      '{{project_address}}',
      '{{formation_date}}',
      '{{state_of_formation}}',
      '{{manager_name}}',
      '{{manager_address}}',
      '{{total_capital}}',
      '{{minimum_investment}}',
      '{{preferred_return}}',
      '{{profit_split_investor}}',
      '{{profit_split_manager}}',
      '{{investor_name}}',
      '{{investor_address}}',
      '{{investment_amount}}',
      '{{membership_percentage}}',
      '{{effective_date}}'
    ]),
    content: `
<div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 40px; line-height: 1.6; font-size: 12pt;">
  <h1 style="text-align: center; font-size: 18pt; margin-bottom: 5px;">OPERATING AGREEMENT</h1>
  <h2 style="text-align: center; font-size: 14pt; font-weight: normal; margin-top: 0;">OF</h2>
  <h2 style="text-align: center; font-size: 16pt; margin-bottom: 30px;">{{llc_name}}</h2>
  <p style="text-align: center; margin-bottom: 30px;">A {{state_of_formation}} Limited Liability Company</p>

  <p style="text-align: center; margin-bottom: 40px;"><strong>Effective Date: {{effective_date}}</strong></p>

  <h3 style="margin-top: 30px;">ARTICLE I - FORMATION AND NAME</h3>
  
  <p><strong>1.1 Formation.</strong> {{llc_name}} (the "Company") was formed as a limited liability company under the laws of the State of {{state_of_formation}} on {{formation_date}}.</p>
  
  <p><strong>1.2 Name.</strong> The name of the Company is {{llc_name}}. The Company may conduct business under that name or any other name approved by the Manager.</p>
  
  <p><strong>1.3 Purpose.</strong> The Company is formed for the purpose of acquiring, developing, and managing the real property located at {{project_address}} (the "Project"), known as {{project_name}}, and any lawful business related thereto.</p>

  <p><strong>1.4 Principal Office.</strong> The principal office of the Company shall be located at {{manager_address}}, or such other place as the Manager may designate.</p>

  <h3 style="margin-top: 30px;">ARTICLE II - MEMBERS AND CAPITAL CONTRIBUTIONS</h3>

  <p><strong>2.1 Members.</strong> The Members of the Company and their respective Capital Contributions and Membership Interests are set forth in Exhibit A attached hereto.</p>

  <p><strong>2.2 Capital Contributions.</strong> Each Member shall contribute to the capital of the Company the amount set forth opposite such Member's name in Exhibit A. The total capital to be raised is {{total_capital}}, with a minimum investment of {{minimum_investment}} per investor.</p>

  <p><strong>2.3 No Additional Contributions.</strong> No Member shall be required to make any additional capital contribution to the Company.</p>

  <p><strong>2.4 Capital Accounts.</strong> A separate capital account shall be maintained for each Member in accordance with Treasury Regulation Section 1.704-1(b)(2)(iv).</p>

  <h3 style="margin-top: 30px;">ARTICLE III - ALLOCATIONS AND DISTRIBUTIONS</h3>

  <p><strong>3.1 Preferred Return.</strong> Members shall receive a preferred return of {{preferred_return}} per annum on their unreturned capital contributions, compounded annually, before any profit distributions to the Manager.</p>

  <p><strong>3.2 Profit Distribution Waterfall.</strong> After payment of the Preferred Return, Net Profits shall be distributed as follows:</p>
  <ol style="margin-left: 20px;">
    <li>First, 100% to Members until they have received a return of their capital contributions;</li>
    <li>Thereafter, {{profit_split_investor}}% to Members (pro rata based on Membership Interests) and {{profit_split_manager}}% to the Manager as a promote.</li>
  </ol>

  <p><strong>3.3 Timing of Distributions.</strong> Distributions shall be made at such times and in such amounts as determined by the Manager, but no less frequently than annually, subject to reasonable reserves for Company operations and obligations.</p>

  <h3 style="margin-top: 30px;">ARTICLE IV - MANAGEMENT</h3>

  <p><strong>4.1 Manager.</strong> The Company shall be managed by {{manager_name}} (the "Manager"). The Manager shall have full and complete authority to manage the business and affairs of the Company.</p>

  <p><strong>4.2 Powers of Manager.</strong> The Manager shall have the power to:</p>
  <ul style="margin-left: 20px;">
    <li>Acquire, develop, and dispose of property on behalf of the Company;</li>
    <li>Enter into contracts and agreements;</li>
    <li>Borrow money and encumber Company property;</li>
    <li>Hire employees, contractors, and professional advisors;</li>
    <li>Make all decisions regarding the day-to-day operations of the Company.</li>
  </ul>

  <p><strong>4.3 Major Decisions.</strong> The following actions shall require the approval of Members holding a majority of Membership Interests:</p>
  <ul style="margin-left: 20px;">
    <li>Sale or refinancing of the Project;</li>
    <li>Dissolution of the Company;</li>
    <li>Amendment of this Agreement;</li>
    <li>Admission of new Members.</li>
  </ul>

  <h3 style="margin-top: 30px;">ARTICLE V - TRANSFER OF INTERESTS</h3>

  <p><strong>5.1 Restrictions on Transfer.</strong> No Member may transfer, sell, assign, or encumber all or any portion of their Membership Interest without the prior written consent of the Manager.</p>

  <p><strong>5.2 Right of First Refusal.</strong> Before any transfer, the Company and other Members shall have a right of first refusal to purchase the transferring Member's interest on the same terms.</p>

  <h3 style="margin-top: 30px;">ARTICLE VI - DISSOLUTION</h3>

  <p><strong>6.1 Events of Dissolution.</strong> The Company shall be dissolved upon: (a) the sale or disposition of all Company assets; (b) the unanimous written consent of all Members; or (c) any event required by law.</p>

  <p><strong>6.2 Winding Up.</strong> Upon dissolution, the Manager shall wind up the Company's affairs, liquidate assets, pay debts, and distribute remaining assets to Members in accordance with their capital accounts.</p>

  <h3 style="margin-top: 30px;">ARTICLE VII - MISCELLANEOUS</h3>

  <p><strong>7.1 Governing Law.</strong> This Agreement shall be governed by the laws of the State of {{state_of_formation}}.</p>

  <p><strong>7.2 Entire Agreement.</strong> This Agreement constitutes the entire agreement among the parties and supersedes all prior agreements and understandings.</p>

  <p><strong>7.3 Amendments.</strong> This Agreement may be amended only by written instrument signed by the Manager and Members holding a majority of Membership Interests.</p>

  <div style="margin-top: 50px; page-break-before: always;">
    <h3>EXHIBIT A - MEMBERS</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr style="background: #f5f5f5;">
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Member Name</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Address</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Capital Contribution</th>
        <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Membership %</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 10px;">{{investor_name}}</td>
        <td style="border: 1px solid #ddd; padding: 10px;">{{investor_address}}</td>
        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">{{investment_amount}}</td>
        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">{{membership_percentage}}</td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 60px;">
    <p><strong>IN WITNESS WHEREOF</strong>, the undersigned have executed this Operating Agreement as of the Effective Date.</p>
    
    <div style="margin-top: 40px;">
      <p><strong>MANAGER:</strong></p>
      <p style="margin-top: 30px;">_______________________________________</p>
      <p>{{manager_name}}</p>
    </div>

    <div style="margin-top: 40px;">
      <p><strong>MEMBER:</strong></p>
      <p style="margin-top: 30px;">_______________________________________</p>
      <p>{{investor_name}}</p>
    </div>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // PRIVATE PLACEMENT MEMORANDUM
  // ============================================================================
  {
    name: 'Private Placement Memorandum',
    description: 'PPM for securities offering disclosure',
    category: 'PPM',
    variables: JSON.stringify([
      '{{company_name}}',
      '{{llc_name}}',
      '{{project_name}}',
      '{{project_address}}',
      '{{project_description}}',
      '{{total_offering}}',
      '{{minimum_investment}}',
      '{{maximum_investors}}',
      '{{target_irr}}',
      '{{target_equity_multiple}}',
      '{{preferred_return}}',
      '{{hold_period}}',
      '{{manager_name}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 40px; line-height: 1.6; font-size: 11pt;">
  <div style="border: 2px solid #c00; padding: 20px; margin-bottom: 30px; background: #fff5f5;">
    <p style="font-weight: bold; text-align: center; color: #c00; margin: 0 0 10px 0;">CONFIDENTIAL PRIVATE PLACEMENT MEMORANDUM</p>
    <p style="font-size: 10pt; margin: 0; text-align: center;">This document contains confidential information and is intended solely for the use of the prospective investor to whom it is addressed. Any reproduction or distribution of this document, in whole or in part, without prior written consent is prohibited.</p>
  </div>

  <h1 style="text-align: center; font-size: 20pt; margin-bottom: 10px;">{{llc_name}}</h1>
  <h2 style="text-align: center; font-size: 14pt; font-weight: normal; margin-bottom: 30px;">{{project_name}}</h2>

  <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Total Offering Amount:</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">{{total_offering}}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Minimum Investment:</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">{{minimum_investment}}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Target IRR:</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">{{target_irr}}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Target Equity Multiple:</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">{{target_equity_multiple}}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Preferred Return:</strong></td>
      <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">{{preferred_return}}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0;"><strong>Projected Hold Period:</strong></td>
      <td style="padding: 8px 0; text-align: right;">{{hold_period}}</td>
    </tr>
  </table>

  <p style="text-align: center; font-size: 10pt; color: #666;">Memorandum Date: {{date}}</p>

  <div style="border: 1px solid #c00; padding: 15px; margin: 30px 0; background: #fff;">
    <p style="font-weight: bold; color: #c00; margin: 0 0 10px 0;">IMPORTANT NOTICES</p>
    <p style="font-size: 10pt; margin: 0 0 10px 0;">THE SECURITIES OFFERED HEREBY HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE "ACT"), OR THE SECURITIES LAWS OF ANY STATE AND ARE BEING OFFERED AND SOLD IN RELIANCE ON EXEMPTIONS FROM THE REGISTRATION REQUIREMENTS OF SUCH LAWS.</p>
    <p style="font-size: 10pt; margin: 0;">THESE SECURITIES ARE SUBJECT TO RESTRICTIONS ON TRANSFERABILITY AND RESALE AND MAY NOT BE TRANSFERRED OR RESOLD EXCEPT AS PERMITTED UNDER THE ACT AND APPLICABLE STATE SECURITIES LAWS.</p>
  </div>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">I. EXECUTIVE SUMMARY</h2>

  <p>{{company_name}} (the "Sponsor") is pleased to present this investment opportunity in {{project_name}}, a real estate development project located at {{project_address}}.</p>

  <p><strong>Project Overview:</strong> {{project_description}}</p>

  <h3>Investment Highlights</h3>
  <ul>
    <li>Experienced management team with proven track record in Lane County</li>
    <li>Strong local market fundamentals with growing housing demand</li>
    <li>Conservative underwriting with multiple exit strategies</li>
    <li>Alignment of interests through co-investment by Sponsor</li>
    <li>Transparent reporting and investor communication</li>
  </ul>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">II. THE OFFERING</h2>

  <p><strong>Issuer:</strong> {{llc_name}}, an Oregon limited liability company</p>
  <p><strong>Manager:</strong> {{manager_name}}</p>
  <p><strong>Securities Offered:</strong> Membership interests in the LLC</p>
  <p><strong>Offering Amount:</strong> {{total_offering}} in equity capital</p>
  <p><strong>Minimum Investment:</strong> {{minimum_investment}} per investor</p>
  <p><strong>Maximum Investors:</strong> {{maximum_investors}} (accredited investors only)</p>
  <p><strong>Use of Proceeds:</strong> Land acquisition, construction, soft costs, and reserves</p>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">III. DISTRIBUTION WATERFALL</h2>

  <p>Distributions will be made in the following priority:</p>
  <ol>
    <li><strong>Preferred Return:</strong> {{preferred_return}} per annum to investors on unreturned capital</li>
    <li><strong>Return of Capital:</strong> 100% to investors until capital is returned</li>
    <li><strong>Promote:</strong> Remaining profits split 70% to investors / 30% to Sponsor</li>
  </ol>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">IV. RISK FACTORS</h2>

  <p style="font-weight: bold;">Investment in the Company involves significant risks. Prospective investors should carefully consider the following risk factors:</p>

  <ul>
    <li><strong>Illiquidity:</strong> Membership interests are not publicly traded and are subject to transfer restrictions.</li>
    <li><strong>Construction Risk:</strong> Cost overruns, delays, and contractor issues may impact returns.</li>
    <li><strong>Market Risk:</strong> Changes in real estate market conditions may affect property values and sale timing.</li>
    <li><strong>Interest Rate Risk:</strong> Rising interest rates may increase financing costs and reduce buyer demand.</li>
    <li><strong>Regulatory Risk:</strong> Changes in zoning, building codes, or other regulations may affect the project.</li>
    <li><strong>Manager Dependence:</strong> The Company is dependent on the Manager for key decisions.</li>
    <li><strong>No Guaranteed Returns:</strong> There is no assurance that projected returns will be achieved.</li>
    <li><strong>Loss of Investment:</strong> Investors may lose all or a substantial portion of their investment.</li>
  </ul>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">V. INVESTOR QUALIFICATIONS</h2>

  <p>This offering is available only to "accredited investors" as defined in Rule 501(a) of Regulation D under the Securities Act. Generally, this includes individuals with:</p>
  <ul>
    <li>Net worth exceeding $1,000,000 (excluding primary residence), or</li>
    <li>Income exceeding $200,000 ($300,000 with spouse) in each of the past two years with expectation of the same in the current year</li>
  </ul>

  <h2 style="margin-top: 40px; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px;">VI. SUBSCRIPTION PROCEDURES</h2>

  <p>To subscribe for membership interests, prospective investors must:</p>
  <ol>
    <li>Review this Private Placement Memorandum and all exhibits</li>
    <li>Complete and sign the Subscription Agreement</li>
    <li>Complete the Accredited Investor Questionnaire</li>
    <li>Wire funds per the instructions provided</li>
  </ol>

  <div style="margin-top: 50px; padding: 20px; background: #f5f5f5; border-radius: 5px;">
    <p style="font-weight: bold; margin: 0 0 10px 0;">For More Information Contact:</p>
    <p style="margin: 0;">{{manager_name}}</p>
    <p style="margin: 0;">{{company_name}}</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // SUBSCRIPTION AGREEMENT
  // ============================================================================
  {
    name: 'Subscription Agreement',
    description: 'Investment subscription agreement for LLC membership interests',
    category: 'SUBSCRIPTION_AGREEMENT',
    variables: JSON.stringify([
      '{{llc_name}}',
      '{{project_name}}',
      '{{investor_name}}',
      '{{investor_address}}',
      '{{investor_email}}',
      '{{investor_phone}}',
      '{{investor_ssn_ein}}',
      '{{investment_amount}}',
      '{{number_of_units}}',
      '{{price_per_unit}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 40px; line-height: 1.6; font-size: 11pt;">
  <h1 style="text-align: center; font-size: 18pt;">SUBSCRIPTION AGREEMENT</h1>
  <h2 style="text-align: center; font-size: 14pt; font-weight: normal;">{{llc_name}}</h2>
  <p style="text-align: center; margin-bottom: 40px;">{{project_name}}</p>

  <p>The undersigned (the "Subscriber") hereby subscribes for membership interests in {{llc_name}} (the "Company") on the terms set forth below and in the Company's Operating Agreement and Private Placement Memorandum.</p>

  <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">1. SUBSCRIPTION</h3>

  <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; width: 50%;"><strong>Investment Amount:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investment_amount}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Number of Units:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{number_of_units}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Price Per Unit:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{price_per_unit}}</td>
    </tr>
  </table>

  <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">2. SUBSCRIBER INFORMATION</h3>

  <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Name:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investor_name}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investor_address}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investor_email}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investor_phone}}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>SSN/EIN:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">{{investor_ssn_ein}}</td>
    </tr>
  </table>

  <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">3. REPRESENTATIONS AND WARRANTIES</h3>

  <p>The Subscriber represents and warrants that:</p>

  <p><strong>(a) Accredited Investor Status.</strong> The Subscriber is an "accredited investor" as defined in Rule 501(a) of Regulation D under the Securities Act of 1933.</p>

  <p><strong>(b) Investment Purpose.</strong> The Subscriber is acquiring the membership interests for investment purposes only and not with a view to distribution or resale.</p>

  <p><strong>(c) Access to Information.</strong> The Subscriber has received and reviewed the Private Placement Memorandum, Operating Agreement, and all other documents provided by the Company. The Subscriber has had the opportunity to ask questions and receive answers from the Company.</p>

  <p><strong>(d) Risk Acknowledgment.</strong> The Subscriber understands that this investment involves substantial risk and that the Subscriber may lose all or a substantial portion of the investment. The Subscriber has the financial ability to bear the economic risk of this investment.</p>

  <p><strong>(e) No Guarantees.</strong> The Subscriber acknowledges that no representations or guarantees have been made regarding the tax consequences, future value, or profitability of this investment.</p>

  <p><strong>(f) Restrictions on Transfer.</strong> The Subscriber understands that the membership interests have not been registered under federal or state securities laws and cannot be sold or transferred except in compliance with applicable securities laws and the Operating Agreement.</p>

  <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">4. ACCEPTANCE</h3>

  <p>The Subscriber understands that this subscription is subject to acceptance by the Company in its sole discretion. The Company reserves the right to reject any subscription in whole or in part.</p>

  <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">5. GOVERNING LAW</h3>

  <p>This Agreement shall be governed by and construed in accordance with the laws of the State of Oregon.</p>

  <div style="margin-top: 50px;">
    <p><strong>SUBSCRIBER:</strong></p>
    <p style="margin-top: 40px;">Signature: _______________________________________</p>
    <p>Print Name: {{investor_name}}</p>
    <p>Date: {{date}}</p>
  </div>

  <div style="margin-top: 50px; border-top: 2px solid #000; padding-top: 20px;">
    <p><strong>ACCEPTED BY THE COMPANY:</strong></p>
    <p style="margin-top: 40px;">Signature: _______________________________________</p>
    <p>Name: _______________________________________</p>
    <p>Title: Manager</p>
    <p>Date: _______________________________________</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // INVESTOR PACKET COVER
  // ============================================================================
  {
    name: 'Investor Packet Cover Sheet',
    description: 'Cover page and table of contents for investor document packages',
    category: 'INVESTOR_PACKET',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{project_name}}',
      '{{llc_name}}',
      '{{investment_amount}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 60px 40px;">
  <div style="text-align: center; margin-bottom: 80px;">
    <h1 style="color: #2d5a3d; font-size: 36pt; margin-bottom: 10px; letter-spacing: 2px;">INVESTOR PACKET</h1>
    <div style="width: 100px; height: 3px; background: #2d5a3d; margin: 20px auto;"></div>
  </div>

  <div style="text-align: center; margin-bottom: 60px;">
    <h2 style="font-size: 24pt; margin-bottom: 15px; color: #333;">{{project_name}}</h2>
    <p style="font-size: 14pt; color: #666;">{{llc_name}}</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 60px;">
    <table style="width: 100%;">
      <tr>
        <td style="padding: 10px 0; font-size: 14pt;"><strong>Prepared For:</strong></td>
        <td style="padding: 10px 0; font-size: 14pt; text-align: right;">{{investor_name}}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 14pt;"><strong>Investment Amount:</strong></td>
        <td style="padding: 10px 0; font-size: 14pt; text-align: right;">{{investment_amount}}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 14pt;"><strong>Date:</strong></td>
        <td style="padding: 10px 0; font-size: 14pt; text-align: right;">{{date}}</td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 60px;">
    <h3 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-bottom: 20px;">CONTENTS</h3>
    <table style="width: 100%;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc;">1. Welcome Letter</td>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc; text-align: right; color: #666;">Page 2</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc;">2. Private Placement Memorandum</td>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc; text-align: right; color: #666;">Page 4</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc;">3. Operating Agreement</td>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc; text-align: right; color: #666;">Page 18</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc;">4. Subscription Agreement</td>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc; text-align: right; color: #666;">Page 32</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc;">5. Accredited Investor Questionnaire</td>
        <td style="padding: 12px 0; border-bottom: 1px dotted #ccc; text-align: right; color: #666;">Page 36</td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">6. Wire Instructions</td>
        <td style="padding: 12px 0; text-align: right; color: #666;">Page 38</td>
      </tr>
    </table>
  </div>

  <div style="border: 1px solid #ddd; padding: 20px; background: #fff5f5; border-radius: 5px;">
    <p style="margin: 0; font-size: 10pt; color: #666;"><strong>CONFIDENTIAL:</strong> This investor packet contains confidential information intended solely for the named recipient. Please do not distribute without authorization.</p>
  </div>

  <div style="position: fixed; bottom: 40px; text-align: center; width: 720px;">
    <p style="color: #999; font-size: 10pt;">Lane County Housing Development | Building Communities, Creating Value</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // K-1 TAX DOCUMENT COVER LETTER
  // ============================================================================
  {
    name: 'K-1 Distribution Cover Letter',
    description: 'Cover letter accompanying annual K-1 tax documents',
    category: 'TAX_DOCUMENT',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{investor_address}}',
      '{{llc_name}}',
      '{{project_name}}',
      '{{tax_year}}',
      '{{company_name}}',
      '{{company_address}}',
      '{{company_phone}}',
      '{{company_email}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px;">
    <h1 style="color: #2d5a3d; margin: 0; font-size: 28px;">Lane County Housing Development</h1>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Building Communities, Creating Value</p>
  </div>

  <p style="text-align: right; color: #666;">{{date}}</p>

  <p style="margin-top: 20px;">
    {{investor_name}}<br>
    {{investor_address}}
  </p>

  <p style="margin-top: 30px;"><strong>RE: {{tax_year}} Schedule K-1 - {{llc_name}} ({{project_name}})</strong></p>

  <p>Dear {{investor_name}},</p>

  <p>Enclosed please find your Schedule K-1 (Form 1065) for the {{tax_year}} tax year for your investment in <strong>{{llc_name}}</strong>.</p>

  <h2 style="color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px; font-size: 16px;">Important Information</h2>

  <p>The K-1 reports your share of the partnership's income, deductions, credits, and other items for federal income tax purposes. Please provide this document to your tax preparer for inclusion in your {{tax_year}} federal and state tax returns.</p>

  <h3 style="color: #333; margin-top: 20px; font-size: 14px;">Key Items to Note:</h3>
  <ul style="padding-left: 20px;">
    <li><strong>Box 1 - Ordinary Business Income (Loss):</strong> Your share of net income or loss from operations.</li>
    <li><strong>Box 2 - Net Rental Real Estate Income (Loss):</strong> Your share of rental income or loss, if applicable.</li>
    <li><strong>Box 19 - Distributions:</strong> Cash distributions received during the tax year.</li>
    <li><strong>Capital Account Analysis:</strong> Review the capital account section for your beginning/ending balance.</li>
  </ul>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 30px 0;">
    <p style="margin: 0; font-weight: bold; color: #333;">Tax Filing Deadline Reminder</p>
    <p style="margin: 10px 0 0 0;">Individual tax returns (Form 1040) are generally due April 15. If you anticipate needing more time, please consult with your tax advisor about filing an extension.</p>
  </div>

  <h2 style="color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px; font-size: 16px;">State Tax Filings</h2>

  <p>Depending on your state of residence, you may need to file state income tax returns reporting this K-1 income. Oregon residents should include this on their Oregon Form 40. Please consult with your tax advisor regarding your specific state filing requirements.</p>

  <h2 style="color: #2d5a3d; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 30px; font-size: 16px;">Questions?</h2>

  <p>If you have any questions regarding your K-1 or need additional documentation, please don't hesitate to contact us. For tax-specific questions, we recommend consulting with your personal tax advisor or CPA.</p>

  <p style="margin-top: 30px;">Thank you for your continued investment in {{project_name}}. We appreciate your trust in our team.</p>

  <div style="margin-top: 40px;">
    <p style="margin-bottom: 5px;">Sincerely,</p>
    <p style="margin: 0; font-weight: bold; color: #2d5a3d;">Lane County Housing Development</p>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">{{company_address}}</p>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">{{company_phone}} | {{company_email}}</p>
  </div>

  <div style="margin-top: 40px; padding: 15px; border: 1px solid #ddd; background: #fff;">
    <p style="margin: 0; font-size: 10pt; color: #666;"><strong>Enclosures:</strong> Schedule K-1 (Form 1065)</p>
    <p style="margin: 5px 0 0 0; font-size: 10pt; color: #666;"><strong>Important:</strong> This document is for informational purposes. Please consult with a qualified tax professional for specific tax advice.</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // DISTRIBUTION NOTICE
  // ============================================================================
  {
    name: 'Distribution Notice',
    description: 'Notification of upcoming distribution to investors',
    category: 'DISTRIBUTION_NOTICE',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{llc_name}}',
      '{{project_name}}',
      '{{distribution_amount}}',
      '{{distribution_type}}',
      '{{distribution_date}}',
      '{{capital_returned}}',
      '{{preferred_return_paid}}',
      '{{profit_distribution}}',
      '{{remaining_capital}}',
      '{{total_distributions_to_date}}',
      '{{company_name}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px;">
    <h1 style="color: #2d5a3d; margin: 0; font-size: 28px;">Lane County Housing Development</h1>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Building Communities, Creating Value</p>
  </div>

  <div style="background: #2d5a3d; color: white; padding: 20px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0; font-size: 22px;">DISTRIBUTION NOTICE</h2>
  </div>

  <p style="text-align: right; color: #666;">{{date}}</p>

  <p style="margin-top: 20px;">Dear {{investor_name}},</p>

  <p>We are pleased to inform you that a distribution has been approved for <strong>{{llc_name}}</strong> ({{project_name}}).</p>

  <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #2d5a3d; margin: 0 0 20px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Distribution Summary</h3>
    <table style="width: 100%;">
      <tr>
        <td style="padding: 10px 0; font-size: 14pt;"><strong>Distribution Type:</strong></td>
        <td style="padding: 10px 0; font-size: 14pt; text-align: right;">{{distribution_type}}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-size: 14pt;"><strong>Distribution Date:</strong></td>
        <td style="padding: 10px 0; font-size: 14pt; text-align: right;">{{distribution_date}}</td>
      </tr>
      <tr style="background: #e8f5e9;">
        <td style="padding: 15px 10px; font-size: 16pt;"><strong>Your Distribution Amount:</strong></td>
        <td style="padding: 15px 10px; font-size: 16pt; text-align: right; color: #2d5a3d;"><strong>{{distribution_amount}}</strong></td>
      </tr>
    </table>
  </div>

  <h3 style="color: #2d5a3d; margin-top: 30px;">Distribution Breakdown</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Return of Capital</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">{{capital_returned}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Preferred Return</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">{{preferred_return_paid}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Profit Distribution</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">{{profit_distribution}}</td>
    </tr>
    <tr style="font-weight: bold;">
      <td style="padding: 10px;">Total Distribution</td>
      <td style="padding: 10px; text-align: right;">{{distribution_amount}}</td>
    </tr>
  </table>

  <h3 style="color: #2d5a3d; margin-top: 30px;">Your Investment Status</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Remaining Capital Balance</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">{{remaining_capital}}</td>
    </tr>
    <tr>
      <td style="padding: 10px;">Total Distributions to Date</td>
      <td style="padding: 10px; text-align: right;">{{total_distributions_to_date}}</td>
    </tr>
  </table>

  <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 30px 0; border-left: 4px solid #ffc107;">
    <p style="margin: 0; font-size: 12pt;"><strong>Payment Method:</strong> Funds will be deposited via ACH to the bank account on file. Please allow 2-3 business days for the funds to appear in your account.</p>
  </div>

  <p>If you have any questions about this distribution or need to update your banking information, please contact us immediately.</p>

  <p style="margin-top: 30px;">Thank you for your continued partnership.</p>

  <div style="margin-top: 40px;">
    <p style="margin-bottom: 5px;">Warm regards,</p>
    <p style="margin: 0; font-weight: bold; color: #2d5a3d;">{{company_name}}</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // PROJECT UPDATE
  // ============================================================================
  {
    name: 'Quarterly Project Update',
    description: 'Quarterly update template for investor communications',
    category: 'PROJECT_UPDATE',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{project_name}}',
      '{{llc_name}}',
      '{{quarter}}',
      '{{year}}',
      '{{project_status}}',
      '{{completion_percentage}}',
      '{{construction_update}}',
      '{{budget_status}}',
      '{{timeline_update}}',
      '{{market_update}}',
      '{{next_milestones}}',
      '{{company_name}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px;">
    <h1 style="color: #2d5a3d; margin: 0; font-size: 28px;">Lane County Housing Development</h1>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Building Communities, Creating Value</p>
  </div>

  <div style="background: linear-gradient(135deg, #2d5a3d 0%, #3d7a5d 100%); color: white; padding: 30px; text-align: center; margin-bottom: 30px; border-radius: 8px;">
    <h2 style="margin: 0 0 10px 0; font-size: 24px;">{{quarter}} {{year}} PROJECT UPDATE</h2>
    <p style="margin: 0; font-size: 18px; opacity: 0.9;">{{project_name}}</p>
  </div>

  <p style="text-align: right; color: #666;">{{date}}</p>

  <p>Dear {{investor_name}},</p>

  <p>We are pleased to provide you with the {{quarter}} {{year}} update for your investment in <strong>{{llc_name}}</strong>.</p>

  <!-- Project Status Card -->
  <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #2d5a3d; margin: 0 0 20px 0;">Project Snapshot</h3>
    <table style="width: 100%;">
      <tr>
        <td style="padding: 10px 0;"><strong>Current Status:</strong></td>
        <td style="padding: 10px 0; text-align: right;">
          <span style="background: #2d5a3d; color: white; padding: 5px 15px; border-radius: 20px;">{{project_status}}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;"><strong>Completion:</strong></td>
        <td style="padding: 10px 0; text-align: right;">
          <div style="background: #e0e0e0; border-radius: 10px; height: 20px; width: 200px; display: inline-block; vertical-align: middle;">
            <div style="background: #2d5a3d; border-radius: 10px; height: 20px; width: {{completion_percentage}};"></div>
          </div>
          <span style="margin-left: 10px;">{{completion_percentage}}</span>
        </td>
      </tr>
    </table>
  </div>

  <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-top: 40px;">Construction Update</h2>
  <p>{{construction_update}}</p>

  <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-top: 40px;">Budget Status</h2>
  <p>{{budget_status}}</p>

  <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-top: 40px;">Timeline Update</h2>
  <p>{{timeline_update}}</p>

  <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-top: 40px;">Market Conditions</h2>
  <p>{{market_update}}</p>

  <div style="background: #e8f5e9; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2d5a3d;">
    <h3 style="color: #2d5a3d; margin: 0 0 15px 0;">Upcoming Milestones</h3>
    <p style="margin: 0;">{{next_milestones}}</p>
  </div>

  <h2 style="color: #2d5a3d; border-bottom: 2px solid #2d5a3d; padding-bottom: 10px; margin-top: 40px;">Photos</h2>
  <p style="color: #666; font-style: italic;">[Project photos would be inserted here]</p>

  <p style="margin-top: 40px;">As always, we remain committed to transparent communication and delivering strong returns for our investors. If you have any questions or would like to schedule a site visit, please don't hesitate to reach out.</p>

  <p>Thank you for your continued trust and partnership.</p>

  <div style="margin-top: 40px;">
    <p style="margin-bottom: 5px;">Warm regards,</p>
    <p style="margin: 0; font-weight: bold; color: #2d5a3d;">{{company_name}}</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // ACCREDITED INVESTOR QUESTIONNAIRE
  // ============================================================================
  {
    name: 'Accredited Investor Questionnaire',
    description: 'Questionnaire to verify accredited investor status',
    category: 'INVESTOR_PACKET',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 40px; line-height: 1.6; font-size: 11pt;">
  <h1 style="text-align: center; font-size: 18pt; margin-bottom: 30px;">ACCREDITED INVESTOR QUESTIONNAIRE</h1>

  <p>The securities being offered have not been registered under the Securities Act of 1933 (the "Act") and are being offered in reliance on exemptions from registration. This questionnaire is designed to determine whether the undersigned meets the requirements for "accredited investor" status under Rule 501(a) of Regulation D.</p>

  <div style="background: #f5f5f5; padding: 20px; margin: 30px 0; border-radius: 5px;">
    <p style="margin: 0;"><strong>Investor Name:</strong> {{investor_name}}</p>
    <p style="margin: 10px 0 0 0;"><strong>Date:</strong> {{date}}</p>
  </div>

  <h2 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">INDIVIDUAL INVESTORS</h2>

  <p><strong>Please check all that apply:</strong></p>

  <div style="margin: 20px 0; padding-left: 20px;">
    <p style="margin: 15px 0;">
      ☐ I have an individual net worth, or joint net worth with my spouse/spousal equivalent, exceeding $1,000,000 (excluding the value of my primary residence).
    </p>
    
    <p style="margin: 15px 0;">
      ☐ I had individual income in excess of $200,000 in each of the two most recent years and have a reasonable expectation of reaching the same income level in the current year.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ I had joint income with my spouse/spousal equivalent in excess of $300,000 in each of the two most recent years and have a reasonable expectation of reaching the same income level in the current year.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ I hold in good standing one or more of the following professional certifications: Series 7, Series 65, or Series 82.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ I am a "knowledgeable employee" of the fund (as defined in Rule 3c-5(a)(4) under the Investment Company Act).
    </p>
  </div>

  <h2 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">ENTITY INVESTORS</h2>

  <p><strong>If investing through an entity, please check all that apply:</strong></p>

  <div style="margin: 20px 0; padding-left: 20px;">
    <p style="margin: 15px 0;">
      ☐ The entity is a bank, insurance company, registered investment company, business development company, or small business investment company.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ The entity is an employee benefit plan with total assets in excess of $5,000,000.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ The entity is a corporation, partnership, or limited liability company with total assets in excess of $5,000,000 that was not formed for the specific purpose of acquiring the securities offered.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ The entity is a trust with total assets in excess of $5,000,000 that was not formed for the specific purpose of acquiring the securities offered, and whose purchase is directed by a sophisticated person.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ The entity is an entity in which all of the equity owners are accredited investors.
    </p>
    
    <p style="margin: 15px 0;">
      ☐ The entity is a family office with at least $5,000,000 in assets under management.
    </p>
  </div>

  <h2 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">CERTIFICATION</h2>

  <p>I hereby certify that the information provided above is true and accurate. I understand that the Company will rely on this information in determining whether to accept my subscription for securities.</p>

  <p>I agree to notify the Company promptly if any of the information provided in this questionnaire changes prior to the acceptance of my subscription.</p>

  <div style="margin-top: 50px;">
    <p>Signature: _______________________________________</p>
    <p>Print Name: {{investor_name}}</p>
    <p>Date: {{date}}</p>
  </div>

  <div style="margin-top: 40px; padding: 15px; border: 1px solid #ddd; background: #fff5f5; font-size: 10pt;">
    <p style="margin: 0;"><strong>IMPORTANT:</strong> Providing false information on this questionnaire may constitute a violation of federal and state securities laws. The Company reserves the right to request additional documentation to verify accredited investor status.</p>
  </div>
</div>
    `.trim()
  },

  // ============================================================================
  // WIRE INSTRUCTIONS
  // ============================================================================
  {
    name: 'Wire Transfer Instructions',
    description: 'Bank wire instructions for investor funding',
    category: 'INVESTOR_PACKET',
    variables: JSON.stringify([
      '{{investor_name}}',
      '{{llc_name}}',
      '{{project_name}}',
      '{{investment_amount}}',
      '{{bank_name}}',
      '{{bank_address}}',
      '{{account_name}}',
      '{{account_number}}',
      '{{routing_number}}',
      '{{swift_code}}',
      '{{reference}}',
      '{{date}}'
    ]),
    content: `
<div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2d5a3d; padding-bottom: 20px;">
    <h1 style="color: #2d5a3d; margin: 0; font-size: 28px;">Lane County Housing Development</h1>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Building Communities, Creating Value</p>
  </div>

  <h2 style="text-align: center; color: #333; margin-bottom: 30px;">WIRE TRANSFER INSTRUCTIONS</h2>

  <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
    <table style="width: 100%;">
      <tr>
        <td style="padding: 8px 0;"><strong>Investor:</strong></td>
        <td style="padding: 8px 0;">{{investor_name}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Investment Entity:</strong></td>
        <td style="padding: 8px 0;">{{llc_name}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Project:</strong></td>
        <td style="padding: 8px 0;">{{project_name}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;"><strong>Amount Due:</strong></td>
        <td style="padding: 8px 0; font-weight: bold; color: #2d5a3d; font-size: 18px;">{{investment_amount}}</td>
      </tr>
    </table>
  </div>

  <div style="border: 2px solid #2d5a3d; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
    <h3 style="color: #2d5a3d; margin: 0 0 20px 0; text-align: center;">DOMESTIC WIRE INSTRUCTIONS</h3>
    
    <table style="width: 100%;">
      <tr>
        <td style="padding: 12px; background: #f5f5f5; width: 40%; font-weight: bold;">Bank Name:</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">{{bank_name}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">Bank Address:</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">{{bank_address}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">Account Name:</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd;">{{account_name}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">Account Number:</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 14pt;">{{account_number}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">Routing Number (ABA):</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 14pt;">{{routing_number}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">SWIFT Code:</td>
        <td style="padding: 12px; border-bottom: 1px solid #ddd; font-family: monospace;">{{swift_code}}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f5f5f5; font-weight: bold;">Reference/Memo:</td>
        <td style="padding: 12px; font-weight: bold; color: #c00;">{{reference}}</td>
      </tr>
    </table>
  </div>

  <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
    <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ IMPORTANT INSTRUCTIONS</h4>
    <ol style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 10px;">Please include the <strong>Reference/Memo</strong> exactly as shown above to ensure proper crediting of your investment.</li>
      <li style="margin-bottom: 10px;">Verify all wire details with your bank before initiating the transfer.</li>
      <li style="margin-bottom: 10px;">Allow 1-2 business days for domestic wires to be received and processed.</li>
      <li style="margin-bottom: 10px;">Please email a copy of your wire confirmation to confirm your transfer.</li>
    </ol>
  </div>

  <div style="background: #f8d7da; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #c00;">
    <h4 style="margin: 0 0 10px 0; color: #721c24;">🔒 SECURITY NOTICE</h4>
    <p style="margin: 0;">Wire fraud is a serious concern. These wire instructions will NEVER change via email. If you receive any communication requesting a change to these instructions, please call us directly to verify before sending any funds.</p>
  </div>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="color: #666; font-size: 12pt;">Questions? Contact us directly.</p>
    <p style="color: #666; font-size: 12pt;">Do not reply to this document - call to verify any changes.</p>
  </div>
</div>
    `.trim()
  }
]

async function seedTemplates() {
  console.log('🌱 Seeding document templates...')
  
  // First, find an admin user to be the creator
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    console.error('❌ No admin user found. Please create an admin user first.')
    process.exit(1)
  }
  
  console.log(`📝 Using admin user: ${adminUser.name} (${adminUser.email})`)
  
  for (const template of templates) {
    // Check if template already exists
    const existing = await prisma.documentTemplate.findFirst({
      where: { name: template.name }
    })
    
    if (existing) {
      console.log(`  ⏭️  Skipping "${template.name}" - already exists`)
      continue
    }
    
    await prisma.documentTemplate.create({
      data: {
        ...template,
        createdById: adminUser.id
      }
    })
    
    console.log(`  ✅ Created template: ${template.name}`)
  }
  
  console.log('\n✨ Template seeding complete!')
}

seedTemplates()
  .catch((e) => {
    console.error('Error seeding templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
