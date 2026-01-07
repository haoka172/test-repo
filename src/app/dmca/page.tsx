import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';
import { loadSeoConfig } from '@/lib/seo';
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
    title: `DMCA Policy - ${siteName}`,
    description: `Digital Millennium Copyright Act policy for ${siteName}. Learn about our copyright policies, DMCA takedown procedures, and how to report copyright infringement.`,
    alternates: {
      canonical: `${baseUrl}/dmca/`,
    },
    openGraph: {
      title: `DMCA Policy - ${siteName}`,
      description: `Digital Millennium Copyright Act policy for ${siteName}. Learn about our copyright policies and DMCA procedures.`,
      url: `${baseUrl}/dmca/`,
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `DMCA Policy - ${siteName}`,
      description: `Digital Millennium Copyright Act policy for ${siteName}. Learn about our copyright policies and DMCA procedures.`,
    },
  };
}

export default async function DMCAPage() {
  // 加载配置并处理模板变量
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const content = await fs.readFile(siteInfoPath, 'utf8');
  const rawConfig = JSON.parse(content);
  const config = processConfigWithGlobalVariables(rawConfig);
  
  const contactEmail = config.globalVariables.contactEmail;
  const siteName = config.globalVariables.siteName || 'Mojuro Manga';
  const baseUrl = config.baseUrl || 'https://readmojuromanga.online';
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <main className="flex-1 pt-20 bg-surface-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                DMCA
              </h1>
              <p className="text-lg text-text-secondary">
                Digital Millennium Copyright Act Policy
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-text-primary">
              <div className="bg-surface-secondary rounded-lg p-6 mb-8">
                <p className="text-text-secondary">
                  {siteName} doesn't host any content on its own servers and is just linking to or embedding content that was uploaded to popular image hosting sites like Imgur, Cubeupload, Google Drive and such sites.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Copyright Notice</h2>
                <p className="text-text-secondary mb-4">
                  All trademarks, comics, trade names, service marks, copyrighted work, logos referenced herein belong to their respective owners/companies. {siteName} is not responsible for what other people upload to 3rd party sites. We urge all copyright owners, to recognize that the links contained within this site are located somewhere else on the web or image embedded are from other various sites like included above!
                </p>
                <p className="text-text-secondary mb-4">
                  If you have any legal issues please contact the appropriate media file owners or host sites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">DMCA Takedown Notice</h2>
                <p className="text-text-secondary mb-4">
                  If you believe that content available on or through {siteName} infringes one or more of your copyrights, please notify us by providing a written DMCA notice containing the following information:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>A physical or electronic signature of the copyright owner or person authorized to act on behalf of the owner;</li>
                  <li>Identification of the copyrighted work claimed to have been infringed;</li>
                  <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material;</li>
                  <li>Your contact information, including address, telephone number, and email address;</li>
                  <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law;</li>
                  <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are the copyright owner or are authorized to act on behalf of the owner.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Counter-Notification</h2>
                <p className="text-text-secondary mb-4">
                  If you believe that material you posted was removed or access to it was disabled by mistake or misidentification, you may file a counter-notification by providing the following information:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Your physical or electronic signature;</li>
                  <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled;</li>
                  <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification;</li>
                  <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of Federal District Court for the judicial district in which the address is located.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Privacy Information</h2>
                <p className="text-text-secondary mb-4">
                  We may automatically and through third-party tracking services (e.g., Google Analytics) gather certain non-personally identifiable information about your use of {siteName} and store it in log files. This information may include internet protocol (IP) addresses, browser type, internet service provider (ISP), referring/exit pages, operating system, date/time stamps, and related data.
                </p>
                <p className="text-text-secondary mb-4">
                  We use this information, which does not identify individual users, solely to improve the quality of our services. Out of respect for your privacy, we do not link this automatically-collected data to personally identifiable information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Cookies</h2>
                <p className="text-text-secondary mb-4">
                  A cookie is a small text file that is stored on a user's computer for record-keeping purposes. We use both session ID cookies and tracking cookies. We use session cookies to make it easier for you to use {siteName}. A session ID cookie expires when you close your browser.
                </p>
                <p className="text-text-secondary mb-4">
                  We use tracking cookies to better understand how you use {siteName}, and to enhance your user experience. A tracking cookie remains on your hard drive for an extended period of time. You are free to decline cookies, but by doing so, you may not be able to take full advantage of all of our offerings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Updates to This Policy</h2>
                <p className="text-text-secondary mb-4">
                  We may periodically update this policy. If you subscribe, we will attempt to notify you of material updates by email. Otherwise, you may view the updated version of this policy on the {siteName} website available at {baseUrl}/dmca/.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Information</h2>
                <p className="text-text-secondary mb-4">
                  For DMCA notices, counter-notifications, or any questions regarding this policy, please contact us at:
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
