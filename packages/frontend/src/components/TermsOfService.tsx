import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-lg font-semibold mb-4">Paper Terms of Service</h2>
      
      <div className="space-y-4 text-sm text-gray-600">
        <section>
          <h3 className="font-medium text-gray-800">1. Acceptance of Terms</h3>
          <p>By using Paper, you agree to these Terms of Service. If you don't agree, please don't use our service.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">2. Use of Service</h3>
          <p>You may use Paper to create, edit, and share documents. You agree to use the service responsibly and legally.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">3. Your Content</h3>
          <p>You retain ownership of content you create on Paper. By publishing content, you grant Paper a license to display and distribute it according to your chosen settings.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">4. Privacy</h3>
          <p>We respect your privacy and will only use your email address for authentication and important service notifications.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">5. Prohibited Use</h3>
          <p>You may not use Paper for illegal activities, spam, harassment, or to distribute malicious content.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">6. Service Availability</h3>
          <p>We strive to keep Paper available 24/7 but cannot guarantee uninterrupted service.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">7. Changes to Terms</h3>
          <p>We may update these terms occasionally. Continued use of Paper constitutes acceptance of any changes.</p>
        </section>

        <section>
          <h3 className="font-medium text-gray-800">8. Contact</h3>
          <p>If you have questions about these terms, please contact us through the Paper platform.</p>
        </section>
      </div>
    </div>
  );
};