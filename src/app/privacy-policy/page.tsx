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
    title: `Privacy Policy - ${siteName}`,
    description: `Privacy policy for ${siteName}. Learn how we collect, use, and protect your personal information when you visit our manga reading website.`,
    alternates: {
      canonical: `${baseUrl}/privacy-policy/`,
    },
    openGraph: {
      title: `Privacy Policy - ${siteName}`,
      description: `Privacy policy for ${siteName}. Learn how we protect your personal information.`,
      url: `${baseUrl}/privacy-policy/`,
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `Privacy Policy - ${siteName}`,
      description: `Privacy policy for ${siteName}. Learn how we protect your personal information.`,
    },
  };
}

export default async function PrivacyPolicyPage() {
  // 加载配置并处理模板变量
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const content = await fs.readFile(siteInfoPath, 'utf8');
  const rawConfig = JSON.parse(content);
  const config = processConfigWithGlobalVariables(rawConfig);
  
  const contactEmail = config.globalVariables.contactEmail;
  const siteName = config.globalVariables.siteName;
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <main className="flex-1 pt-20 bg-surface-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-text-secondary">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-text-primary">
              <div className="bg-surface-secondary rounded-lg p-6 mb-8">
                <p className="text-text-secondary">
                  This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">What personal information do we collect?</h2>
                <p className="text-text-secondary mb-4">
                  We do not collect information from visitors of our site or other details to help you with your experience.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">When do we collect information?</h2>
                <p className="text-text-secondary mb-4">
                  We collect information from you when you provide us with feedback on our products or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">How do we use your information?</h2>
                <p className="text-text-secondary mb-4">
                  We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>To allow us to better service you in responding to your customer service requests.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">How do we protect your information?</h2>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>We do not use vulnerability scanning and/or scanning to PCI standards.</li>
                  <li>We only provide articles and information. We never ask for credit card numbers.</li>
                  <li>We use regular Malware Scanning.</li>
                  <li>We do not use an SSL certificate</li>
                  <li>We only provide articles and information. We never ask for personal or private information like names, email addresses, or credit card numbers.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Do we use 'cookies'?</h2>
                <p className="text-text-secondary mb-4">
                  Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.
                </p>
                <p className="text-text-secondary mb-4">We use cookies to:</p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>Help remember and process the items in the shopping cart.</li>
                  <li>Understand and save user's preferences for future visits.</li>
                  <li>Keep track of advertisements.</li>
                  <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
                </ul>
                <p className="text-text-secondary mb-4">
                  You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Third-party disclosure</h2>
                <p className="text-text-secondary mb-4">
                  We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Third-party links</h2>
                <p className="text-text-secondary mb-4">
                  We do not include or offer third-party products or services on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Google AdSense</h2>
                <p className="text-text-secondary mb-4">
                  We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet.
                </p>
                <p className="text-text-secondary mb-4">
                  Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
                </p>
                <p className="text-text-secondary mb-4">We have implemented the following:</p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>Remarketing with Google AdSense</li>
                  <li>Google Display Network Impression Reporting</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">California Online Privacy Protection Act</h2>
                <p className="text-text-secondary mb-4">
                  CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. According to CalOPPA, we agree to the following:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>Users can visit our site anonymously.</li>
                  <li>Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.</li>
                  <li>Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">How does our site handle Do Not Track signals?</h2>
                <p className="text-text-secondary mb-4">
                  We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Does our site allow third-party behavioral tracking?</h2>
                <p className="text-text-secondary mb-4">
                  It's also important to note that we allow third-party behavioral tracking.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">COPPA (Children Online Privacy Protection Act)</h2>
                <p className="text-text-secondary mb-4">
                  When it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. We do not specifically market to children under the age of 13 years old.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Fair Information Practices</h2>
                <p className="text-text-secondary mb-4">
                  In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>We will notify you via email within 7 business days</li>
                  <li>We will notify the users via in-site notification within 7 business days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">CAN SPAM Act</h2>
                <p className="text-text-secondary mb-4">
                  The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.
                </p>
                <p className="text-text-secondary mb-4">We collect your email address in order to:</p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>Send information, respond to inquiries, and/or other requests or questions</li>
                  <li>Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</li>
                </ul>
                <p className="text-text-secondary mb-4">To be in accordance with CANSPAM, we agree to the following:</p>
                <ul className="list-disc list-inside text-text-secondary mb-4">
                  <li>Not use false or misleading subjects or email addresses.</li>
                  <li>Identify the message as an advertisement in some reasonable way.</li>
                  <li>Include the physical address of our business or site headquarters.</li>
                  <li>Monitor third-party email marketing services for compliance, if one is used.</li>
                  <li>Honor opt-out/unsubscribe requests quickly.</li>
                  <li>Allow users to unsubscribe by using the link at the bottom of each email.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Contacting Us</h2>
                <p className="text-text-secondary mb-4">
                  If there are any questions regarding this privacy policy, you may contact us using the information below.
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
