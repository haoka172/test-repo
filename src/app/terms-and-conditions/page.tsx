import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';
import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';

export async function generateMetadata(): Promise<Metadata> {
  // 加载配置并处理模板变量
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const content = await fs.readFile(siteInfoPath, 'utf8');
  const rawConfig = JSON.parse(content);
  const config = processConfigWithGlobalVariables(rawConfig);
  
  const siteName = config.globalVariables.siteName;
  const baseUrl = config.baseUrl;
  
  return {
    title: `Terms and Conditions - ${siteName}`,
    description: `Terms and conditions for ${siteName}. Read our terms of service, user agreements, and guidelines for using our manga reading platform.`,
    alternates: {
      canonical: `${baseUrl}/terms-and-conditions/`,
    },
    openGraph: {
      title: `Terms and Conditions - ${siteName}`,
      description: `Terms and conditions for ${siteName}. Read our terms of service and user agreements.`,
      url: `${baseUrl}/terms-and-conditions/`,
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Terms and Conditions - ${siteName}`,
      description: `Terms and conditions for ${siteName}. Read our terms of service and user agreements.`,
    },
  };
}

export default async function TermsAndConditionsPage() {
  // 加载配置并处理模板变量
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const content = await fs.readFile(siteInfoPath, 'utf8');
  const rawConfig = JSON.parse(content);
  const config = processConfigWithGlobalVariables(rawConfig);
  
  const contactEmail = config.globalVariables.contactEmail;
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <main className="flex-1 pt-20 bg-surface-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Terms and Conditions
              </h1>
              <p className="text-lg text-text-secondary">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-text-primary">
              <div className="bg-surface-secondary rounded-lg p-6 mb-8">
                <p className="text-text-secondary">
                  These terms and conditions ("Terms", "Agreement") are an agreement between Website Operator ("Website Operator", "us", "we" or "our") and you ("User", "you" or "your"). This Agreement sets forth the general terms and conditions of your use of this website and any of its products or services (collectively, "Website" or "Services").
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Backups</h2>
                <p className="text-text-secondary mb-4">
                  We are not responsible for Content residing on the Website. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Advertisements</h2>
                <p className="text-text-secondary mb-4">
                  During use of the Website, you may enter into correspondence with or participate in promotions of advertisers or sponsors showing their goods or services through the Website. Any such activity, and any terms, conditions, warranties or representations associated with such activity, is solely between you and the applicable third-party. We shall have no liability, obligation or responsibility for any such correspondence, purchase or promotion between you and any such third-party.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Prohibited Uses</h2>
                <p className="text-text-secondary mb-4">
                  In addition to other terms as set forth in the Agreement, you are prohibited from using the Website or its Content:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>For any unlawful purpose</li>
                  <li>To solicit others to perform or participate in any unlawful acts</li>
                  <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet</li>
                  <li>To collect or track the personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet</li>
                </ul>
                <p className="text-text-secondary mb-4">
                  We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Intellectual Property Rights</h2>
                <p className="text-text-secondary mb-4">
                  This Agreement does not transfer from Website Operator to you any Website Operator or third-party intellectual property, and all right, title, and interest in and to such property will remain (as between the parties) solely with Website Operator. All trademarks, service marks, graphics and logos used in connection with our Website or Services, are trademarks or registered trademarks of Website Operator or Website Operator licensors. Other trademarks, service marks, graphics and logos used in connection with our Website or Services may be the trademarks of other third parties. Your use of our Website and Services grants you no right or license to reproduce or otherwise use any Website Operator or third-party trademarks.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Limitation of Liability</h2>
                <p className="text-text-secondary mb-4">
                  To the fullest extent permitted by applicable law, in no event will Website Operator, its affiliates, officers, directors, employees, agents, suppliers or licensors be liable to any person for any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use or content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if Website Operator has been advised as to the possibility of such damages or could have foreseen such damages.
                </p>
                <p className="text-text-secondary mb-4">
                  To the maximum extent permitted by applicable law, the aggregate liability of Website Operator and its affiliates, officers, employees, agents, suppliers and licensors, relating to the services will be limited to an amount greater of one dollar or any amounts actually paid in cash by you to Website Operator for the prior one month period prior to the first event or occurrence giving rise to such liability. The limitations and exclusions also apply if this remedy does not fully compensate you for any losses or fails of its essential purpose.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Indemnification</h2>
                <p className="text-text-secondary mb-4">
                  You agree to indemnify and hold Website Operator and its affiliates, directors, officers, employees, and agents harmless from and against any liabilities, losses, damages or costs, including reasonable attorneys' fees, incurred in connection with or arising from any third-party allegations, claims, actions, disputes, or demands asserted against any of them as a result of or relating to your Content, your use of the Website or Services or any willful misconduct on your part.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Severability</h2>
                <p className="text-text-secondary mb-4">
                  All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding only to the extent that they do not violate any applicable laws and are intended to be limited to the extent necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or portion of any provision of this Agreement shall be held to be illegal, invalid or unenforceable by a court of competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions or portions thereof shall remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Acceptance of These Terms</h2>
                <p className="text-text-secondary mb-4">
                  You acknowledge that you have read this Agreement and agree to all its terms and conditions. By using the Website or its Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to use or access the Website and its Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contacting Us</h2>
                <p className="text-text-secondary mb-4">
                  If you have any questions about this Agreement, please contact us at:
                </p>
                <p className="text-text-secondary">
                  Email: {contactEmail}
                </p>
              </section>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-12">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer contactEmail={contactEmail} headerLogo={config.headerLogo} />
    </div>
  );
}
