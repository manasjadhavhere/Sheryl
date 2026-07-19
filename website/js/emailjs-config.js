/* ============================================================
   SHERYL PHARMACEUTICALS — EmailJS Configuration
   ============================================================
   HOW TO CONFIGURE:
   1. Go to https://www.emailjs.com and create a free account
   2. Add an Email Service (connect Gmail / Outlook)
   3. Create TWO email templates:
        a) "contact_form"   — for Contact Us & Business Enquiry
        b) "careers_form"   — for Career Applications
   4. Copy your Public Key, Service ID, and Template IDs below
   ============================================================ */

const EMAILJS_CONFIG = {
  publicKey:          'YOUR_PUBLIC_KEY',          // Account > API Keys > Public Key
  serviceId:          'YOUR_SERVICE_ID',          // Email Services > Service ID
  contactTemplateId:  'YOUR_CONTACT_TEMPLATE_ID', // Email Templates > contact_form ID
  careersTemplateId:  'YOUR_CAREERS_TEMPLATE_ID'  // Email Templates > careers_form ID
};

/* ---- DO NOT EDIT BELOW THIS LINE ---- */
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
