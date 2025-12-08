'use client';

import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import HeroSection2 from '@/component/sections/HeroSection2';
import { MapPin, Phone, Mail, User, AtSign, Info, Pencil } from 'lucide-react';
import Button from '@/component/button/Button';
import { ClientSideStrings } from '@/component/translations/ClientSideTranslations';
import SEO from '@/component/SEO';

type InputProps = {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  name: string;
};

const InputWithIcon = ({ icon, placeholder, type = 'text', name }: InputProps) => (
  <label className="flex items-center gap-3 border-b border-gray-200 py-3">
    <span className="text-gray-500">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
      required
    />
  </label>
);

export default function ContactPage() {
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { contact } = ClientSideStrings();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agree) {
      toast.error('Please agree to the privacy policy.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    setLoading(true);

    try {
      const response = await axios.post('/api/contact', data);

      toast.success(response.data?.message || 'Message sent successfully!');

      form.reset();
      setAgree(false);
    } catch (error: any) {
      console.error('Axios error:', error);
      const message =
        error.response?.data?.message || 'Failed to send message. Please try again later.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO />
      <Toaster position="top-right" reverseOrder={false} />
      <HeroSection2
        bgImage="/6ce6a2448617cf44ef818888d89aebce1e4d2614.jpg"
        text={contact?.heroTitle ?? 'Contact'}
      />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Info */}
          <div>
            <h4 className="text-secondary font-semibold uppercase">
              {contact?.eyebrow ?? 'Contact Us'}
            </h4>

            <h1 className="leading-[1.1]">
              {contact?.headingTop ?? 'Have questions?'}
              <br />
              {contact?.headingBottom ?? 'Get in touch!'}
            </h1>

            <p className="mt-6 text-[#5F5D5A]">
              {contact?.supportText ??
                'Have questions or need assistance? Reach out to our team anytime.'}
            </p>

            <ul className="mt-8 space-y-5 text-[#303B40]">
              <li className="flex items-start gap-3">
                <span className="text-[#002C3F]">
                  <Phone size={20} />
                </span>
                <a href="tel:+34614014277" className="#5F5D5A hover:underline">
                  {contact?.phone ?? '+34 614 014 277'}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-[#002C3F]">
                  <Mail size={20} />
                </span>
                <a href="mailto:Info@Chauffeurio.com" className="#5F5D5A hover:underline">
                  {contact?.email ?? 'Info@Chauffeurio.com'}
                </a>
              </li>
            </ul>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={onSubmit} className="lg:pl-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
              <InputWithIcon icon={<User size={18} />} placeholder="Name" name="name" />
              <InputWithIcon
                icon={<AtSign size={18} />}
                placeholder="Email Address"
                name="email"
                type="email"
              />
              <InputWithIcon icon={<Phone size={18} />} placeholder="Phone" name="phone" />
              <InputWithIcon icon={<Info size={18} />} placeholder="Subject" name="subject" />

              <div className="md:col-span-2 space-y-2">
                <label className="flex items-start gap-3 border-b border-gray-200 py-3">
                  <span className="text-gray-500 mt-0.5">
                    <Pencil size={18} />
                  </span>
                  <textarea
                    name="message"
                    placeholder="How can we help you? Feel free to get in touch!"
                    className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-800 min-h-[90px] resize-y"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
              <Button
                type="submit"
                label={loading ? 'Sending...' : 'Get in Touch'}
                disabled={loading}
              />

              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
                <span>
                  I agree with the{' '}
                  <a href="/terms-condition" className="underline">
                    Privacy Policy
                  </a>.
                </span>
              </label>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
