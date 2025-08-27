import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface EmailConfirmationProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const EmailConfirmationTemplate = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: EmailConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Discover Larne! Please confirm your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${supabase_url}/storage/v1/object/public/assets/logo.png`}
            width="48"
            height="48"
            alt="Discover Larne"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welcome to Discover Larne!</Heading>
        
        <Text style={text}>
          Hi there! Thanks for signing up to explore the best of Larne.
        </Text>
        
        <Text style={text}>
          We're excited to help you discover amazing local businesses, attractions, and experiences in Larne. 
          To get started, please confirm your email address by clicking the button below:
        </Text>

        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          >
            Confirm Email Address
          </Button>
        </Section>

        <Text style={text}>
          Or copy and paste this link into your browser:
        </Text>
        
        <Link
          href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          target="_blank"
          style={link}
        >
          {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
        </Link>

        <Section style={benefitsSection}>
          <Heading style={h2}>What you can do with Discover Larne:</Heading>
          <Text style={benefitText}>🏪 Explore local businesses and services</Text>
          <Text style={benefitText}>📍 Find the best attractions and places to visit</Text>
          <Text style={benefitText}>⭐ Read reviews from the community</Text>
          <Text style={benefitText}>📱 Get personalized recommendations</Text>
        </Section>

        <Text style={securityNote}>
          If you didn't create an account with us, you can safely ignore this email.
        </Text>

        <Section style={footer}>
          <Text style={footerText}>
            Best regards,<br />
            The Discover Larne Team
          </Text>
          <Text style={footerCopyright}>
            © 2024 Discover Larne. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailConfirmationTemplate

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  maxWidth: '580px',
}

const logoContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '16px 32px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 8px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 32px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  lineHeight: '24px',
}

const link = {
  color: '#3b82f6',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '16px 32px',
  display: 'block',
}

const benefitsSection = {
  margin: '32px 32px',
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
}

const benefitText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const securityNote = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 32px 16px',
  textAlign: 'center' as const,
}

const footer = {
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
  margin: '32px 32px 0',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
}

const footerCopyright = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
}