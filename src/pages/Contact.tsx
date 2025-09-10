import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Please include at least 10 characters")
});

type ContactValues = z.infer<typeof ContactSchema>;

const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });
  
  const { toast } = useToast();
  
  const onSubmit = async (values: ContactValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll reply to your message soon."
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>Discover Larne | Contact</title>
          <meta name="description" content="Contact Discover Larne for media, partnerships, or general enquiries about Larne's people and places." />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/contact'} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ContactPage",
                  name: "Contact Discover Larne",
                  url: `${siteUrl}/contact`
                },
                {
                  "@type": "Organization",
                  name: "Discover Larne",
                  url: siteUrl,
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "customer support",
                      email: "discoverlarne@gmail.com",
                      telephone: "+44 0000 000000"
                    }
                  ]
                }
              ]
            })}
          </script>
        </Helmet>

        <header className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Contact Discover Larne</h1>
          <p className="mt-3 text-muted-foreground">We'd love to hear from you—questions, partnerships, or story ideas are all welcome.</p>
        </header>

        <section className="mt-10 grid gap-10 md:grid-cols-3">
          <article className="md:col-span-2 p-6 rounded-xl border bg-card">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField 
                  control={form.control} 
                  name="name" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" aria-label="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" aria-label="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <FormField 
                  control={form.control} 
                  name="message" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="How can we help?" aria-label="Your message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                <Button 
                  type="submit" 
                  variant="brand" 
                  className="justify-self-start" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </Form>
          </article>

          <aside className="space-y-4">
            <div className="p-6 rounded-xl border bg-card">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-foreground/80" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:discoverlarne@gmail.com" className="text-sm text-muted-foreground underline underline-offset-2">
                    discoverlarne@gmail.com
                  </a>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <Phone className="h-5 w-5 text-foreground/80" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+44 0000 000000</p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-foreground/80" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Larne, Northern Ireland</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;